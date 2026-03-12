terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

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

data "aws_acm_certificate" "cert" {
  domain       = "mathprowess.com"
  statuses = ["ISSUED"]
  most_recent = true
}

resource "aws_iam_role_policy_attachment" "attach_ecr" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
}

#output "dns_validation_name" {
#  value = tolist(data.aws_acm_certificate.cert.domain_validation_options)[0].resource_record_name
#}
#
#output "dns_validation_value" {
#  value = tolist(data.aws_acm_certificate.cert.domain_validation_options)[0].resource_record_value
#}
#
#output "dns_validation_type" {
#  value = tolist(data.aws_acm_certificate.cert.domain_validation_options)[0].resource_record_type
#}
