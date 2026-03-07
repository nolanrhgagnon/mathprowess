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
      apt-get install -y docker.io awscli
      systemctl start docker 
      systemctl enable docker
      usermod -aG docker ubuntu

      aws ecr get-login-password --region ap-northeast-1 \
        | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com

      docker network create prowess-network || true

      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-api:latest
      docker run -d --restart unless-stopped \
        --name api \
        --network prowess-network \
        -e POSTGRES_DB=prowessdb \
        -e POSTGRES_USER=appuser \
        -e POSTGRES_PASSWORD=supersecurepassword \
        -e POSTGRES_HOST=${aws_db_instance.postgres.address} \
        -e POSTGRES_PORT=5432 \
        -e ALLOWED_HOSTS="app-alb-1194072423.ap-northeast-1.elb.amazonaws.com,mathprowess.com" \
        ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-api:latest

      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-web:latest
      docker run -d --restart unless-stopped \
        --name web \
        --network prowess-network \
        -p 80:80 \
        ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-web:latest

      cat << 'DEPLOYEOF' > /home/ubuntu/deploy.sh
      ${templatefile("${path.module}/deploy.sh", {
        account_id = data.aws_caller_identity.current.account_id
        postgres_host = aws_db_instance.postgres.address
      })}
      DEPLOYEOF

      chmod +x /home/ubuntu/deploy.sh
      chown ubuntu:ubuntu /home/ubuntu/deploy.sh
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
