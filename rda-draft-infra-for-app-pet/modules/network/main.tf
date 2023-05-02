# -------------- MAIN vpc --------------
resource "aws_vpc" "main-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = var.vpc_name
  }
}

# -------------- SUBNETS --------------

resource "aws_subnet" "public-subnet" {
  vpc_id                  = aws_vpc.main-vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = var.subnet_region
  map_public_ip_on_launch = true
  tags = {
    Name                  = "public-subnet"
  }
}

resource "aws_subnet" "private-subnet" {
  vpc_id                = aws_vpc.main-vpc.id
  cidr_block            = "10.0.1.0/24"
  availability_zone     = var.subnet_region
  tags = {
  Name                  = "private-subnet"
  }
}


# -------------- INTERNET GATEWAY --------------
resource "aws_internet_gateway" "complex-internet-gateway" {
  vpc_id = aws_vpc.main-vpc.id

  tags = {
    Name = "complex-internet-gateway"
  }
}

# -------------- NAT GATEWAY --------------
# elastic_ip for nat in public subnet
resource "aws_eip" "nat-gateway" {
  vpc = true
}

# Nat gateway for private network
resource "aws_nat_gateway" "complex-nat-gateway" {
  allocation_id     = aws_eip.nat-gateway.id
  subnet_id         = aws_subnet.public-subnet.id
  connectivity_type = "public"

  tags = {
    Name = "complex-nat-gateway"
  }
}

# -------------- Routes --------------

resource "aws_route_table" "public-route" {
  vpc_id = aws_vpc.main-vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.complex-internet-gateway.id
  }
  tags = {
    Name = "public-route"
  }
}

resource "aws_route_table" "private-route" {

  vpc_id = aws_vpc.main-vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.complex-nat-gateway.id
  }

  tags = {
    Name = "private-route"
  }
}

# Route tables association with subnets

resource "aws_route_table_association" "public-route-assoc" {
  subnet_id      = aws_subnet.public-subnet.id
  route_table_id = aws_route_table.public-route.id
}

resource "aws_route_table_association" "private-route-assoc" {
  subnet_id      = aws_subnet.private-subnet.id
  route_table_id = aws_route_table.private-route.id
}
