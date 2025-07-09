import { Outlet, Link } from 'react-router-dom';
import { BellIcon, LogoutIcon, UserCircleIcon } from '@heroicons/react/outline';
export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4">
        <div className="flex items-center space-x-2 p-4 border-b border-blue-700">
          <ShirtIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold">FreshPress Admin</h1>
        </div>
        <nav className="mt-6">
          <NavItem to="/admin" icon={<DashboardIcon />} text="Dashboard" />
          <NavItem to="/admin/orders" icon={<ClipboardListIcon />} text="Orders" />
          <NavItem to="/admin/users" icon={<UsersIcon />} text="Users" />
          <NavItem to="/admin/staff" icon={<BadgeCheckIcon />} text="Staff" />
          <NavItem to="/admin/inventory" icon={<CubeIcon />} text="Inventory" />
          <NavItem to="/admin/payments" icon={<CreditCardIcon />} text="Payments" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <SearchBar />
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <UserDropdown />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const NavItem = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center p-3 rounded-lg hover:bg-blue-700 mb-1">
    <span className="mr-3">{icon}</span>
    {text}
  </Link>
);