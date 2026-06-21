import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  FiGrid,
  FiHome,
  FiMail,
  FiStar,
  FiImage,
  FiEdit3,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin", label: "Dashboard", Icon: FiGrid, end: true },
  { to: "/admin/properties", label: "Properties", Icon: FiHome },
  { to: "/admin/enquiries", label: "Enquiries", Icon: FiMail },
  { to: "/admin/testimonials", label: "Testimonials", Icon: FiStar },
  { to: "/admin/banners", label: "Banners", Icon: FiImage },
  { to: "/admin/blog", label: "Blog", Icon: FiEdit3 },
  { to: "/admin/settings", label: "Settings", Icon: FiSettings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const Sidebar = (
    <div className="flex h-full flex-col bg-navy-950 text-white">
      <div className="border-b border-white/10 p-5">
        <Logo height="h-16" />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {LINKS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-gold text-navy-900" : "text-white/70 hover:bg-white/5"
              }`
            }
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5">
          <FiExternalLink /> View Website
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/5">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-lightgrey">
      <aside className="hidden w-64 shrink-0 lg:block">{Sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">{Sidebar}</div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <button className="text-2xl lg:hidden" onClick={() => setOpen(true)}>
            <FiMenu />
          </button>
          <h1 className="hidden text-lg font-semibold text-navy-900 lg:block">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-semibold text-navy-900">
              {user?.name?.[0] || "A"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
