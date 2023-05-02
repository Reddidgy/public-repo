output "ssh_security_group_id" {
  description = "ssh security group id!"
  value       = aws_security_group.ssh_public_sg.id
}

output "web_8080_sg_id" {
  description = "web security group id!"
  value       = aws_security_group.web_8080_sg.id
}
