# According to documentation we need to save versions here for now
terraform {

  required_version = ">= 1.1.9"

  required_providers {

    aws = {

      version = "= 4.14.0"
    }
  }
}
