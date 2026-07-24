import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { primaryNavItems, accountNavItems } from '../../config/navigation';
import useLogout from '../../contexts/useLogout';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout, loggingOut } = useLogout();

  const isActive = (path) => location.pathname.startsWith(path);

  const NavButton = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.activePath);
    return (
      <button
        onClick={() => navigate(item.path)}
        className={`group relative w-full flex items-center p-3.5 rounded font-body font-semibold text-left transition-colors ${
          active
            ? 'bg-ink text-paper'
            : 'text-ink hover:bg-white border border-transparent hover:border-ink/10'
        }`}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-redpen rounded-full" />}
        <Icon className="w-5 h-5 mr-3.5" />
        <span>{item.label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-highlighter" />}
      </button>
    );
  };

  return (
    <div className="hidden lg:block w-72 bg-paper border-r-2 border-dashed border-ink/20 h-screen sticky top-0">
      <div className="p-6">
        <nav className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft px-3.5 mb-2">Menu</p>
          {primaryNavItems.map((item) => <NavButton key={item.path} item={item} />)}

          <div className="pt-4 mt-4 border-t border-dashed border-ink/20">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft px-3.5 mb-2">Account</p>
            {accountNavItems.map((item) => <NavButton key={item.path} item={item} />)}
          </div>

          <div className="pt-4 mt-4 border-t border-dashed border-ink/20">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={`group w-full flex items-center p-3.5 rounded font-body font-semibold text-left transition-colors ${
                loggingOut
                  ? 'text-ink-soft cursor-not-allowed'
                  : 'text-redpen hover:bg-redpen/5 border border-transparent hover:border-redpen/20'
              }`}
            >
              <LogOut className={`w-5 h-5 mr-3.5 ${loggingOut ? 'animate-spin' : ''}`} />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}