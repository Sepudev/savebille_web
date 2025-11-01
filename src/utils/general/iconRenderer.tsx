import * as PhosphorIcons from "@phosphor-icons/react";

export const renderIcon = (iconName: string) => {
  const pascalCase = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const Icon = (PhosphorIcons as any)[pascalCase];

  if (Icon) {
    return <Icon className="h-3.5 w-3.5" weight="bold" />;
  }

  const DirectIcon = (PhosphorIcons as any)[iconName];
  if (DirectIcon) {
    return <DirectIcon className="h-3.5 w-3.5" weight="bold" />;
  }

  return <span className="text-base">{iconName}</span>;
};
