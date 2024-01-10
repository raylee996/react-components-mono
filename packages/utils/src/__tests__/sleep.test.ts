import { sleep } from "..";

test("sleep", async () => {
  const time = Date.now();

  await sleep(500);

  expect(Date.now() - time >= 500);
});
