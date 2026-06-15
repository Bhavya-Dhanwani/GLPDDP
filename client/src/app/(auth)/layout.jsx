import AuthGuard from '@/features/auth/ui/jsx/AuthGuard';
import React from 'react';

const layout = ({ children }) => {
  return (
    <AuthGuard>
      { children }
    </AuthGuard>
  )
}

export default layout
