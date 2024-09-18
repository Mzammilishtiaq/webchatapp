import { ReactNode } from "react";

interface chatProps{
    children:ReactNode;
    styleClass:string
}
function ChatContainer({children,styleClass}:chatProps) {
  return (
    <div className={`bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% flex w-full min-h-screen p-5 ${styleClass}`}>
      {children}
    </div>
  )
}

export default ChatContainer
