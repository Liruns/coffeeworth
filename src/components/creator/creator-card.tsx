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
    <div className="space-y-6 text-center">
      {/* Avatar */}
      <div className="relative mx-auto w-fit">
        <div
          className="absolute inset-0 -z-10 h-28 w-28 -translate-x-2 -translate-y-2 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: themeColor }}
        />
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarImage src={image || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl font-bold bg-[#FFDD00] text-black">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Username */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
        <p className="text-lg text-muted-foreground font-medium">@{username}</p>
      </div>

      {/* Bio */}
      {bio && (
        <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">{bio}</p>
      )}

      {/* Stats */}
      <div className="flex justify-center items-center gap-8 py-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[#6F4E37] font-semibold">
            <Users className="h-5 w-5" />
            <span className="text-xl">{totalSupporters}</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">서포터</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[#6F4E37] font-semibold">
            <Coffee className="h-5 w-5" />
            <span className="text-xl">{totalCoffees}</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">커피</span>
        </div>
      </div>

      {/* Social Links */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="flex justify-center gap-3">
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
                  'rounded-full p-2.5 transition-all duration-200 border bg-card shadow-sm',
                  'hover:bg-[#FFDD00] hover:text-black hover:border-[#FFDD00] hover:shadow-md'
                )}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
