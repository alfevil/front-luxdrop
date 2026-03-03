import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'newest', label: 'Новинки' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'rating', label: 'По рейтингу' },
];

const BRANDS = ['Nike', 'Adidas', 'New Balance', 'Fear of God', 'Carhartt', 'Stone Island', 'Supreme', 'New Era'];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    min_price: '',
    max_price: '',
    featured: searchParams.get('featured') || '',
  });

  useEffect(() => {
    productsAPI.getCategories().then(res => setCategories(res.data));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    try {
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '', search: '', sort: '', min_price: '', max_price: '', featured: '' });
    setSearchParams({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="gold-label mb-1">
              {filters.search ? `Поиск: "${filters.search}"` :
               filters.category ? categories.find(c => c.slug === filters.category)?.name : 'Все товары'}
            </p>
            <h1 className="font-display text-4xl font-light text-white">Каталог</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500">{products.length} товаров</span>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 border text-sm font-body transition-colors ${
                filtersOpen || activeFiltersCount > 0 ? 'border-gold text-gold' : 'border-dark-border text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <SlidersHorizontal size={14} />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-gold text-dark-DEFAULT text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sort bar (always visible) */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-body border transition-all ${
                filters.sort === opt.value
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-dark-border text-zinc-500 hover:border-zinc-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-56 lg:w-64 flex-shrink-0`}>
            <div className="sticky top-24 space-y-6">
              {/* Active filters */}
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                  <X size={12} /> Сбросить фильтры
                </button>
              )}

              {/* Categories */}
              <div>
                <h3 className="gold-label mb-3">Категории</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                        filters.category === cat.slug
                          ? 'text-gold bg-gold/10 border-l-2 border-gold'
                          : 'text-zinc-400 hover:text-white hover:bg-dark-muted'
                      }`}
                    >
                      {cat.name}
                      <span className="text-[10px] text-zinc-600">{cat.products_count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="gold-label mb-3">Бренды</h3>
                <div className="space-y-1">
                  {BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => updateFilter('brand', brand)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm font-body transition-colors ${
                        filters.brand === brand ? 'text-gold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className={`w-3 h-3 border flex-shrink-0 ${filters.brand === brand ? 'border-gold bg-gold' : 'border-dark-border'}`} />
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="gold-label mb-3">Цена (₽)</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="От"
                    value={filters.min_price}
                    onChange={e => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
                    className="input-dark text-xs py-2"
                  />
                  <input
                    type="number"
                    placeholder="До"
                    value={filters.max_price}
                    onChange={e => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
                    className="input-dark text-xs py-2"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square skeleton" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-5xl text-zinc-800 mb-4">404</p>
                <p className="font-body text-zinc-500 mb-6">Ничего не нашли по этим фильтрам</p>
                <button onClick={clearFilters} className="btn-outline py-2 px-6 text-xs">Сбросить</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
