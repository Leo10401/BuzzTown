'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { title: 'Manage Events', href: '/admin/manageproduct', icon: '🎪' },
    { title: 'Manage Orders', href: '/admin/manage-orders', icon: '🛒' },
    { title: 'Manage Users', href: '/admin/manage-users', icon: '👥' },
    { title: 'Add Event', href: '/admin/addproduct', icon: '➕' },
    { title: 'Previous Events', href: '/admin/addprevious', icon: '📅' },
  ];

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className={`font-bold ${isCollapsed ? 'hidden' : 'block'}`}>Admin Panel</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className={`flex items-center p-3 rounded-lg transition-colors
                  ${pathname === item.href ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                    {item.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
