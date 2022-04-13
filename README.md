# Quickstart

- `npm i && npm run start`
- gateway on localhost:4444/graphql
- remote-1 on localhost:4001/graphql
- remote-1 on localhost:4002/graphql

# Reconstruction of problem

## The working example (non stitched)

- go to localhost:4001/graphql and query

```
query {articles {title {
  ... on TitleOne {text}
  ... on TitleTwo {renamedText: text}
}}}
```

- resulting in the list of articles (where **every article has non-null value** for text):

```
{
  "data": {
    "articles": [
      {
        "title": {
          "text": "hello world"
        }
      },
      {
        "title": {
          "renamedText": 1
        }
      },
      {
        "title": {
          "renamedText": 2
        }
      },
      {
        "title": {
          "text": "bye"
        }
      }
    ]
  }
}
```

# The problem (stitched schema)

- go to localhost:4444/graphql (the stitched schema) and query

```
query {articles {title {
  ... on TitleOne {text}
  ... on TitleTwo {renamedText: text}
}}}
```

- which results in (list of articles where **the aliased fragment has a value of
  null** for text):

```
{
  "data": {
    "articles": [
      {
        "title": {
          "text": "hello world"
        }
      },
      {
        "title": {
          "renamedText": null
        }
      },
      {
        "title": {
          "renamedText": null
        }
      },
      {
        "title": {
          "text": "bye"
        }
      }
    ]
  }
}
```
