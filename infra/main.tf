terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "morpheusnephew"

    workspaces {
      name = "silver-octo-umbrella"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
