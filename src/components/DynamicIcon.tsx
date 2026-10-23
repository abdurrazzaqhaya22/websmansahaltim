"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = "w-5 h-5" }: DynamicIconProps) {
  // @ts-expect-error Lucide dynamic icon indexing
  const IconComponent = LucideIcons[name] || LucideIcons.ExternalLink;
  return <IconComponent className={className} />;
}

