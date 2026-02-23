import Link from 'next/link';
import Image from 'next/image';

export default function FollowButton() {
  return (
    <div className="py-2 px-3 rounded-lg bg-soria-red text-white font-medium hover:bg-soria-red-dark transition-colors w-28 h-10">
      <Link href="https://www.instagram.com/pastelerialasorianita/" target='_blank' className='flex items-center justify-center gap-3'>
        <Image src="/icons/icono-instagram.svg" alt="Instagram" width={18} height={18} />
        <span>Seguir</span>
      </Link>
    </div>
  );
};
