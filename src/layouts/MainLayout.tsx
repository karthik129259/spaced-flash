import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  navbar?: ReactNode;      // Pass Navbar component here
  sidebar?: ReactNode;     // Optional sidebar component
  footer?: ReactNode;      // Optional footer component
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  navbar,
  sidebar,
  footer,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${className}`}>
      
      {/* Navbar */}
      <header className="w-full sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        {navbar}
      </header>

      {/* Body container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center p-4 text-sm">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
