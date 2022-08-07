resource "aws_dynamodb_table" "files" {
  name = "morph-signed-files"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  billing_mode = "PAY_PER_REQUEST"
}
