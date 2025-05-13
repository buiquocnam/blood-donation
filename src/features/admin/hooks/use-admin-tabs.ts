'use client';

import { useState, useEffect } from 'react';
import { AdminTabType } from '../types';

/**
 * Hook quản lý tab đang active trong Admin UI
 */
export function useAdminTabs() {
  const [activeTab, setActiveTab] = useState<AdminTabType>('users');

  // Đọc tab từ URL khi component mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'users' || hash === 'volunteer') {
      setActiveTab(hash as AdminTabType);
    }
  }, []);

  // Cập nhật URL khi tab thay đổi
  const handleTabChange = (tab: AdminTabType) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return {
    activeTab,
    handleTabChange
  };
} 