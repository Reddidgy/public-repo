
# Docker credentials handling

data "aws_secretsmanager_secret" "by-name" {
  name = "docker_login"
}

data "aws_secretsmanager_secret_version" "current" {
  secret_id = data.aws_secretsmanager_secret.by-name.id
}

locals {
  docker_username = jsondecode(data.aws_secretsmanager_secret_version.current.secret_string)["docker_username"]
  docker_password = jsondecode(data.aws_secretsmanager_secret_version.current.secret_string)["docker_password"]
}


// working credentials with nonsensitive and sensitive!
# output "test_secret" {
#   # value = nonsensitive(data.aws_secretsmanager_secret_version.current.secret_string)
#   value = nonsensitive(jsondecode(data.aws_secretsmanager_secret_version.current.secret_string)["docker_password"])
# }


resource "aws_instance" "app" {
  ami                     = var.instance_ami
  instance_type           = var.instance_type
  subnet_id               = var.public_subnet_id
  key_name                = var.key_pair_name
  #security_groups = [var.ssh_security_group_id]
  vpc_security_group_ids  = [var.ssh_security_group_id, var.web_8080_sg_id]

// Working application user_data
  user_data = <<EOF
#!/bin/bash
apt-get update
apt-get --assume-yes install docker.io
usermod -aG docker root
usermod -aG docker ubuntu
docker login -u=${local.docker_username} -p=${local.docker_password}
docker pull reddidgy/rda-test
docker run -p 8080:8080 -dt reddidgy/rda-test
EOF



# // Same with Tomcat
# user_data = <<EOF
# #!/bin/bash
# apt-get update
# apt-get --assume-yes install docker.io
# usermod -aG docker root
# usermod -aG docker ubuntu
# docker run -p 8080:8080 -dt tomcat
# EOF



  # user_data_replace_on_change = true
  tags = {
    Name = "Application"
  }

}
