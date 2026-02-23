'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { InstagramPost, InstagramProfile } from '@/types/instagram';
import GridButton from '@/components/ui/siguenos/grid-button';
import InstagramHeader from '@/components/ui/siguenos/instagram-header';

const POSTS_PER_PAGE = 6;

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Skeleton() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-stone-200 animate-pulse shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 bg-stone-200 animate-pulse rounded" />
          <div className="w-24 h-3 bg-stone-200 animate-pulse rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
          <div key={i} className="aspect-4/5 bg-stone-200 animate-pulse rounded-sm" />
        ))}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5 translate-x-0.5">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const isVideo = post.media_type === 'VIDEO';
  const imageSrc = isVideo ? (post.thumbnail_url ?? post.media_url) : post.media_url;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-3/5 md:aspect-4/5 overflow-hidden rounded-sm bg-stone-100"
    >
      <Image
        src={imageSrc}
        alt={post.caption?.slice(0, 100) || 'Post de Instagram'}
        fill
        sizes="(max-width: 768px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {isVideo && <PlayIcon />}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-colors duration-300 flex items-end">
        <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
          {post.caption && (
            <p className="text-white text-xs line-clamp-3 leading-relaxed">
              {post.caption}
            </p>
          )}
          <div className="flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
              {post.like_count}
            </span>
            <span>{formatDate(post.timestamp)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function InstagramGrid() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<'next' | 'back'>('next');
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((json) => {
        setPosts(json.data);
        setProfile(json.profile);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const total = Math.ceil(posts.length / POSTS_PER_PAGE);
    if (total <= 1) return;
    const timer = setTimeout(() => {
      setDirection('next');
      setCurrentPage((p) => (p >= total - 1 ? 0 : p + 1));
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentPage, posts.length]);

  if (loading) return <Skeleton />;

  if (error || posts.length === 0) {
    return (
      <p className="text-center text-stone-500 py-12">
        No se pudieron cargar las publicaciones. Inténtalo más tarde.
      </p>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visiblePosts = posts.slice(currentPage * POSTS_PER_PAGE, (currentPage + 1) * POSTS_PER_PAGE);

  const goNext = () => {
    setDirection('next');
    setCurrentPage((p) => (p >= totalPages - 1 ? 0 : p + 1));
  };

  const goBack = () => {
    setDirection('back');
    setCurrentPage((p) => (p <= 0 ? totalPages - 1 : p - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext(); else goBack();
    }
    touchStartX.current = null;
  };

  const slideClass = direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left';

  return (
    <div>
      {profile && <InstagramHeader profile={profile} />}
      <div
        className="relative max-w-337.5 mx-auto md:px-6 lg:px-12 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div key={currentPage} className={`grid grid-cols-3 md:gap-4 ${slideClass}`}>
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <>
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <GridButton direction="back" onClick={goBack} />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <GridButton direction="next" onClick={goNext} />
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentPage ? 'next' : 'back');
                  setCurrentPage(i);
                }}
                aria-label={`Página ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-colors ${i === currentPage ? 'bg-stone-700' : 'bg-stone-300 hover:bg-stone-400'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
