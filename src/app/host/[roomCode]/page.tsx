import {HostStage} from "@/components/host-stage";
export default async function Page({params}:{params:Promise<{roomCode:string}>}){return <HostStage roomCode={(await params).roomCode}/>}
