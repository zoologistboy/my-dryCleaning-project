import React from 'react';
import { Shirt } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  LogOut
} from 'lucide-react';


export default function DashboardLayout({ children, title }) {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
    { name: 'Orders', icon: <Package className="w-5 h-5" />, path: '/admin/orders' },
    { name: 'Customers', icon: <Users className="w-5 h-5" />, path: '/admin/customers' },
    { name: 'Transactions', icon: <CreditCard className="w-5 h-5" />, path: '/admin/transactions' },
    { name: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/admin/reports' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        {/* <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-md bg-white shadow-md"
        > */}
          {/* {showMobileMenu ? (
            <X className="h-6 w-6" />
          ) : (
            <Shirt className="h-6 w-6" />
          )} */}
        {/* </button> */}
      </div>

      //admin

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Topbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2">
                  {/* <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    A
                  </div> */}
                  {/* <span className="hidden md:inline">Admin</span> */}
                  {/* <ChevronDown className="w-4 h-4" /> */}
                </button>
                {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/logout"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}