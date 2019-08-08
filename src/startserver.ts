import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import * as path from "path";

import { resolvers } from "./resolvers";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";

export const startServer = async () => {
  const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));

  const server = new GraphQLServer({ typeDefs, resolvers });
  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  const port = app.address();
  console.log(`Server is running at localhost:${port}`);

  return app;
};
