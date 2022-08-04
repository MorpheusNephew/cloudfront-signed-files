# Signed Things

The purpose of this project is to test out signed cookies/urls. I'm super tired right now so we'll see how this goes.

- [Signed Things](#signed-things)
  - [Project interactions](#project-interactions)
    - [Uploading a file](#uploading-a-file)
    - [Get all files](#get-all-files)

## Project interactions

### Uploading a file

```mermaid

sequenceDiagram
    participant web
    participant api
    participant db
    participant cf as cloudfront
    participant s3

    web->>api: POST create file to upload
    api->>db: create file record in db
    db->>api: here's the file record
    api->>web: here is where you'll upload that file
    web->>cf: upload file
    cf->>s3: file is getting uploaded

```

### Get all files

```mermaid

sequenceDiagram
    participant web
    participant api
    participant db
    participant cf as cloudfront
    participant s3

    web->>api: GET all files added
    api->>db: Give me all of the file records
    db->>api: Here are the file records
    alt get with query param signed=cookies or signed is undefined
        api->>web: returns files with signed cookes
    else get with query param signed=url
        api->>web: returns files with signed urls
    end

```
