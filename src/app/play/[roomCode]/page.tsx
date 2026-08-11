import {PlayerArena} from "@/components/player-arena";export default async function Page({params}:{params:Promise<{roomCode:string}>}){return <PlayerArena roomCode={(await params).roomCode}/>}
