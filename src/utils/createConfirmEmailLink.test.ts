import { createConfirmEmailLink } from "./createConfirmEmailLink";
import { createTypeOrmConn } from "./createTypeOrmConn";
import { User } from "../entity/User";
import * as Redis from "ioredis";
import fetch from "node-fetch";

let userId = "";
let redis = new Redis();

beforeAll(async () => {
  await createTypeOrmConn();
  const user = await User.create({
    email: "bob5@bob.com",
    password: "pass"
  }).save();
  userId = user.id;
});

describe("test createConfirmEmailLink works", () => {
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

  test("sends invalid back if bad id sent", async () => {
    const response = await fetch(`${process.env.TEST_HOST}/confirm/1295`);
    const text = await response.text();
    expect(text).toEqual("invalid");
  });
});
