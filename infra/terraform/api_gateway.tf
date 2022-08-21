resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "morh-signed-gateway"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
  }
}

resource "aws_apigatewayv2_integration" "api_integration" {
  api_id = aws_apigatewayv2_api.api_gateway.id

  description = "Adding lambda invocation from api gateway"

  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.signed_funtion.invoke_arn
}
