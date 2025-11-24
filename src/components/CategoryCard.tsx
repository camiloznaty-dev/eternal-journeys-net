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
      <div className="group bg-card border border-border card-hover p-6 h-full space-y-4 rounded-xl transition-all duration-300 hover:shadow-medium hover:border-accent/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-soft">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
};
