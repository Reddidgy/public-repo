
######### GLOBAL ##########
/*
variable "region" {
  default = "eu-central-1"
}
*/



variable "public-cidr" {
  type = list(string)
}

variable "private-cidr" {
  type = list(string)
}

variable "asz" {
  type = list(string)
}



variable "region" {
  type = string
}

variable "second_region" {
  default = "eu-central-1a"
}

# If I won't use variable name here - I will go cycle error which described here
# https://github.com/hashicorp/terraform/issues/24064
# It's because I need to add cluster tag for each subnets as described
# here in Example Subnets for EKS Node group
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group
variable "eks_cluster_name" {
  default = "main-cluster"

}

variable "node_type" {
  default = "t2.micro"
}

# For tests
/*
variable "public_subnet_id" {
  default = "subnet-01d74a625542e2f98"
}

variable "private_subnet_id" {
  default = "subnet-09baf4fe0cb920165"
}

variable "network_interface_id" {
  default = "eni-0bc0d7fa6b2432bac"
}
*/


################################################

################### S3 BUCKETS #################
variable "s3_bucket_names" {
  type    = list(any)
  default = ["ugarov-corp-dev-bucket", "ugarov-corp-stage-bucket", "ugarov-corp-test-bucket"]
}

variable "s3_bucket_public_names" {
  type    = list(any)
  default = ["Main Dev Bucket", "Main Stage Bucket", "Test Bucket"]
}

variable "s3_bucket_env_names" {
  type    = list(any)
  default = ["Dev", "Stage", "Test"]
}
################################################
