import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeOrmConn } from "./createTypeOrmConn";
import { User } from "../entity/User";
import fetch from "node-fetch";
import { Connection } from "typeorm";
import { redis } from "../redis";

let userId = "";

let conn: Connection;

beforeAll(async () => {
  conn = await createTypeOrmConn();
  const user = await User.create({
    email: "bob5@bob.com",
    password: "pass"
  }).save();
  userId = user.id;
});

afterAll(() => {
  conn.close();
});

test("confirms user and clears key in redis", async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId,
    redis
  );

  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual("ok");
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split("/");
  const key = chunks[chunks.length - 1];
  const value = await redis.get(key);
  expect(value).toBeNull();
});
