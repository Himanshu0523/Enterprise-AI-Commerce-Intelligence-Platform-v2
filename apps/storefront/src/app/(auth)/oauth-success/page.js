'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LoaderCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function OAuthSuccessPage() {
  const router = useRouter();

  const { completeOAuthSession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access');
    const refreshToken = params.get('refresh');
    if (!accessToken || !refreshToken) {
      setError('The identity provider did not return a complete session.');
      return () => { active = false; };
    }
    completeOAuthSession(accessToken, refreshToken)
      .then(() => {
        if (active) {
          window.history.replaceState({}, document.title, '/oauth-success');
          router.replace('/');
          router.refresh();
        }
      })
      .catch((err) => { if (active) setError(err.message || 'Unable to validate your Google sign-in.'); });
    return () => { active = false; };
  }, [completeOAuthSession, router]);

  return <main className="flex min-h-screen items-center justify-center bg-[#f5f4ef] px-5 text-[#1c2924]"><div className="w-full max-w-md border border-[#e5e4dc] bg-[#fffefa] p-9 text-center shadow-sm">{error ? <><AlertCircle className="mx-auto text-[#a34e43]" size={28}/><h1 className="mt-4 font-serif text-3xl">Sign-in could not finish.</h1><p className="mt-3 text-sm text-[#788078]">{error}</p><Link href="/login" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#315b49]"><ArrowLeft size={14}/> Return to sign in</Link></> : <><LoaderCircle className="mx-auto animate-spin text-[#315b49]" size={28}/><h1 className="mt-4 font-serif text-3xl">Finishing sign-in…</h1><p className="mt-3 text-sm text-[#788078]">Validating your account session securely.</p></>}</div></main>;
}