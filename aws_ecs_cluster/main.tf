/*
First EKS cluster with TF creating vpc/subnets/route tables/elastic_ip
Also creating S3 buckets
by Rodion Ugarov

* In this case I'm using my ENV variables for credential in linux with `export` command

*/

provider "aws" {
  region = var.region
}


###### MODULES ######
module "network" {
  source = "./modules/network"
}

# terraform {
#   backend "s3" {
#     bucket 	= "tf-state-statging"		# bucketname in S3
#     key 	= "eks/terraform.tfstate" 	# location where tfstate
#     region	= "us-east-1"
#   }

# }

# IAM ROLES FOR CLUSTER AND NODES
#################################################
# IAM role for cluster with assigning AmazonEKSClusterPolicy,
# AmazonEKSServicePolicy, AmazonEKSVPCResourceController
resource "aws_iam_role" "eks_cluster" {
  name = "eks-cluster"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

# attaching AmazonEKSClusterPolicy to our IAM role for cluster
resource "aws_iam_role_policy_attachment" "AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

# attaching AmazonEKSServicePolicy to our IAM role for cluster
resource "aws_iam_role_policy_attachment" "AmazonEKSServicePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = aws_iam_role.eks_cluster.name
}

# for managing network interfaces, their private IP addresses, and their
# attachment and detachment to and from network instances. (from aws doc)
resource "aws_iam_role_policy_attachment" "AmazonEKSVPCResourceController" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster.name
}

# IAM role for cluster node group
resource "aws_iam_role" "cluster-nodes" {
  name = "cluster-node-group"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

# Adding permissions for created IAM role
resource "aws_iam_role_policy_attachment" "AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.cluster-nodes.name
}

# policy for IPv4 family from doc                                                
resource "aws_iam_role_policy_attachment" "AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.cluster-nodes.name
}


# granting AmazonECR readonly access from CLI
resource "aws_iam_role_policy_attachment" "AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.cluster-nodes.name
}



########################## Creating Cluster ##################################
resource "aws_eks_cluster" "aws_eks" {
  name     = var.eks_cluster_name
  role_arn = aws_iam_role.eks_cluster.arn

  vpc_config {
    subnet_ids = [aws_subnet.public-subnet.id, aws_subnet.private-subnet.id] #
    # subnet_ids = ["subnet-0892a61e2a4fb1f27", "subnet-045ce9c0ebb5fd5c7"]
  }

  tags = {
    Name = var.eks_cluster_name
  }
  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.AmazonEKSVPCResourceController,
  ]
}



############################# Creating Node Group #############################
# doc: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group
resource "aws_eks_node_group" "node" {
  cluster_name    = aws_eks_cluster.aws_eks.name
  node_group_name = "main_node"
  node_role_arn   = aws_iam_role.cluster-nodes.arn
  subnet_ids      = [aws_subnet.public-subnet.id] # define proper subnet ids
  instance_types  = [var.node_type]
  ami_type        = "AL2_x86_64"


  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 2
  }

  # dependencies with policies from tf documentation to not start before policies will work
  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
  ]


}

# Creating 3 s3 buckets according to their count in variables file
resource "aws_s3_bucket" "b" {
  count  = length(var.s3_bucket_names)
  bucket = var.s3_bucket_names[count.index]
  tags = {
    Name        = var.s3_bucket_public_names[count.index]
    Environment = var.s3_bucket_env_names[count.index]
  }
}





























#
