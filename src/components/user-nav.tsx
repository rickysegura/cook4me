'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bookmark } from 'lucide-react';

interface UserNavProps {
  user: FirebaseUser;
  userProfile: UserProfile | null;
  onSignOut: () => void;
}

export function UserNav({ user, userProfile, onSignOut }: UserNavProps) {
  const router = useRouter();

  return (
    <div className="flex justify-end mb-8 mx-4">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/settings')}>
          {userProfile?.profilePictureUrl ? (
            <Image
              src={userProfile.profilePictureUrl}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <span className="text-sm font-medium max-w-[120px] truncate">
            {userProfile?.username || user.displayName || user.email}
          </span>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => router.push('/saved-recipes')}>
          <Bookmark className="w-4 h-4 mr-2" />
          Saved Recipes
        </Button>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer p-2"
          onClick={() => router.push('/settings')}
          aria-label="Profile"
        >
          {userProfile?.profilePictureUrl ? (
            <Image
              src={userProfile.profilePictureUrl}
              alt="Profile"
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer p-2"
          onClick={() => router.push('/saved-recipes')}
          aria-label="Saved Recipes"
        >
          <Bookmark className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer p-2"
          onClick={onSignOut}
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}