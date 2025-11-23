import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const CategoryCard = ({ title, description, icon: Icon, href }: CategoryCardProps) => {
  return (
    <Link to={href}>
      <div className="group bg-card border border-border card-hover p-6 h-full space-y-4">
        <Icon className="h-6 w-6 text-accent" />
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
};
