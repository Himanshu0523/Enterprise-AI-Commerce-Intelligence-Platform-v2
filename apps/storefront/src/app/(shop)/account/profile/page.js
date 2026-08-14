'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Camera, Check, AlertCircle, Shield, KeyRound, Mail, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Jane Doe');
  const [email, setEmail] = useState(user?.email || 'jane.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account details and password.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
              <span className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
                {name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
              </span>
            </div>
            
            {/* Hover Overlay */}
            <div className={`absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 transition-opacity duration-200 ${avatarHover ? 'opacity-100' : 'opacity-0'}`}>
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            Change Avatar
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex-1 w-full space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Security</h2>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                  Leave blank to keep your current password
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            {saved && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-right-4">
                <Check className="h-4 w-4" />
                <span>Changes saved successfully</span>
              </div>
            )}
            <button
              type="submit"
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 dark:shadow-none"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}