locals {
  cloudfront_s3_pattern = "private"
  api_origin_id         = "api"
}

resource "aws_cloudfront_distribution" "main_distribution" {
  enabled = true

  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.signed_bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_oai.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = aws_s3_bucket.web_bucket.bucket_regional_domain_name
    origin_id   = local.s3_web_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.s3_web_oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    viewer_protocol_policy = "allow-all"

    target_origin_id = local.s3_web_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  ordered_cache_behavior {
    path_pattern = "${local.cloudfront_s3_pattern}/*"

    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    viewer_protocol_policy = "allow-all"

    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    trusted_key_groups = [aws_cloudfront_key_group.kg.id]
  }
}

resource "aws_cloudfront_origin_access_identity" "s3_oai" {
  comment = "Used with s3"
}

resource "aws_cloudfront_public_key" "pk" {
  encoded_key = trimspace(var.cloudfront_sign_public_key_pem)

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudfront_key_group" "kg" {
  items = [aws_cloudfront_public_key.pk.id]
  name  = "cloudfront-key-group"
}

resource "aws_cloudfront_origin_access_identity" "s3_web_oai" {
  comment = "Used with s3 web"
}

