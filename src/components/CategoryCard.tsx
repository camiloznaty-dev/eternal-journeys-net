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
    <Link to={href} className="block">
      <div className="bg-card rounded-lg p-6 card-hover elegant-shadow border border-border h-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
