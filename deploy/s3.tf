resource "aws_s3_bucket" "signed_bucket" {
  bucket = "morph-signed-bucket"
}

locals {
  s3_origin_id = "morphS3Origin"
}
