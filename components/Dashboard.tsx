// components/Dashboard.tsx
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function Dashboard({ children }: Props) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      {children}
    </div>
  )
}
