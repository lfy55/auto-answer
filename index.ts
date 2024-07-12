import dayjs from "dayjs";
import { checkHoliday, commitAnswer, getQuestionByDay, login } from "./api/api";
import { log } from "./utils/utils";

process.env.TZ = "Asia/Shanghai";

const today = process.env.DATE ?? dayjs().format("YYYY-MM-DD");

await login();

let isHoliday = await checkHoliday(today);

if (!isHoliday) {
  const answer = await getQuestionByDay(today);
  await commitAnswer(answer);
  log("答题完成");
} else {
  log("今天是休息日，不答题");
}
