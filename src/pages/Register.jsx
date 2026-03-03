import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Пароли не совпадают'); return; }
    if (form.password.length < 6) { toast.error('Пароль минимум 6 символов'); return; }

    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Аккаунт создан!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-DEFAULT/20 to-dark-DEFAULT/80" />
        <div className="absolute bottom-12 left-12">
          <p className="gold-label mb-2">Новые поставки</p>
          <p className="font-display text-4xl font-light text-white max-w-xs leading-tight">Каждую неделю</p>
        </div>
      </div>

      <div className="flex-1 lg:max-w-md flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-sm">
          <Link to="/" className="block mb-10">
            <span className="font-display text-2xl font-light tracking-[0.15em] text-white">LUXDROP</span>
          </Link>

          <div className="mb-8">
            <p className="gold-label mb-2">Добро пожаловать</p>
            <h1 className="font-display text-3xl font-light text-white">Создать аккаунт</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Имя</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Иван" className="input-dark" required />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="input-dark" required />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Пароль</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Минимум 6 символов" className="input-dark pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-zinc-600 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Подтвердить пароль</label>
              <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="input-dark" required />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-dark-DEFAULT border-t-transparent rounded-full animate-spin" /> : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-zinc-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
