// components/SessionSync.js
'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logoutUser } from '@/services/authSlice';

export default function SessionSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(setCredentials({
        user: session.user,
        token: session.accessToken || null,
      }));
    } else {
      dispatch(logoutUser());
    }
  }, [session, dispatch]);

  return null;
}