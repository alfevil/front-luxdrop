import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);

export default function Cart() {
  const { items, total, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Удалено из корзины');
    } catch {
      toast.error('Ошибка');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 text-center px-4">
        <div className="w-20 h-20 border border-dark-border flex items-center justify-center">
          <ShoppingBag size={32} className="text-zinc-700" />
        </div>
        <div>
          <p className="font-display text-3xl text-zinc-700 mb-2">Корзина пуста</p>
          <p className="font-body text-sm text-zinc-600">Добавьте что-нибудь из каталога</p>
        </div>
        <Link to="/catalog" className="btn-gold">Перейти в каталог</Link>
      </div>
    );
  }

  const shipping = total >= 10000 ? 0 : 500;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="gold-label mb-1">{items.length} {items.length === 1 ? 'товар' : 'товара'}</p>
          <h1 className="font-display text-4xl font-light text-white">Корзина</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4">
                <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-dark-muted">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="gold-label text-[10px] mb-0.5">{item.brand}</p>
                      <Link to={`/product/${item.product_id}`}>
                        <h3 className="font-body text-sm text-white hover:text-gold transition-colors line-clamp-2">{item.name}</h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex gap-3 mt-1">
                    {item.size && <span className="font-mono text-xs text-zinc-500">Размер: {item.size}</span>}
                    {item.color && <span className="font-mono text-xs text-zinc-500">Цвет: {item.color}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-dark-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-mono text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="font-display text-lg text-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="card p-6">
              <h2 className="font-body font-medium text-white mb-5">Итого</h2>

              <div className="space-y-3 pb-4 border-b border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-body">Товары ({items.length})</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 font-body">Доставка</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'Бесплатно' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="font-mono text-[10px] text-zinc-600">Бесплатная доставка от 10 000 ₽</p>
                )}
              </div>

              <div className="flex justify-between items-end pt-4 mb-6">
                <span className="font-body text-white">Итого</span>
                <span className="font-display text-2xl text-gold">{formatPrice(finalTotal)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Оформить заказ <ArrowRight size={16} />
              </button>

              <Link to="/catalog" className="block text-center mt-3 font-body text-xs text-zinc-500 hover:text-gold transition-colors">
                ← Продолжить покупки
              </Link>
            </div>

            <div className="mt-4 card p-4 space-y-2">
              {['✅ Верификация Poizon', '🔒 Безопасная оплата', '📦 Доставка 7–14 дней'].map(text => (
                <p key={text} className="font-mono text-[10px] text-zinc-500">{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
