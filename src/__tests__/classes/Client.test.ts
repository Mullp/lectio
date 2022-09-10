import { Client } from "../../index";

const lectio = new Client({ schoolId: "", username: "", password: "" });

test("Sign in", async () => {
  expect(await lectio.authenticate()).toBeTruthy();
}, 200000);
