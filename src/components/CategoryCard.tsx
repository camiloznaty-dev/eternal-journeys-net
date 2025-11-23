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
      <div className="group bg-card rounded-2xl p-8 elegant-shadow border border-border card-hover cursor-pointer h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 hero-glow">
            <Icon className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
      </div>
    </Link>
  );
};
