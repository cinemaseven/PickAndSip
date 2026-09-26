import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Chip from '../atoms/Chip';

const ratings = [{ label: 'Any', value: null }, { label: '2+', value: 2 }, { label: '3.5+', value: 3.5 }, { label: '4.5+', value: 4.5 }];
export default function FilterBar({ filters, setFilters }) {
  const [open, setOpen] = useState(null);
  const tags = ['Study', 'Hangout', 'Aesthetic', 'Quiet'];
  const setRating = v => {
    setFilters(f => ({ ...f, minRating: v }));
    setOpen(null);
  };
  const toggle = (key, v) => setFilters(f => ({ ...f, [key]: f[key].includes(v) ? f[key].filter(x => x !== v) : [...f[key], v] }));
  const clear = () => setFilters({ minRating: null, priceRanges: [], tags: [] });
  return <div className="filter-bar">
  <div className="dropdown-wrap">
  <button className="filter-button" onClick={() => setOpen(open === 'rating' ? null : 'rating')}>Rating <ChevronDown size={19}/>
  </button>{open === 'rating' && <div className="filter-menu">{ratings.map(r => <button key={r.label} onClick={() => setRating(r.value)}>{r.label}</button>)}</div>}</div>
  <div className="dropdown-wrap">
  <button className="filter-button" onClick={() => setOpen(open === 'price' ? null : 'price')}>Price <ChevronDown size={19}/>
  </button>{open === 'price' && <div className="filter-menu">{['P', 'PP', 'PPP'].map(v => <button key={v} onClick={() => {
    toggle('priceRanges', v);
    setOpen(null);
  }}>{v.replaceAll('P', '₱')}</button>)}</div>}</div>
  <span className="filter-divider"/>{tags.map(tag => <Chip key={tag} selected={filters.tags.includes(tag)} onClick={() => toggle('tags', tag)}>{tag}</Chip>)}<button className="clear-filter" onClick={clear}>Clear</button>
</div>;
}
