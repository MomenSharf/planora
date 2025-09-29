'use client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function SignOut() {
  return (
    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => {signOut()}} >Sign out</Button >
  )
}
