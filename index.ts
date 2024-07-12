import dayjs from "dayjs";
import { checkHoliday, commitAnswer, getQuestionByDay, login } from "./api/api";

process.env.TZ = "Asia/Shanghai";

const today = process.env.DATE ?? dayjs().format("YYYY-MM-DD");

await login();

let isHoliday = await checkHoliday(today);

if (!isHoliday) {
  const answer = await getQuestionByDay(today);
  await commitAnswer(answer);
  console.log("作业完成");
} else {
  console.log("今天是休息日，不答题");
}
