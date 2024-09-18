import { ReactNode } from "react"

interface ContainerProps{
  children:ReactNode;
  styleName:any;
}

function Container({children,styleName}:ContainerProps) {
  return (
    <div className={`w-full min-h-screen flex flex-col ${styleName}`}>
      {children}
    </div>
  )
}

export default Container
