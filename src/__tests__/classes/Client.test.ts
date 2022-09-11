import { Client } from "../../index";

const lectio = new Client({
  schoolId: process.env.LECTIO_SCHOOLID as string,
  username: process.env.LECTIO_USERNAME as string,
  password: process.env.LECTIO_PASSWORD as string,
});

test("Sign in", async () => {
  expect(await lectio.authenticate()).toBeTruthy();
}, 200000);
