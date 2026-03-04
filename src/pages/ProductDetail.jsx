import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Shield, Truck, RefreshCw, ArrowLeft, ChevronLeft, ChevronRight, X, Ruler } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI } from '../services/api';
import toast from 'react-hot-toast';

const formatPrice = (price) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
const getDiscount = (price, original) => (!original || original <= price) ? null : Math.round((1 - price / original) * 100);

const SHOE_SIZES = [
  { eu: '36', us: '4', cm: '22.5' },
  { eu: '37', us: '5', cm: '23.5' },
  { eu: '38', us: '5.5', cm: '24' },
  { eu: '39', us: '6.5', cm: '24.5' },
  { eu: '40', us: '7', cm: '25.5' },
  { eu: '41', us: '8', cm: '26' },
  { eu: '42', us: '8.5', cm: '27' },
  { eu: '43', us: '9.5', cm: '27.5' },
  { eu: '44', us: '10', cm: '28.5' },
  { eu: '45', us: '11', cm: '29' },
  { eu: '46', us: '12', cm: '30' },
];

const CLOTHING_SIZES = [
  { size: 'XS', chest: '86', waist: '70', hips: '90' },
  { size: 'S', chest: '90', waist: '75', hips: '94' },
  { size: 'M', chest: '96', waist: '80', hips: '100' },
  { size: 'L', chest: '102', waist: '86', hips: '106' },
  { size: 'XL', chest: '108', waist: '92', hips: '112' },
  { size: 'XXL', chest: '114', waist: '98', hips: '118' },
];

