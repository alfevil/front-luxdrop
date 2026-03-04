import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Каталог', href: '/catalog' },
    { label: 'Кроссовки', href: '/catalog?category=sneakers' },
    { label: 'Одежда', href: '/catalog?category=clothing' },
    { label: 'Аксессуары', href: '/catalog?category=accessories' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-DEFAULT/95 backdrop-blur-sm border-b border-dark-border' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex flex-col leading-none group">
              <span className="font-display text-2xl md:text-3xl font-light tracking-[0.15em] text-white group-hover:text-gold transition-colors duration-200">
                LUXDROP
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-gold uppercase opacity-70">
                Premium Streetwear
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <Search size={20} />
              </button>

              <Link to="/cart" className="p-2 relative text-zinc-400 hover:text-white transition-colors duration-200">
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-gold text-dark-DEFAULT text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 text-zinc-400 hover:text-white transition-colors">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b border-dark-border">
                      <p className="text-xs text-zinc-500">Привет,</p>
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-dark-muted transition-colors">
                      <User size={14} /> Профиль
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-dark-muted transition-colors">
                      <ShoppingBag size={14} /> Заказы
                    </Link>
                    <Link to="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-dark-muted transition-colors">
                      <Heart size={14} /> Избранное
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-muted transition-colors w-full border-t border-dark-border">
                      <LogOut size={14} /> Выйти
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block btn-outline py-2 px-5 text-xs">
                  Войти
                </Link>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark-card border-t border-dark-border">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 text-zinc-300 hover:text-gold border-b border-dark-border/50 font-body text-sm tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-3 flex gap-3">
                  <Link to="/login" className="btn-outline py-2 px-4 text-xs">Войти</Link>
                  <Link to="/register" className="btn-gold py-2 px-4 text-xs">Регистрация</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 bg-dark-DEFAULT/95 backdrop-blur-sm z-[60] flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl px-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск: Nike, Yeezy, Supreme..."
                className="w-full bg-transparent border-b-2 border-gold text-white text-2xl font-display font-light py-4 pr-12 focus:outline-none placeholder:text-zinc-700"
              />
              <button type="submit" className="absolute right-0 top-4 text-gold">
                <Search size={24} />
              </button>
            </form>
            <button
              onClick={() => setSearchOpen(false)}
              className="mt-6 text-zinc-500 hover:text-white text-sm font-body transition-colors"
            >
              ESC — закрыть
            </button>
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
}
