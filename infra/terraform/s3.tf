resource "aws_s3_bucket" "signed_bucket" {
  bucket = "morph-signed-bucket"
}

resource "aws_s3_bucket_policy" "oia_policy" {
  bucket = aws_s3_bucket.signed_bucket.id
  policy = data.aws_iam_policy_document.oia_for_s3.json
}

data "aws_iam_policy_document" "oia_for_s3" {
  statement {
    actions = ["s3:GetObject", "s3:DeleteObject", "s3:PutObject"]

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.s3_oai.iam_arn]
    }

    resources = ["${aws_s3_bucket.signed_bucket.arn}/*"]
  }
}

resource "aws_s3_bucket_cors_configuration" "s3_cors" {
  bucket = aws_s3_bucket.signed_bucket.id

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET", "DELETE", "PUT", "POST"]
  }
}

locals {
  s3_origin_id = "morphS3Origin"
}
