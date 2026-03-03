import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Добро пожаловать!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-DEFAULT/20 to-dark-DEFAULT/80" />
        <div className="absolute bottom-12 left-12">
          <p className="gold-label mb-2">LUXDROP</p>
          <p className="font-display text-4xl font-light text-white max-w-xs leading-tight">
            Брендовые вещи из Китая
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-sm">
          <Link to="/" className="block mb-10">
            <span className="font-display text-2xl font-light tracking-[0.15em] text-white">LUXDROP</span>
          </Link>

          <div className="mb-8">
            <p className="gold-label mb-2">С возвращением</p>
            <h1 className="font-display text-3xl font-light text-white">Войти в аккаунт</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-dark"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-dark pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-dark-DEFAULT border-t-transparent rounded-full animate-spin" /> : 'Войти'}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-zinc-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-gold hover:text-gold-light transition-colors">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
