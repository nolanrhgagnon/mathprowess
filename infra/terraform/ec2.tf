resource "aws_iam_role" "ec2_role" {
  name = "ec2-ecr-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_security_group" "app_sg" {
    name = "math-prowess"
    description = "Allow HTTP and SSH"

    ingress {
        from_port   = 80 
        to_port     = 80 
        protocol    = "tcp"
        security_groups = [aws_security_group.alb_sg.id]
    }

    ingress {
        description = "SSH"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["${var.myip}/32"]
    }

    egress {
        from_port   = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "app" {
    ami = "ami-0282f934dcc486b5c"
    instance_type = "t3.micro"

    vpc_security_group_ids = [aws_security_group.app_sg.id]

    key_name = "mathprowess"

    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    tags = {
        Name = "MathProwess"
        Role = "app-server"
    }

    user_data = <<-EOF
      #!/bin/bash
      apt-get update -y
      apt-get install -y awscli
      apt install ca-certificates curl gnupg -y
      sudo install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      sudo chmod a+r /etc/apt/keyrings/docker.gpg
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt update
      sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
      systemctl start docker 
      systemctl enable docker
      usermod -aG docker ubuntu

      aws ecr get-login-password --region ap-northeast-1 \
        | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com

      docker network create prowess-network || true

      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-api:e48974e3ec1022b3f5c2bcceb652f1fe5b017fdf
      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-web:e48974e3ec1022b3f5c2bcceb652f1fe5b017fdf
      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-prom:e48974e3ec1022b3f5c2bcceb652f1fe5b017fdf
      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-graf:e48974e3ec1022b3f5c2bcceb652f1fe5b017fdf

      cat << 'DEPLOYEOF' > /home/ubuntu/deploy.sh
      ${templatefile("${path.module}/deploy.sh", {
        account_id = data.aws_caller_identity.current.account_id
        postgres_host = aws_db_instance.postgres.address
      })}
      DEPLOYEOF

      chmod +x /home/ubuntu/deploy.sh
      chown ubuntu:ubuntu /home/ubuntu/deploy.sh

      cat << 'DEPLOYEOF' > /home/ubuntu/prod-docker-compose.yaml
      ${templatefile("${path.module}/prod-docker-compose.yaml", {
      })}
      DEPLOYEOF

      chmod +x /home/ubuntu/prod-docker-compose.yaml
      chown ubuntu:ubuntu /home/ubuntu/prod-docker-compose.yaml
      touch /home/ubuntu/.fe.env

      export ECR_URL=${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com
      export IMAGE_TAG=e48974e3ec1022b3f5c2bcceb652f1fe5b017fdf
      export POSTGRES_HOST=${aws_db_instance.postgres.address}

      docker compose -f /home/ubuntu/prod-docker-compose.yaml up -d

    EOF
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-profile"
  role = aws_iam_role.ec2_role.name
}

output "public_ip" {
  value = aws_instance.app.public_ip 
}

output "instance_id" {
  value = aws_instance.app.id
}
