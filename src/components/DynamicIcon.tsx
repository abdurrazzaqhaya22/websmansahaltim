import React from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  Camera,
  Link as LinkIcon,
  FileText,
  Globe,
  Award,
  Calendar,
  Sparkles,
  HeartHandshake,
  Building,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  GraduationCap,
  Users,
  Camera,
  Link: LinkIcon,
  FileText,
  Globe,
  Award,
  Calendar,
  Sparkles,
  HeartHandshake,
  Building,
  ExternalLink,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
  const IconComponent = (name && ICON_MAP[name]) || ExternalLink;
  return <IconComponent className={className} />;
}
