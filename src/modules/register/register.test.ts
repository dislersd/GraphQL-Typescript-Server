import { request } from "graphql-request";

import { User } from "../../entity/User";
import { startServer } from "../../startserver";
import { AddressInfo } from "net";

let getHost = () => "";

beforeAll(async () => {
  const app = await startServer();

  const { port } = app.address() as AddressInfo;
  console.log(port);
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "dylan@dylan.com";
const password = "password";

const mutation = `
mutation {
    register(email: "${email}", password: "${password}")
}
`;

test("Register User", async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  // password should be hashed
  expect(user.password).not.toEqual(password);
});