function SizeGuideModal({ onClose, isShoes }) {
  return (
    <div className="fixed inset-0 bg-dark-DEFAULT/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Ruler size={18} className="text-gold" />
            <h2 className="font-display text-xl font-light text-white">Таблица размеров</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          {isShoes ? (
            <>
              <p className="gold-label mb-3">Обувь</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">EU</th>
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">US</th>
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">CM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHOE_SIZES.map(row => (
                      <tr key={row.eu} className="border-b border-dark-border/50 hover:bg-dark-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-xs text-white">{row.eu}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-zinc-400">{row.us}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-zinc-400">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <p className="gold-label mb-3">Одежда</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">Размер</th>
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">Грудь (см)</th>
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">Талия (см)</th>
                      <th className="text-left py-2.5 px-3 font-mono text-xs text-gold font-normal tracking-wider">Бёдра (см)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLOTHING_SIZES.map(row => (
                      <tr key={row.size} className="border-b border-dark-border/50 hover:bg-dark-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-xs text-white font-medium">{row.size}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-zinc-400">{row.chest}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-zinc-400">{row.waist}</td>
                        <td className="py-2.5 px-3 font-mono text-xs text-zinc-400">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="mt-5 p-3 bg-dark-muted/30 border border-dark-border">
            <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
              ⚠️ Размеры могут отличаться в зависимости от бренда. Рекомендуем сверяться с размерной сеткой производителя.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [imgIndex, setImgIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI.getOne(id)
      .then(res => {
        setProduct(res.data);
        if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0]);
        if (res.data.colors?.length > 0) setSelectedColor(res.data.colors[0]);
      })
      .catch(() => toast.error('Товар не найден'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Войдите, чтобы добавить в корзину'); return; }
    if (product?.sizes?.length > 0 && !selectedSize) { toast.error('Выберите размер'); return; }

    setAdding(true);
    try {
      await addToCart(product.id, selectedSize, selectedColor);
      toast.success('Добавлено в корзину 🛍️');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ошибка');
    } finally {
      setAdding(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) { toast.error('Войдите, чтобы добавить в избранное'); return; }
    try {
      if (favorited) {
        await favoritesAPI.remove(product.id);
        setFavorited(false);
      } else {
        await favoritesAPI.add(product.id);
        setFavorited(true);
      }
    } catch (err) {
      toast.error('Ошибка');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square skeleton" />
          <div className="space-y-4">
            <div className="h-4 skeleton w-1/4" />
            <div className="h-8 skeleton w-3/4" />
            <div className="h-6 skeleton w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-5xl text-zinc-800 mb-4">404</p>
          <p className="text-zinc-500 mb-6">Товар не найден</p>
          <Link to="/catalog" className="btn-gold">Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.original_price);
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 mb-8 font-mono text-xs text-zinc-600">
          <Link to="/" className="hover:text-gold transition-colors">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-gold transition-colors">Каталог</Link>
          <span>/</span>
          {product.category_slug && (
            <>
              <Link to={`/catalog?category=${product.category_slug}`} className="hover:text-gold transition-colors">{product.category_name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-500 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden bg-dark-muted mb-3 group">
              <img
                src={images[imgIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-gold text-dark-DEFAULT font-mono text-xs font-bold px-2 py-1">
                  -{discount}%
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex(Math.max(0, imgIndex - 1))}
                    disabled={imgIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-DEFAULT/70 flex items-center justify-center text-white disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIndex(Math.min(images.length - 1, imgIndex + 1))}
                    disabled={imgIndex === images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-DEFAULT/70 flex items-center justify-center text-white disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-colors ${i === imgIndex ? 'border-gold' : 'border-dark-border hover:border-zinc-600'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="gold-label mb-2">{product.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-3 leading-tight">{product.name}</h1>

            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={12} className={s <= Math.round(product.rating) ? 'text-gold fill-gold' : 'text-zinc-700 fill-zinc-700'} />
                  ))}
                </div>
                <span className="font-mono text-xs text-zinc-500">{product.rating} ({product.reviews_count} отзывов)</span>
              </div>
            )}

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-dark-border">
              <span className="font-display text-4xl font-light text-gold">{formatPrice(product.price)}</span>
              {product.original_price > product.price && (
                <div className="flex flex-col">
                  <span className="font-body text-sm text-zinc-600 line-through">{formatPrice(product.original_price)}</span>
                  <span className="font-mono text-xs text-green-400">Экономия {formatPrice(product.original_price - product.price)}</span>
                </div>
              )}
            </div>

            {product.colors?.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-body text-sm text-zinc-300">Цвет</h3>
                  <span className="font-mono text-xs text-gold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-body border transition-all ${selectedColor === color ? 'border-gold text-gold' : 'border-dark-border text-zinc-400 hover:border-zinc-500'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-body text-sm text-zinc-300">Размер</h3>
                  <button onClick={() => setShowSizeGuide(true)} className="font-mono text-xs text-zinc-600 hover:text-gold transition-colors">Таблица размеров</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] py-2 px-3 text-sm font-mono border transition-all ${selectedSize === size
                        ? 'border-gold bg-gold text-dark-DEFAULT font-bold'
                        : 'border-dark-border text-zinc-400 hover:border-zinc-500'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span className="font-mono text-xs text-zinc-500">
                {product.stock > 10 ? 'В наличии' : product.stock > 0 ? `Осталось: ${product.stock} шт.` : 'Нет в наличии'}
              </span>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <div className="w-4 h-4 border-2 border-dark-DEFAULT border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingBag size={16} />
                )}
                {product.stock === 0 ? 'Нет в наличии' : 'В корзину'}
              </button>
              <button
                onClick={handleFavorite}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${favorited ? 'border-gold bg-gold/10 text-gold' : 'border-dark-border text-zinc-400 hover:border-gold hover:text-gold'
                  }`}
              >
                <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="space-y-3 border-t border-dark-border pt-6">
              {[
                [Shield, 'Верификация Poizon', 'Каждый товар проверен на подлинность'],
                [Truck, 'Доставка 7–14 дней', 'Прямая доставка из Китая до двери'],
                [RefreshCw, 'Возврат 14 дней', 'Если товар не соответствует описанию'],
              ].map(([Icon, title, desc]) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-white">{title}</p>
                    <p className="font-body text-xs text-zinc-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {product.description && (
              <div className="mt-6 border-t border-dark-border pt-6">
                <h3 className="gold-label mb-3">Описание</h3>
                <p className="font-body text-sm text-zinc-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.sku && (
              <p className="mt-4 font-mono text-xs text-zinc-700">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </div>

      {showSizeGuide && (
        <SizeGuideModal
          onClose={() => setShowSizeGuide(false)}
          isShoes={product.sizes?.some(s => /^\d/.test(s))}
        />
      )}
    </div>
  );
}
