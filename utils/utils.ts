import CryptoJS from "crypto-js";

export async function customfetch<T>(url: string, options?: RequestInit) {
  try {
    const data: CommonRes<T> = await fetch(url, options).then((response) => response.json());
    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error(data.msg);
    }
  } catch (error) {
    console.log(error);
  }
}

const key = Buffer.from(process.env.KEY as string, "base64").toString("utf-8");
const iv = process.env.IV as string;

/**
 * 对字符串进行加密
 *
 * @param str 待加密的字符串
 * @returns 加密后的字符串（Base64编码）
 */
export function encryption(str: string) {
  const y = CryptoJS.enc.Utf8.parse(str);
  const c = CryptoJS.enc.Utf8.parse(key);
  const s = CryptoJS.enc.Utf8.parse(iv);
  const S = CryptoJS.AES.encrypt(y, c, { iv: s, mode: CryptoJS.mode.CBC });
  return CryptoJS.enc.Base64.stringify(S.ciphertext);
}
