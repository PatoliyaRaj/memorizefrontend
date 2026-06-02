"use client"
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }){
  const isAuthenticated = useAuthStore((s)=>s.isAuthenticated)
  const user = useAuthStore((s)=>s.user)
  const router = useRouter()
  const pathname = usePathname()
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
      return
    }
    
    // Direct user to onboarding if they haven't finished sleep calibration targets
    const onboardingFinished = user?.onboardingDone || user?.isOnboarded;
    if (user && !onboardingFinished && pathname !== '/onboarding') {
      router.replace('/onboarding')
    }
  }, [mounted, isAuthenticated, user, pathname, router])

  if(!mounted) return <div className="min-h-[40vh]" aria-hidden="true" />
  if(!isAuthenticated) return null
  return <>{children}</>
}
