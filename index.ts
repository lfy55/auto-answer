import CryptoJS from "crypto-js";
import dayjs from "dayjs";

const loginInfo = { account: process.env.ACCOUNT as string, password: process.env.PASSWORD as string };
const key = process.env.KEY as string;
const iv = process.env.IV as string;
const today = dayjs().format("YYYY-MM-DD");

let token: string;

async function login(loginInfo: LoginInfo) {
  const { account, password } = loginInfo;
  const encry_username = encryption(account);
  const encry_password = encryption(password);

  const data = await fetch(`https://www.questiontest.cn:5988/PCapi/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account: encry_username, password: encry_password }),
  }).then((res) => res.json());
  token = data.data.userInfo.token;
}

/**
 * 对字符串进行加密
 *
 * @param str 待加密的字符串
 * @returns 加密后的字符串（Base64编码）
 */
function encryption(str: string) {
  const y = CryptoJS.enc.Utf8.parse(str);
  const c = CryptoJS.enc.Utf8.parse(key);
  const s = CryptoJS.enc.Utf8.parse(iv);
  const S = CryptoJS.AES.encrypt(y, c, { iv: s, mode: CryptoJS.mode.CBC });
  return CryptoJS.enc.Base64.stringify(S.ciphertext);
}

async function getQuestionByDay(date: string): Promise<AnswerParam> {
  const data = await fetch(
    `https://www.questiontest.cn:5988/PCapi/practiceTask/queryDailyQuestions?queryDate=${date}`,
    { headers: { Authorization: token } }
  ).then((res) => res.json());
  const { rightAnswer, questionId } = data.data.questionOptions[0];
  return { queryTime: date, questionId, questionAnswer: rightAnswer };
}

async function commitAnswer(answerParam: AnswerParam) {
  const data = await fetch(`https://www.questiontest.cn:5988/clientapi/dailyQuestions/commitAnswer`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify(answerParam),
  }).then((res) => res.json());
  console.log(data.data);
}

await login(loginInfo);
const answer = await getQuestionByDay(today);
await commitAnswer(answer);
