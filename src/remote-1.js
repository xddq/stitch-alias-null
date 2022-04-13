const { RenameTypes, RenameRootFields } = require("@graphql-tools/wrap");
const { buildSchema, print } = require("graphql");
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

// plugin for logging:
// src: https://www.apollographql.com/docs/apollo-server/integrations/plugins
const logging = {
  requestDidStart(requestContext) {
    console.log("remote-1 request: ", requestContext.request.query);
    console.log("remote-1 variables:", requestContext.request.variables);
    return {
      didEncounterErrors(requestContext) {
        console.log(
          "an error happened in response to query " +
            requestContext.request.query
        );
        console.log(requestContext.errors);
      },
      willSendResponse(response, ctx) {
        console.log(
          "remote-1 response:",
          JSON.stringify(response.response.data)
        );
      },
    };
  },
};

// wrapper to enable "top level await"
const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    extensions: [() => BASIC_LOGGING],
    plugins: [
      logging,
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
