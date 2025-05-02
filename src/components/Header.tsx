
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm border-b">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-medical-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-medical-100 flex items-center justify-center">
            <span className="text-medical-700 text-xs font-medium">DR</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
