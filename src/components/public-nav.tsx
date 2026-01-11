'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function PublicNav() {
  const router = useRouter();

  return (
    <nav className="border-b">
      <div className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">cook4me.</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => router.push('/login')}>
            Sign in
          </Button>
          <Button size="sm" className="cursor-pointer" onClick={() => router.push('/signup')}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}