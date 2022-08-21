locals {
  api_zip_path = "deploy/signed-api.zip"
}

data "aws_iam_policy_document" "signed_role_policy" {
  statement {
    sid = "LambdaInvoke"

    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "signed_lambda_policy" {
  statement {
    sid = "DynamodbAccess"

    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:DeleteItem",
      "dynamodb:DescribeTable",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    ]

    resources = [aws_dynamodb_table.files.arn]
  }
}

resource "aws_iam_role" "signed_function_role" {
  assume_role_policy = data.aws_iam_policy_document.signed_role_policy.json
}

resource "aws_iam_role_policy" "signed_lambda_policy" {
  role   = aws_iam_role.signed_function_role.id
  policy = data.aws_iam_policy_document.signed_lambda_policy.json
}

resource "aws_lambda_function" "signed_funtion" {
  function_name = "signed-api"
  role          = aws_iam_role.signed_function_role.arn

  handler = "dist/server.handler"
  runtime = "nodejs14.x"

  filename         = local.api_zip_path
  source_code_hash = filebase64sha256(local.api_zip_path)

  environment {
    variables = {
      CLOUDFRONT_DOMAIN_NAME = aws_cloudfront_distribution.main_distribution.domain_name
      CLOUDFRONT_KEY_PAIR_ID = aws_cloudfront_public_key.pk.id
      CLOUDFRONT_PRIVATE_KEY = var.cloudfront_sign_private_key_pem
      CLOUDFRONT_S3_PATTERN  = local.cloudfront_s3_pattern
    }
  }
}
