output "public-subnet-id" {
  description = "Public subnet id"
  value       = aws_subnet.public-subnet.id
}

output "private-subnet-id" {
  description = "Private subnet id"
  value       = aws_subnet.private-subnet.id
}
