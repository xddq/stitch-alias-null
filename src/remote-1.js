const { RenameTypes, RenameRootFields } = require("@graphql-tools/wrap");
const { stitchSchemas } = require("@graphql-tools/stitch");
const { buildSchema } = require("graphql");
const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const fs = require("fs");
const path = require("path");

const typeDefs = fs
  .readFileSync(path.join(__dirname, "./schema-remote-1.graphql"))
  .toString("utf-8");

// sample data
const allArticles = [
  {
    title: {
      __typeName: "TitleOne",
      text: "hello world",
    },
  },
  {
    title: {
      __typeName: "TitleTwo",
      text: 1,
    },
  },
  {
    title: {
      __typeName: "TitleTwo",
      text: 2,
    },
  },
  {
    title: {
      __typeName: "TitleOne",
      text: "bye",
    },
  },
];

const resolvers = {
  Query: {
    articles: (_root, _args, _ctx, _info) => {
      return allArticles;
    },
  },
  DynamicZone: {
    __resolveType: (root, _args, _ctx, _info) => {
      return root.__typeName;
    },
  },
};

// wrapper to enable "top level await"
const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (params) => () => {
      console.log("remote-1 query: ", params.req.body.query);
      console.log("remote-1 variables: ", params.req.body.variables);
    },
    plugins: [
      // enables the GraphQL playground. Will be reachable at via /graphql by
      // default.
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  // spins up our server
  const { url } = await server.listen({ port: 4001 });
  console.log(`GraphQL server listening on ${url}`);
};

main();
