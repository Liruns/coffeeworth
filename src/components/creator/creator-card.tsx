import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coffee, Github, Twitter, Globe, BookOpen } from 'lucide-react';
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
  totalSupporters,
  totalCoffees,
  socialLinks,
}: CreatorCardProps) {
  const displayName = name || username;

  return (
    <article className="text-center space-y-6">
      {/* Avatar Section */}
      <div className="relative mx-auto w-fit">
        <Avatar className="h-24 w-24 border shadow-sm">
          <AvatarImage src={image || undefined} alt={displayName} className="object-cover" />
          <AvatarFallback className="text-2xl font-bold bg-[#FFDD00] text-black">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFDD00] text-black shadow-sm border-2 border-background">
          <Coffee className="h-4 w-4" />
        </div>
      </div>

      {/* Name & Username */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{displayName}</h1>
        <p className="text-muted-foreground font-medium">@{username}</p>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          {bio}
        </p>
      )}

      {/* Stats */}
      <div className="flex justify-center items-center gap-8 py-2">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-foreground">{totalSupporters}</span>
          <span className="text-sm text-muted-foreground">서포터</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-foreground">{totalCoffees}</span>
          <span className="text-sm text-muted-foreground">누적 커피</span>
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
                className="p-2 rounded-lg border bg-background hover:bg-muted transition-colors shadow-sm"
                aria-label={`${platform} 링크`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      )}
    </article>
  );
}
