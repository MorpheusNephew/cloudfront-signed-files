resource "aws_dynamodb_table" "files" {
  name = "signed_files"
  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
