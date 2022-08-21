resource "aws_apigatewayv2_api" "api_gateway" {
  name          = "morh-signed-gateway"
  protocol_type = "HTTP"

  target = aws_lambda_function.signed_funtion.invoke_arn

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
  }
}

resource "aws_lambda_permission" "gateway_invocation" {
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  function_name = aws_lambda_function.signed_funtion.function_name
  source_arn    = "${aws_apigatewayv2_api.api_gateway.execution_arn}/*"
}
