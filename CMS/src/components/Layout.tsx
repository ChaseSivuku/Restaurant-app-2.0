import { Outlet, Link, useLocation } from 'react-router-dom';

const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  return (
    <Link
      to={item.path}
      className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
        isActive
          ? 'bg-gray-800 text-white border-l-4 border-primary'
          : ''
      }`}
    >
      <img 
        src={isActive ? item.icon : item.iconInactive} 
        alt={item.label}
        className="w-5 h-5 mr-3"
      />
      <span>{item.label}</span>
    </Link>
  );
};

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: '/icons/home-active.png', 
      iconInactive: '/icons/home-inactive.png'
    },
    { 
      path: '/food-items', 
      label: 'Food Items', 
      icon: '/icons/order-food-active.png', 
      iconInactive: '/icons/order-food-inactive.png'
    },
    { 
      path: '/orders', 
      label: 'Orders', 
      icon: '/icons/cart-active.png', 
      iconInactive: '/icons/cart-inactive.png'
    },
    { 
      path: '/restaurant-info', 
      label: 'Restaurant Info', 
      icon: '/icons/user-tab-active.png', 
      iconInactive: '/icons/user-tab-inactive.png'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="p-6">
          <img 
            src="/icons/logo-text-background(1).png" 
            alt="Restaurant Logo" 
            className="h-10 w-auto mb-2"
            onError={(e) => {
              // Fallback if logo not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return <NavItem key={item.path} item={item} isActive={isActive} />;
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

