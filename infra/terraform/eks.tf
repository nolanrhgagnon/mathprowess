#module "eks" {
#  source                          = "terraform-aws-modules/eks/aws"
#  vpc_id                          = data.aws_vpc.default.id
#  subnet_ids                      = data.aws_subnets.default.ids
#  version                         = "~> 20.0"
#  cluster_name                    = "sweet-lil-cluster" 
#  cluster_version                 = "1.33"
#  cluster_endpoint_public_access  = true
#  cluster_endpoint_private_access = true
#  enable_cluster_creator_admin_permissions = true
#
#  eks_managed_node_groups = {
#    one = {
#      name = "node-group-1"
#      instance_types = ["t3.micro"]
#
#      min_size     = 1
#      max_size     = 3
#      desired_size = 2
#    }
#
#    two = {
#      name = "node-group-2"
#      instance_types = ["t3.micro"]
#
#      min_size     = 1
#      max_size     = 2
#      desired_size = 1
#    }
#  }
#}
#
output "alb_dns_name" {
  value = aws_lb.app_alb.dns_name
}
