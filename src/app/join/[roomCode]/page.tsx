import {JoinArena} from "@/components/join-arena";export default async function Page({params}:{params:Promise<{roomCode:string}>}){return <JoinArena roomCode={(await params).roomCode}/>}
