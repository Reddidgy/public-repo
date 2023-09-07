## Setting up an AWS EKS Cluster using Terraform

Here's a tested example of how to create an AWS EKS Cluster using Terraform. In this example, t2.micro nodes are utilized, but you can modify the node type in the `variables.tf` file.

### Prerequisites:
- AWS Account (Free Tier is acceptable)
- Ensure you have your AWS credentials ready with an IAM user having AdministratorAccess and AmazonEKSClusterPolicy permissions.
- Install Terraform (I used version 1.1.9).
- Navigate to the root folder.
- Initialize Terraform: `terraform init`
- Plan your configuration: `terraform plan`
- Apply the configuration: `terraform apply`

#### After approximately 15-17 minutes, your infrastructure will be provisioned based on the Terraform code. It will include:
- A VPC with two subnets (one public and one private).
- Assignment of two route tables to their respective subnets.
- The creation of a NAT Gateway (along with an Elastic IP).
- Configuration of an Internet Gateway.
- Creation of two IAM Roles (one for the cluster and one for the nodes).
- An AWS EKS Cluster and a Node group with a default of 2 desired nodes and 3 maximum nodes (you can modify this in the "main.tf" file).
- Three empty S3 buckets.

### To destroy the infrastructure:
- Run: `terraform destroy`
- This will delete 23 objects from your AWS console.
