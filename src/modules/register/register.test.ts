import { request } from "graphql-request";

import { User } from "../../entity/User";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from "./errorMessages";
import { createTypeOrmConn } from "../../utils/createTypeOrmConn";

const email = "dylan@dylan.com";
const password = "password";

const mutation = (e: string, p: string) => `
mutation {
    register(email: "${e}", password: "${p}") {
        path
        message
    }
}
`;

beforeAll(async () => {
  await createTypeOrmConn();
});

describe("Register User", () => {
  it("check for duplicate emails", async () => {
    // make sure we can register user
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    // password should be hashed
    expect(user.password).not.toEqual(password);
    // try to register again with same email
    const response2 = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("check bad email", async () => {
    // catch bad email
    const response3 = await request(
      process.env.TEST_HOST as string,
      mutation("b", password)
    );
    expect(response3).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        }
      ]
    });
  });

  it("check bad password", async () => {
    // catch bad password
    const response4 = await request(
      process.env.TEST_HOST as string,
      mutation(email, "b")
    );
    expect(response4).toEqual({
      register: [
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it("check bad password and bad emai", async () => {
    // catch bad password and bad email
    const response5 = await request(
      process.env.TEST_HOST as string,
      mutation("ee", "b")
    );
    expect(response5).toEqual({
      register: [
        {
          path: "email",
          message: emailNotLongEnough
        },
        {
          path: "email",
          message: invalidEmail
        },
        {
          path: "password",
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
