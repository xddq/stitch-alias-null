- request:

```
query {
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
```

# log when coming from localhost:4444/graphql (stitched)

```
[stitched] stitched request:  {
[stitched]   articles {
[stitched]     title {
[stitched]       ... on TitleOne {
[stitched]         text
[stitched]       }
[stitched]       ... on TitleTwo {
[stitched]         renamedText: text
[stitched]       }
[stitched]     }
[stitched]   }
[stitched] }
[stitched]
[stitched] stitched variables: {}
[remote-*1] remote-1 request:  {
[remote-*1]   articles {
[remote-*1]     title {
[remote-*1]       ... on TitleOne {
[remote-*1]         text
[remote-*1]       }
[remote-*1]       ... on TitleTwo {
[remote-*1]         renamedText: text
[remote-*1]       }
[remote-*1]       __typename
[remote-*1]       __typename
[remote-*1]     }
[remote-*1]   }
[remote-*1] }
[remote-*1] remote-1 variables: {}
[remote-*1] remote-1 response: {"articles":[{"title":{"text":"hello world","__typename":"TitleOne"}},{"title":{"renamedText":1,"__typename":"TitleTwo"}},{"title":{"renamedText":2,"__typename":"TitleTwo"}},{"title":{"text":"bye","__typename":"TitleOne"}}]}
[stitched] stitched response: {"articles":[{"title":{"text":"hello world"}},{"title":{"renamedText":null}},{"title":{"renamedText":null}},{"title":{"text":"bye"}}]}
```

# log when coming from localhost:4001/graphql (non-stitched)

```
[remote-*1] remote-1 request:  {
[remote-*1]   articles {
[remote-*1]     title {
[remote-*1]       ... on TitleOne {
[remote-*1]         text
[remote-*1]       }
[remote-*1]       ... on TitleTwo {
[remote-*1]         renamedText: text
[remote-*1]       }
[remote-*1]     }
[remote-*1]   }
[remote-*1] }
[remote-*1]
[remote-*1] remote-1 variables: {}
[remote-*1] remote-1 response: {"articles":[{"title":{"text":"hello world"}},{"title":{"renamedText":1}},{"title":{"renamedText":2}},{"title":{"text":"bye"}}]}
```
