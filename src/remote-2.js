/**
 * This server is basicly irellevant. Just used so we have two servers for
 * stitching.
 **/
const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const fs = require("fs");
const path = require("path");

const typeDefs = fs
  .readFileSync(path.join(__dirname, "./schema-remote-2.graphql"))
  .toString("utf-8");

const resolvers = {
  Query: {
    greeting: (_root, _args, _ctx, _info) => {
      return "hello!";
    },
  },
};

// wrapper to enable "top level await"
const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // enables the GraphQL playground. Will be reachable at via /graphql by
      // default.
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  // spins up our server
  const { url } = await server.listen({ port: 4002 });
  console.log(`GraphQL server listening on ${url}`);
};

main();
