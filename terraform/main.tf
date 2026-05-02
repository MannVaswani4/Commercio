terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Generate a random suffix for unique bucket name
resource "random_pet" "bucket_suffix" {
  length    = 2
  separator = "-"
}

# Create the S3 bucket
resource "aws_s3_bucket" "devops_bucket" {
  bucket = "commercio-assets-${random_pet.bucket_suffix.id}"

  tags = {
    Environment = "DevOps"
    Project     = "Commercio"
  }
}

# Enable Versioning
resource "aws_s3_bucket_versioning" "devops_bucket_versioning" {
  bucket = aws_s3_bucket.devops_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable Server-Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "devops_bucket_encryption" {
  bucket = aws_s3_bucket.devops_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block Public Access completely
resource "aws_s3_bucket_public_access_block" "devops_bucket_public_access_block" {
  bucket = aws_s3_bucket.devops_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
