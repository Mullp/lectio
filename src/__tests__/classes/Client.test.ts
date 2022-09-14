import { Client } from "../../index";
import { Student } from "../../classes/Student";

const lectio = new Client({
  schoolId: process.env.LECTIO_SCHOOLID as string,
  username: process.env.LECTIO_USERNAME as string,
  password: process.env.LECTIO_PASSWORD as string,
});

test("Sign in", async () => {
  expect(await lectio.authenticate()).toBeTruthy();
}, 20000);

test("Get student", async () => {
  expect(await lectio.student.get(lectio.studentId)).toBeInstanceOf(Student);
}, 20000);
