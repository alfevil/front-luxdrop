import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name: form.name });
      updateUser(res.data);
      setEditing(false);
      toast.success('Профиль обновлён');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="gold-label mb-1">Личный кабинет</p>
          <h1 className="font-display text-4xl font-light text-white">Мой профиль</h1>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            {[
              ['/profile', User, 'Профиль', true],
              ['/orders', ShoppingBag, 'Заказы', false],
              ['/favorites', Heart, 'Избранное', false],
            ].map(([href, Icon, label, active]) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-body transition-colors ${active ? 'text-gold border-l-2 border-gold bg-gold/10' : 'text-zinc-400 hover:text-white hover:bg-dark-muted border-l-2 border-transparent'
                  }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-body font-medium text-white">Личные данные</h2>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="font-mono text-xs text-gold hover:text-gold-light transition-colors">
                    Изменить
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-border">
                <div className="w-16 h-16 bg-dark-muted border border-dark-border flex items-center justify-center flex-shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-zinc-600" />
                  )}
                </div>
                <div>
                  <p className="font-body font-medium text-white">{user?.name}</p>
                  <p className="font-mono text-xs text-zinc-500">{user?.email}</p>
                  <p className="font-mono text-[10px] text-gold uppercase mt-1">
                    {user?.role === 'admin' ? '👑 Администратор' : 'Покупатель'}
                  </p>
                </div>
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Имя</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Email</label>
                    <input type="email" value={user?.email} disabled className="input-dark opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} disabled={loading} className="btn-gold py-2 px-6 text-xs disabled:opacity-50">
                      Сохранить
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-outline py-2 px-6 text-xs">
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[['Имя', user?.name], ['Email', user?.email], ['Дата регистрации', new Date(user?.created_at).toLocaleDateString('ru-RU')]].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-dark-border/50">
                      <span className="font-mono text-xs text-zinc-500">{label}</span>
                      <span className="font-body text-sm text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={logout} className="w-full card p-4 text-red-400 hover:text-red-300 hover:border-red-900 transition-colors font-body text-sm text-left">
              Выйти из аккаунта →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
