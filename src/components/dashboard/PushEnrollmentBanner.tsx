'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, X, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useSubscribePushMutation } from '@/hooks/use-notifications';
import { toast } from 'sonner';

export default function PushEnrollmentBanner() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const subscribeMutation = useSubscribePushMutation();

  useEffect(() => {
    const isSupported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    
    const isDismissed = localStorage.getItem('memorize-push-dismissed') === 'true';

    if (isSupported && !isDismissed && Notification.permission === 'default') {
      setShow(true);
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function handleEnroll() {
    try {
      setLoading(true);
      
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.warning('Notifications permission denied. Falling back to in-app alerts.');
        setShow(false);
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Service Worker] Service Worker registered:', registration);

      // Read public key from env, fallback to default for dev testing if missing
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BM_q4uPz...';
      
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('[Push Manager] Subscribed successfully:', subscription);

      await subscribeMutation.mutateAsync(subscription.toJSON());
      
      toast.success('🎉 Web Push OS alerts are now enabled!');
      setShow(false);
    } catch (e) {
      console.error('[Push Enrollment] Enrollment failed:', e);
      toast.error('Circadian alerts setup failed. Make sure SSL or localhost is active.');
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem('memorize-push-dismissed', 'true');
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-[#071011] to-[#0d1c1a]/85 p-5 shadow-[0_12px_32px_rgba(107,216,203,0.05)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="absolute top-3 right-3">
        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex items-start gap-4 pr-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Bell className="size-5" />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-mono font-bold">
              <Sparkles className="size-2.5" /> SMART SYSTEM OS ALERTS
            </div>
            <h3 className="text-sm font-bold text-text-primary">Enable Bedtime OS Notifications?</h3>
            <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
              Get optimal learning tips and smart bedtime recall alerts 3 hours before sleep to tag your hippocampus—even when the browser is completely closed. No screen light within 60 minutes of bed, guaranteed.
            </p>
          </div>
          <Button
            onClick={handleEnroll}
            disabled={loading}
            className="bg-primary text-on-primary hover:bg-primary/90 font-bold px-4 py-2 rounded-xl text-[11px] h-8 shadow-[0_0_12px_rgba(107,216,203,0.2)]"
          >
            {loading ? 'Configuring System...' : 'Enable Offline Alerts'}
          </Button>
        </div>
      </div>
    </div>
  );
}
