import { Button } from '@/components/ui/button'
import { Home, PlusSquare, Settings, UserCircle } from 'lucide-react'
import React from 'react'

export default function Sidebar() {
  return (
    <div className='flex flex-col gap-4 p-3'>
      <Button size='icon' variant='ghost' ><Home /></Button>
      <Button size='icon' variant='ghost' ><PlusSquare /></Button>
      <Button size='icon' variant='ghost' ><UserCircle /></Button>
      <Button size='icon' variant='ghost' ><Settings /></Button>
    </div>
  )
}
