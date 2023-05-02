output "public_subnet_id" {
  description = "Public subnet id"
  value       = aws_subnet.public-subnet.id
}

output "private_subnet_id" {
  description = "Private subnet id"
  value       = aws_subnet.private-subnet.id
}

output "vpc_id" {
  description = "Main VPC ID"
  value       = aws_vpc.main-vpc.id
}
