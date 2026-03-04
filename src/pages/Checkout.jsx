import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    name: '', phone: '', city: '', street: '', apartment: '', zip: '',
    payment: 'card', notes: ''
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.street) {
      toast.error('Заполните обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const res = await ordersAPI.create({
        shipping_address: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          street: form.street,
          apartment: form.apartment,
          zip: form.zip,
        },
        payment_method: form.payment,
        notes: form.notes,
      });

      setOrderId(res.data.id);
      setSuccess(true);
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка оформления');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gold/10 border border-gold/30">
            <CheckCircle size={40} className="text-gold" />
          </div>
          <h1 className="font-display text-4xl font-light text-white mb-3">Заказ оформлен!</h1>
          <p className="font-body text-sm text-zinc-400 mb-2">
            Ваш заказ #{orderId.slice(0, 8).toUpperCase()} принят.
          </p>
          <p className="font-body text-sm text-zinc-500 mb-8">
            Мы свяжемся с вами в Telegram/WhatsApp для подтверждения оплаты и уточнения деталей доставки.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/orders')} className="btn-gold">Мои заказы</button>
            <button onClick={() => navigate('/')} className="btn-outline">На главную</button>
          </div>
        </div>
      </div>
    );
  }

  const shipping = total >= 10000 ? 0 : 500;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="gold-label mb-1">Шаг 3 из 3</p>
          <h1 className="font-display text-4xl font-light text-white">Оформление заказа</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-body font-medium text-white mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark-DEFAULT text-xs font-mono flex items-center justify-center">1</span>
                  Контактные данные
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Имя *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Иван Иванов" className="input-dark" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Телефон *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+7 (999) 999-99-99" className="input-dark" required />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-body font-medium text-white mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark-DEFAULT text-xs font-mono flex items-center justify-center">2</span>
                  Адрес доставки
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Город *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Москва" className="input-dark" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Улица, дом *</label>
                    <input name="street" value={form.street} onChange={handleChange} placeholder="ул. Ленина, д. 1" className="input-dark" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Квартира</label>
                    <input name="apartment" value={form.apartment} onChange={handleChange} placeholder="кв. 42" className="input-dark" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Индекс</label>
                    <input name="zip" value={form.zip} onChange={handleChange} placeholder="123456" className="input-dark" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-body font-medium text-white mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark-DEFAULT text-xs font-mono flex items-center justify-center">3</span>
                  Способ оплаты
                </h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[['card', '💳 Карта'], ['sbp', '⚡ СБП'], ['cash', '💵 При получении']].map(([val, label]) => (
                    <label
                      key={val}
                      className={`flex items-center justify-center gap-2 p-3 border cursor-pointer transition-all ${form.payment === val ? 'border-gold bg-gold/10 text-gold' : 'border-dark-border text-zinc-400 hover:border-zinc-600'
                        }`}
                    >
                      <input type="radio" name="payment" value={val} checked={form.payment === val} onChange={handleChange} className="hidden" />
                      <span className="font-body text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <label className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block mb-1.5">Комментарий к заказу</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Особые пожелания, время доставки..."
                  className="input-dark resize-none"
                />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 self-start">
              <div className="card p-6">
                <h3 className="font-body font-medium text-white mb-4">Ваш заказ</h3>
                <div className="space-y-3 pb-4 border-b border-dark-border">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 overflow-hidden bg-dark-muted flex-shrink-0">
                        <img src={item.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-white line-clamp-1">{item.name}</p>
                        <p className="font-mono text-[10px] text-zinc-500">x{item.quantity} {item.size && `· ${item.size}`}</p>
                      </div>
                      <span className="font-mono text-xs text-gold flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="py-3 space-y-2 border-b border-dark-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-body">Товары</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 font-body">Доставка</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-3 mb-5">
                  <span className="font-body text-white">Итого</span>
                  <span className="font-display text-2xl text-gold">{formatPrice(total + shipping)}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-dark-DEFAULT border-t-transparent rounded-full animate-spin" />
                  ) : 'Подтвердить заказ'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
