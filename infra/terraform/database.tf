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

resource "aws_db_subnet_group" "default" {
  name = "app-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "App DB subnet group"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}
