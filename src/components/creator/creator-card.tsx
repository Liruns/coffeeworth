import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, Github, Twitter, Globe, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorCardProps {
  name: string | null;
  username: string;
  image: string | null;
  bio: string | null;
  themeColor: string;
  totalSupporters: number;
  totalCoffees: number;
  socialLinks?: Record<string, string> | null;
}

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  twitter: Twitter,
  blog: BookOpen,
  website: Globe,
};

export function CreatorCard({
  name,
  username,
  image,
  bio,
  themeColor,
  totalSupporters,
  totalCoffees,
  socialLinks,
}: CreatorCardProps) {
  const displayName = name || username;

  return (
    <article className="space-y-8 px-4 text-center">
      {/* Avatar Section */}
      <div className="relative mx-auto w-fit">
        <div
          className="absolute inset-0 -z-10 h-32 w-32 -translate-x-2 -translate-y-2 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{ backgroundColor: themeColor }}
        />
        <Avatar className="h-28 w-28 border-4 border-white dark:border-zinc-900 shadow-[0_15px_35px_rgba(0,0,0,0.15)] ring-4 ring-[#FFDD00]/10 transition-transform hover:scale-105 duration-500">
          <AvatarImage src={image || undefined} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-3xl font-black bg-[#FFDD00] text-black">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFDD00] text-black shadow-lg ring-4 ring-white dark:ring-zinc-900">
          <Coffee className="h-6 w-6 fill-black/10" />
        </div>
      </div>

      {/* Name & Username */}
      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">{displayName}</h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-muted-foreground/10 shadow-sm">
          <span className="text-lg font-bold text-[#6F4E37] dark:text-[#FFDD00]">@{username}</span>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <div className="relative mx-auto max-w-md">
          <p className="text-xl leading-relaxed text-muted-foreground font-medium italic">
            "{bio}"
          </p>
        </div>
      )}

      {/* Stats - Redesigned for impact */}
      <div className="flex justify-center items-center gap-4 py-6">
        <div className="flex-1 max-w-[140px] p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-[#FFDD00]/20 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-[#6F4E37] dark:text-[#FFDD00]">{totalSupporters}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">서포터</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-[140px] p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-[#FFDD00]/20 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-[#6F4E37] dark:text-[#FFDD00]">{totalCoffees}</span>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">누적 커피</span>
          </div>
        </div>
      </div>

      {/* Social Links - More polished */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="flex justify-center gap-4">
          {Object.entries(socialLinks).map(([platform, url]) => {
            if (!url) return null;
            const Icon = socialIcons[platform] || Globe;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group rounded-2xl p-3.5 transition-all duration-300 border bg-white dark:bg-zinc-900 shadow-sm',
                  'hover:bg-[#FFDD00] hover:text-black hover:border-[#FFDD00] hover:shadow-[0_8px_20px_rgba(255,221,0,0.3)] hover:-translate-y-1'
                )}
                aria-label={`${platform} 링크`}
              >
                <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
              </a>
            );
          })}
        </div>
      )}
    </article>
  );
}

