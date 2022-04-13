const { stitchSchemas } = require("@graphql-tools/stitch");
const { ApolloServer } = require("apollo-server");
const { loadSchema } = require("@graphql-tools/load");
const { buildSchema } = require("graphql");
const { UrlLoader } = require("@graphql-tools/url-loader");
const { RenameTypes, RenameRootFields } = require("@graphql-tools/wrap");

const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

// try loading remote schemas differently:
// inspired from: https://github.com/gmac/schema-stitching-handbook/blob/main/combining-local-and-remote-schemas/index.js
const { fetch } = require("cross-fetch");
const { print } = require("graphql");

// Builds a remote schema executor function,
// customize any way that you need (auth, headers, etc).
// Expects to receive an object with "document" and "variable" params,
// and asynchronously returns a JSON response from the remote.
function makeRemoteExecutor(url) {
  return async ({ document, variables, context }) => {
    const query = typeof document === "string" ? document : print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: {
        // 'Authorization': context.authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
}

// Custom fetcher that queries a remote schema for an "sdl" field.
// This is NOT a standard GraphQL convention – it's just a simple way
// for a remote API to provide its own schema, complete with custom directives.
async function fetchRemoteSDL(executor, context) {
  const result = await executor({ document: "{ _sdl }", context });
  return result.data._sdl;
}

// wrapper to enable "top level await"
const main = async () => {
  // load remote schemas
  const remoteOneSchema = await loadSchema("http://localhost:4001/graphql", {
    loaders: [new UrlLoader()],
  });
  const remoteTwoSchema = await loadSchema("http://localhost:4002/graphql", {
    loaders: [new UrlLoader()],
  });

  // required
  const remoteOneExecutor = makeRemoteExecutor("http://localhost:4001/graphql");
  const remoteTwoExecutor = makeRemoteExecutor("http://localhost:4002/graphql");

  const remoteOneSchemaWithoutLoadSchema = buildSchema(
    await fetchRemoteSDL(remoteOneExecutor, {})
  );

  // combine remote schemas
  const stitchedSchema = stitchSchemas({
    subschemas: [
      {
        schema: remoteOneSchema,
        executor: remoteOneExecutor,
      },
      {
        schema: remoteOneSchemaWithoutLoadSchema,
        executor: remoteOneExecutor,
        transforms: [
          new RenameTypes((typeName, fieldName) => `fetchRemoteSDL${typeName}`),
          new RenameRootFields(
            (typeName, fieldName) =>
              `fetchRemoteSDL${fieldName
                .charAt(0)
                .toUpperCase()}${fieldName.slice(1)}`
          ),
        ],
      },
      { schema: remoteTwoSchema, executor: remoteTwoExecutor },
    ],
  });

  // plugin for logging:
  // src: https://www.apollographql.com/docs/apollo-server/integrations/plugins
  const logging = {
    requestDidStart(requestContext) {
      console.log("stitched request: ", requestContext.request.query);
      console.log("stitched variables:", requestContext.request.variables);
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
            "stitched response:",
            JSON.stringify(response.response.data)
          );
        },
      };
    },
  };

  // spin up server with the resulting schema.
  const server = new ApolloServer({
    schema: stitchedSchema,
    plugins: [
      logging,
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
