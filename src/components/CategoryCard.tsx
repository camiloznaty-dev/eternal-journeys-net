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
      <div className="group bg-card border border-border card-hover p-6 h-full space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
        <Icon className="h-6 w-6 text-accent transition-transform duration-300 group-hover:scale-110" />
        <div className="space-y-1">
          <h3 className="font-semibold group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
};
