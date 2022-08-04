# AWS Infra

- [AWS Infra](#aws-infra)
  - [S3](#s3)
  - [Cloudfront](#cloudfront)

## S3

The S3 bucket will be a standard (private) bucket that holds all of the files uploaded to it

## Cloudfront

Cloudfront will provide public access to the S3 bucket until a [key group](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html#choosing-key-groups-or-AWS-accounts) is added to the cloudfront distribution. After the key group is added all access to the file will need to be signed access, either via url or cookies
