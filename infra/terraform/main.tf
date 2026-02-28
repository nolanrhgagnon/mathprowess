provider "aws" {
    region = "ap-northeast-1"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_caller_identity" "current" {}

resource "aws_security_group" "alb_sg" {
  name = "alb-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  name = "db-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Database Security Group"
  }
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "mathprowess.com"
  validation_method = "DNS"

  subject_alternative_names = [
    "www.mathprowess.com"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb" "app_alb" {
  name               = "app-alb"
  load_balancer_type = "application"
  subnets            = data.aws_subnets.default.ids
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_lb_target_group" "app_tg" {
  name = "app-tg"
  port = 80 
  protocol = "HTTP"
  vpc_id = data.aws_vpc.default.id

  health_check {
    path = "/"
    port = "80"
  }
}

resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app_tg.arn
  target_id = aws_instance.app.id
  port = 80 
}

#resource "aws_lb_listener" "http" {
#  load_balancer_arn = aws_lb.app_alb.arn
#  port = 80
#  protocol = "HTTP"

#  default_action {
#    type = "forward"
#    target_group_arn = aws_lb_target_group.app_tg.arn
#  }
#}

#resource "aws_lb_listener" "https" {
#  load_balancer_arn = aws_lb.app_alb.arn
#  port              = 443
#  protocol          = "HTTPS"
#  certificate_arn   = aws_acm_certificate.cert.arn

#  default_action {
#    type             = "forward"
#    target_group_arn = aws_lb_target_group.app_tg.arn 
#  }
#}

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
        cidr_blocks = ["118.240.244.74/32"]
    }

    egress {
        from_port   = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_iam_role_policy_attachment" "attach_ecr" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
}

resource "aws_instance" "app" {
    ami = "ami-0282f934dcc486b5c"
    instance_type = "t3.micro"

    vpc_security_group_ids = [aws_security_group.app_sg.id]

    key_name = "mathprowess"

    iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

    tags = {
        Name = "MathProwess"
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
        -e ALLOWED_HOSTS="app-alb-1194072423.ap-northeast-1.elb.amazonaws.com" \
        ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-api:latest

      docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-web:latest
      docker run -d --restart unless-stopped \
        --name web \
        --network prowess-network \
        -p 80:80 \
        ${data.aws_caller_identity.current.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/mp-web:latest

      # ---- Create deploy script for future updates ----
      cat << 'DEPLOYEOF' > /home/ubuntu/deploy.sh
      #!/bin/bash
      set -e

      IMAGE_TAG=\$1
      ACCOUNT_ID=${data.aws_caller_identity.current.account_id}
      REGION=ap-northeast-1
      ECR_URL=\$ACCOUNT_ID.dkr.ecr.\$REGION.amazonaws.com

      aws ecr get-login-password --region \$REGION \
        | docker login --username AWS --password-stdin \$ECR_URL

      docker pull \$ECR_URL/mp-api:\$IMAGE_TAG
      docker pull \$ECR_URL/mp-web:\$IMAGE_TAG

      docker stop api || true
      docker rm api || true
      docker stop web || true
      docker rm web || true

      docker run -d --restart unless-stopped \
        --name api \
        --network prowess-network \
        -e POSTGRES_DB=prowessdb \
        -e POSTGRES_USER=appuser \
        -e POSTGRES_PASSWORD=supersecurepassword \
        -e POSTGRES_HOST=${aws_db_instance.postgres.address} \
        -e POSTGRES_PORT=5432 \
        -e ALLOWED_HOSTS="app-alb-1194072423.ap-northeast-1.elb.amazonaws.com" \
        \$ECR_URL/mp-api:\$IMAGE_TAG

      docker run -d --restart unless-stopped \
        --name web \
        --network prowess-network \
        -p 80:80 \
        \$ECR_URL/mp-web:\$IMAGE_TAG
      DEPLOYEOF

      chmod +x /home/ubuntu/deploy.sh
      chown ubuntu:ubuntu /home/ubuntu/deploy.sh
    EOF
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_db_subnet_group" "default" {
  name = "app-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "App DB subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "app-postgres"
  engine            = "postgres"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name = "prowessdb"
  username = "appuser"
  password = "supersecurepassword"

  db_subnet_group_name   = aws_db_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  skip_final_snapshot = true
}

output "public_ip" {
  value = aws_instance.app.public_ip 
}

output "dns_validation_name" {
  value = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
}

output "dns_validation_value" {
  value = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value
}

output "dns_validation_type" {
  value = tolist(aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
}

output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
