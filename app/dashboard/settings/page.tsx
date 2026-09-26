"use client";
import { ProfileForm } from '@/module/settings/components/profile-form';
import { RepositoryList } from '@/module/settings/components/repository-list';
import React from 'react'

const SettingPage = () => {
  return (
    <div>
      <div>
        <h1>Settings</h1>
        <p>Manage your account settings and preferences here.</p>
        </div>
        <ProfileForm />
        <RepositoryList /> 
    </div>
  )
}

export default SettingPage
