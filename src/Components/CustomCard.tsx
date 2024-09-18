import { Card } from '@mui/material'
import { ReactNode } from 'react';
interface cardProps{
    styleClass:string;
    children:ReactNode;
}
function CustomCard({styleClass,children}:cardProps) {
  return (
    <Card variant="elevation" className={`flex flex-col rounded-lg shadow gap-3  ${styleClass}`}>
      {children}
    </Card>
  )
}

export default CustomCard
