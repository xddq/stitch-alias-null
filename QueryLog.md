# When querying the schema directly on localhost:4001/graphql

- with the query

```
query {articles {title {
  ... on TitleOne {text}
  ... on TitleTwo {renamedText: text}
}}}

```

- we get the log (on localhost:4001/graphql):

```
remote-1 query:  {
  articles {
    title {
      ... on TitleOne {
        text
      }
      ... on TitleTwo {
        renamedText: text
      }
    }
  }
}

remote-1 variables:  {}

```

# When querying the stitched schema on localhost:4444/graphql

- with the query

```
query {articles {title {
  ... on TitleOne {text}
  ... on TitleTwo {renamedText: text}
}}}

```

- we get the log (on localhost:4001/graphql):

```
remote-1 query:  {
  articles {
    title {
      ... on TitleOne {
        text
      }
      ... on TitleTwo {
        renamedText: text
      }
      __typename
      __typename
    }
  }
}
remote-1 variables:  {}
```

- and on the stitched server (localhost:4444/graphql):

```

stitched query:  {
  articles {
    title {
      ... on TitleOne {
        text
      }
      ... on TitleTwo {
        renamedText: text
      }
    }
  }
}

stitched variables:  {}

```
