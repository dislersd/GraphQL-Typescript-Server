import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeOrmConn } from "./createTypeOrmConn";
import { User } from "../entity/User";
import * as Redis from "ioredis";

let userId = "";

beforeAll(async () => {
  await createTypeOrmConn();
  const user = await User.create({
    email: "bob5@bob.com",
    password: "pass"
  }).save();
  userId = user.id;
});

test("Make sure createConfirmEmailLink works", () => {
  const url = createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    new Redis()
  );
});
