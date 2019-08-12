import { GraphQLServer } from "graphql-yoga";
import { AddressInfo } from "net";

import { redis } from "./redis";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/generateSchema";

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host")
    })
  });

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeOrmConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  const { port } = app.address() as AddressInfo;
  console.log(`Server is running at localhost:${port}`);

  return app;
};
