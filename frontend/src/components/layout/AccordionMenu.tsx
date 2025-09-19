import React, { useState } from 'react';
import { ChevronDown, ChevronRight, List, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionMenuProps {
  onMenuSelect: (menu: 'cot-list' | 'settings') => void;
  activeMenu: 'cot-list' | 'settings';
}

const AccordionMenu: React.FC<AccordionMenuProps> = ({ onMenuSelect, activeMenu }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    {
      id: 'cot-list' as const,
      label: 'CoT 리스트',
      icon: List,
    },
    {
      id: 'settings' as const,
      label: '설정',
      icon: Settings,
    },
  ];

  return (
    <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 h-full flex flex-col shadow-modern-lg">
      <div className="p-6 border-b border-slate-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <h1 className="text-xl font-bold text-gradient">CoT Maker</h1>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hover:bg-slate-100 rounded-lg px-3 py-2"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          메뉴
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuSelect(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 hover-lift",
                    "hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100",
                    activeMenu === item.id
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-modern"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    activeMenu === item.id ? "text-primary" : "text-slate-500"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default AccordionMenu;
