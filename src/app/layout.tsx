import "./globals.css"; import type {Metadata} from "next";
export const metadata:Metadata={title:"LICENSING ARENA",description:"7 đội • 10 câu hỏi • 1 nhà vô địch"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="vi"><body><main className="arena">{children}</main></body></html>}
