# SSH Security group
resource "aws_security_group" "ssh_public_sg" {
name            = "ssh_public_sg"
description     = "Allow ssh!"
vpc_id          = var.vpc_id

ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
from_port = 22
    to_port     = 22
    protocol    = "tcp"
  }

  egress {
   from_port      = 0
   to_port        = 0
   protocol       = "-1"
   cidr_blocks    = ["0.0.0.0/0"]
 }
}

# Application 8080 port Security group
resource "aws_security_group" "web_8080_sg" {
name          = "web_8080_sg"
description   = "Allow 8080 in application instance!"
vpc_id        = var.vpc_id

ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
from_port = 8080
    to_port     = 8080
    protocol    = "tcp"
  }

  egress {
   from_port      = 0
   to_port        = 0
   protocol       = "-1"
   cidr_blocks    = ["0.0.0.0/0"]
 }
}
