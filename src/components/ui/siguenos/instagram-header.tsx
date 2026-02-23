import Image from 'next/image';
import type { InstagramProfile } from '@/types/instagram';
import FollowButton from './follow-button';
import Link from 'next/link';

export default function InstagramHeader({ profile }: { profile: InstagramProfile }) {
  return (
    <div className='flex flex-col md:flex-row items-center gap-2 mb-8 md:justify-center md:gap-80'>
      <div className="flex items-center gap-4">
        <div className="relative w-15 h-15 shrink-0 rounded-full overflow-hidden ring-2 ring-stone-200">
          <Link href="https://www.instagram.com/pastelerialasorianita/" target="_blank" rel="noopener noreferrer">
            <Image
              src={profile.profile_picture_url}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </Link>
        </div>
        <div>
          <Link href="https://www.instagram.com/pastelerialasorianita/" target="_blank" rel="noopener noreferrer">
            <p className="font-medium text-stone-900 hover:underline cursor-pointer">{profile.name}</p>
          </Link>
          <Link href="https://www.instagram.com/pastelerialasorianita/" target="_blank" rel="noopener noreferrer">
            <p className="text-stone-500 text-sm hover:underline cursor-pointer">@{profile.username}</p>
          </Link>
        </div>
      </div>
      <FollowButton />
    </div>
  );
}