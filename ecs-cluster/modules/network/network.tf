# main vpc
resource "aws_vpc" "main-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}


# Subnets with different AZs and cluster tag
resource "aws_subnet" "public-subnet" {
  vpc_id                  = aws_vpc.main-vpc.id
  cidr_block              = "10.0.0.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true

  tags = {
    Name                                            = "public-subnet"
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
  }
}

resource "aws_subnet" "private-subnet" {
  vpc_id            = aws_vpc.main-vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-central-1b"

  tags = {
    Name                                            = "private-subnet"
    "kubernetes.io/cluster/${var.eks_cluster_name}" = "shared"
  }
}



# Route tables

# public route 
resource "aws_route_table" "public-route" {
  vpc_id = aws_vpc.main-vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my-internet-gateway.id #
  }
  tags = {
    Name = "public-route"
  }
}

# private route table
resource "aws_route_table" "private-route" {

  vpc_id = aws_vpc.main-vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.my-nat-gateway.id
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



# Internet gateway for public route
resource "aws_internet_gateway" "my-internet-gateway" {
  vpc_id = aws_vpc.main-vpc.id

  tags = {
    Name = "my-internet-gateway"
  }
}

# elastic_ip for nat in public subnet
resource "aws_eip" "nat-gateway" {
  vpc = true
}

# Nat gateway
resource "aws_nat_gateway" "my-nat-gateway" {
  allocation_id     = aws_eip.nat-gateway.id
  subnet_id         = aws_subnet.public-subnet.id
  connectivity_type = "public"

  tags = {
    Name = "my-nat-gateway"
  }

  # Do not start nat gw before resources below
  depends_on = [
    aws_internet_gateway.my-internet-gateway,
    aws_subnet.public-subnet,
    aws_vpc.main-vpc
  ]

}




































#
