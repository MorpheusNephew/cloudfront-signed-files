resource "aws_dynamodb_table" "files" {
  name     = "morph-signed-files"
  hash_key = "id"

  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }
}
