locals {
  cloudfront_s3_pattern = "private"
  api_origin_id         = "api"
}

resource "aws_cloudfront_distribution" "main_distribution" {
  enabled = true

  default_root_object = "index.html"

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "index.html"
  }

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

  origin {
    domain_name = replace(aws_apigatewayv2_api.api_gateway.api_endpoint, "https://", "")
    origin_id   = local.api_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    viewer_protocol_policy = "redirect-to-https"

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

    viewer_protocol_policy = "redirect-to-https"

    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    trusted_key_groups = [aws_cloudfront_key_group.kg.id]
  }

  ordered_cache_behavior {
    path_pattern = "api/*"

    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods  = ["GET", "HEAD", "OPTIONS"]

    viewer_protocol_policy = "redirect-to-https"

    target_origin_id = local.api_origin_id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }
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

