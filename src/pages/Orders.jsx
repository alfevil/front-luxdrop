import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

const STATUS_CONFIG = {
  pending: { label: 'Ожидает подтверждения', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  confirmed: { label: 'Подтверждён', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  processing: { label: 'Обрабатывается', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  shipped: { label: 'Отправлен', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' },
  delivered: { label: 'Доставлен', color: 'text-green-400 bg-green-400/10 border-green-400/30' },
  cancelled: { label: 'Отменён', color: 'text-red-400 bg-red-400/10 border-red-400/30' },
};

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="card overflow-hidden">
      <div
        className="p-4 md:p-5 cursor-pointer flex items-center justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-10 h-10 bg-dark-muted flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-gold" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs text-zinc-500 mb-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="font-body text-sm text-white">{new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <span className={`inline-block mt-1 font-mono text-[10px] px-2 py-0.5 border ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-display text-lg text-gold">{formatPrice(order.total_amount)}</span>
          {expanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-dark-border p-4 md:p-5">
          {order.status !== 'cancelled' && (
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                {STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-2 h-2 rounded-full ${i <= currentStep ? 'bg-gold' : 'bg-dark-muted'}`} />
                    <span className={`font-mono text-[9px] tracking-wide text-center hidden md:block ${i <= currentStep ? 'text-gold' : 'text-zinc-700'}`}>
                      {STATUS_CONFIG[step]?.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-0.5 bg-dark-muted relative -mt-4 -z-10">
                <div
                  className="h-full bg-gold transition-all duration-1000"
                  style={{ width: `${Math.max(0, (currentStep / (STEPS.length - 1))) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4">
            {order.items?.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-dark-muted overflow-hidden flex-shrink-0">
                  {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white line-clamp-1">{item.name || item.product_snapshot?.name}</p>
                  <div className="flex gap-2 font-mono text-[10px] text-zinc-500">
                    <span>x{item.quantity}</span>
                    {item.size && <span>· {item.size}</span>}
                    {item.color && <span>· {item.color}</span>}
                  </div>
                </div>
                <span className="font-mono text-xs text-gold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dark-border pt-4 grid sm:grid-cols-2 gap-4 text-xs">
            {order.shipping_address && (
              <div>
                <p className="gold-label text-[10px] mb-1">Адрес доставки</p>
                <p className="text-zinc-400 font-body">{order.shipping_address.city}, {order.shipping_address.street}</p>
                <p className="text-zinc-400 font-body">{order.shipping_address.name} · {order.shipping_address.phone}</p>
              </div>
            )}
            {order.tracking_number && (
              <div>
                <p className="gold-label text-[10px] mb-1">Трек-номер</p>
                <p className="font-mono text-gold">{order.tracking_number}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 pt-3 border-t border-dark-border">
            <span className="font-body text-sm text-zinc-400">Итого: <span className="font-display text-lg text-gold ml-1">{formatPrice(order.total_amount)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getAll()
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="gold-label mb-1">История</p>
          <h1 className="font-display text-4xl font-light text-white">Мои заказы</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={40} className="text-zinc-700 mb-4" />
            <p className="font-display text-2xl text-zinc-700 mb-2">Заказов пока нет</p>
            <Link to="/catalog" className="btn-gold mt-6">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
