resource "aws_instance" "math_prowess" {
    ami = "ami-0f65fc8c24ec8d2a1"
    instance_type = "t3.micro"
    subnet_id = "subnet-00c90ec66ed37db06"

    vpc_security_group_ids = [
      "sg-0637bfb6ac18990b8"
    ]
}
