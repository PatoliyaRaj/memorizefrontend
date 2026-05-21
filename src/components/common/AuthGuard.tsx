"use client"
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }){
  const isAuthenticated = useAuthStore((s)=>s.isAuthenticated)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(()=>{
    setMounted(true)
  }, [])

  useEffect(()=>{
    if(!mounted){
      return
    }
    if(!isAuthenticated){
      router.replace('/login')
    }
  }, [mounted, isAuthenticated, router])

  if(!mounted) return <div className="min-h-[40vh]" aria-hidden="true" />
  if(!isAuthenticated) return null
  return <>{children}</>
}
