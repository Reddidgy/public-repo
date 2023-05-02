/*
terraform {
  backend "s3" {
    bucket 	= var.prod_bucket_name		# S3 bucket name for tfstate
    key 	= var.prod_tfstate_path	# tfstate file path
    region	= var.tfstate_region
  }

}
*/

provider "aws" {
  region  = var.region
}

# --------------- Modules ---------------
module "network" {
  source          = "./modules/network"
  subnet_region   = var.subnet_region
  vpc_name        = var.vpc_name
}

module "instances" {
  source                    = "./modules/instances"
  instance_type             = var.instance_type # t2.micro
  instance_ami              = var.instance_ami # ami-0caef02b518350c8b
  public_subnet_id          = module.network.public_subnet_id
  key_pair_name             = var.key_pair_name
  ssh_security_group_id     = module.security.ssh_security_group_id
  web_8080_sg_id            = module.security.web_8080_sg_id
}

module "security" {
  source          = "./modules/security"
  vpc_id          = module.network.vpc_id
}





































# ..
