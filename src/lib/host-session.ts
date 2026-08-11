import {createHmac,timingSafeEqual} from "node:crypto"; import {cookies} from "next/headers"; import {serverEnv} from "./env";
const NAME="licensing_host"; function token(){return createHmac("sha256",serverEnv().secret).update("licensing-arena-host-v1").digest("hex")}
export async function isHost(){const got=(await cookies()).get(NAME)?.value||"";const expected=token();return got.length===expected.length&&timingSafeEqual(Buffer.from(got),Buffer.from(expected))}
export async function setHost(){(await cookies()).set(NAME,token(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*8})}
export async function clearHost(){(await cookies()).delete(NAME)}
