const { stitchSchemas } = require("@graphql-tools/stitch");
const { loadSchema } = require("@graphql-tools/load");
const { ApolloServer } = require("apollo-server");
const { UrlLoader } = require("@graphql-tools/url-loader");

const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

// wrapper to enable "top level await"
const main = async () => {
  // load remote schemas
  const remoteOneSchema = await loadSchema("http://localhost:4001/graphql", {
    loaders: [new UrlLoader()],
  });
  const remoteTwoSchema = await loadSchema("http://localhost:4002/graphql", {
    loaders: [new UrlLoader()],
  });

  // combine remote schemas
  const stitchedSchema = stitchSchemas({
    subschemas: [
      {
        schema: remoteOneSchema,
      },
      { schema: remoteTwoSchema },
    ],
  });

  // spin up server with the resulting schema.
  const server = new ApolloServer({
    schema: stitchedSchema,
    plugins: [
      // enables the GraphQL playground. Will be reachable at via /graphql by
      // default.
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  // spins up our server
  const { url } = await server.listen({ port: 4444 });
  console.log(`GraphQL server listening on ${url}`);
};

main();
