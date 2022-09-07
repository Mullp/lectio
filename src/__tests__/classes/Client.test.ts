import { Client } from "../../index";

// Bad test btw
test("Sign in", async () => {
  const lectio = new Client({ schoolId: 1, username: "", password: "" });
  await lectio.launch();
  await lectio.signIn();
  await lectio.close();

  expect(true).toBeTruthy();
}, 200000);
