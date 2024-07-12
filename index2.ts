import dayjs from "dayjs";
import { commitAnswer, getQuestionByDay, getUnCompletDates, login } from "./api/api";

process.env.TZ = "Asia/Shanghai";

const startDay = dayjs().startOf("month").format("YYYY-MM-DD");
const endDay = dayjs().format("YYYY-MM-DD");

await login();

const days = (await getUnCompletDates(startDay, endDay)) ?? [];

if (days.length) {
  console.log("需要补学的日期", days);
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const answer = await getQuestionByDay(day);
    await commitAnswer(answer);
  }
  console.log("补学完成");
} else {
  console.log("没有需要补学的题目");
}
