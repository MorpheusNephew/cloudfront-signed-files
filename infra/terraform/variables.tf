variable "cloudfront_sign_private_key_pem" {
  sensitive   = true
  type        = string
  description = "Used to sign urls/cookies"
}

variable "cloudfront_sign_public_key_pem" {
  sensitive   = true
  type        = string
  description = "Used to be a part of the cloudfront distribution"
}
