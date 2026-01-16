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
          className="absolute inset-0 -z-10 h-24 w-24 rounded-full blur-xl opacity-50"
          style={{ backgroundColor: themeColor }}
        />
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={image || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name & Username */}
      <div>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">@{username}</p>
      </div>

      {/* Bio */}
      {bio && (
        <p className="mx-auto max-w-md text-muted-foreground">{bio}</p>
      )}

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{totalSupporters}</span>
          <span className="text-muted-foreground">서포터</span>
        </div>
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{totalCoffees}</span>
          <span className="text-muted-foreground">커피</span>
        </div>
      </div>

      {/* Social Links */}
      {socialLinks && Object.keys(socialLinks).length > 0 && (
        <div className="flex justify-center gap-2">
          {Object.entries(socialLinks).map(([platform, url]) => {
            const Icon = socialIcons[platform] || Globe;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'rounded-full p-2 transition-colors',
                  'hover:bg-muted'
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
