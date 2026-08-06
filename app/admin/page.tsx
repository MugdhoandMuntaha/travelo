'use client';

import { useRouter } from 'next/navigation';
import { AdminPanel } from '@/src/components/AdminPanel';

export default function AdminPage() {
  const router = useRouter();

  return (
    <AdminPanel 
      onBackToSite={() => {
        router.push('/');
      }} 
    />
  );
}
