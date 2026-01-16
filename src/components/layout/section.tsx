import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'muted' | 'cream' | 'brand' | 'transparent';
  id?: string;
}

const backgroundMap = {
  default: 'bg-background',
  muted: 'bg-muted/50',
  cream: 'bg-[#FFF8E7]',
  brand: 'bg-[#FFDD00]',
  transparent: 'bg-transparent',
};

export function Section({
  children,
  className,
  background = 'default',
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        backgroundMap[background],
        className
      )}
    >
      {children}
    </section>
  );
}
