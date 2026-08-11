import {NextResponse} from "next/server"; import {isHost} from "@/lib/host-session";
export async function GET(){return NextResponse.json({authenticated:await isHost()})}
