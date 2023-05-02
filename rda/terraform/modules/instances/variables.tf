variable "instance_type" {
  type = string
}

variable "instance_ami" {
  type = string
}

variable "public_subnet_id" {
  type = string
}

variable "key_pair_name" {
  type = string
}

variable "ssh_security_group_id" {
  type = string
}


variable "web_8080_sg_id" {
  type = string
}
