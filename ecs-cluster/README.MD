## AWS EKS cluster via Terraform

Here's an example of working/tested AWS EKS Cluster using terraform
I'm using t2.micro nodes here. You can change it in variables.tf

#### To start:
- AWS Account (Free Tier is okay)
- Prepare your AWS credentials with IAM user with AdministratorAccess and AmazonEKSClusterPolicy
- Install terraform (I've used 1.1.9 version)
- go to root folder
- ```terraform init```
- ```terraform plan```
- ```terraform apply```

##### After next 15-17 minutes you will get next infrastructure configured with TF code:
- VPC and 2 subnets (public & private)
- 2 Route tables assigned to proper subnets
- NAT Gateway (+Elastic IP to it)
- Internet gateway
- 2 configured IAM Roles (for cluster and nodes)
- AWS Cluster + Node group with 2 desired nodes and 3 maximum (you can change it in "main.tf" if you want)
- 3 S3 buckets (empty)

#### To destroy:
- ```terraform destroy```
- and 23 objects will be deleted from your AWS console
