import { useState } from 'react';
import { Dice5, X, MapPin, Star } from 'lucide-react';
import Buttons from '../atoms/Buttons';
import Chip from '../atoms/Chip';
import CafeCard from '../molecules/CafeCard';
import { pickCafe } from '../../api';

const ratings = [{ label: 'Any', value: null }, { label: '2+', value: 2 }, { label: '3.5+', value: 3.5 }, { label: '4.5+', value: 4.5 }];
const tags = ['Study', 'Hangout', 'Aesthetic', 'Quiet'];
export default function ChooseForMeModal({ onClose }) {
  const [filters, setFilters] = useState({ minRating: null, priceRanges: [], tags: [] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function choose() {
    setLoading(true);
    setError('');
    try {
      setResult(await pickCafe(filters));
    }
    catch (e) {
      setError(e.message);
    }
    finally {
      setLoading(false);
    }
  }
  function togglePrice(v) {
    setFilters(f => ({ ...f, priceRanges: f.priceRanges.includes(v) ? f.priceRanges.filter(x => x !== v) : [...f.priceRanges, v] }));
  }
  function toggleTag(v) {
    setFilters(f => ({ ...f, tags: f.tags.includes(v) ? f.tags.filter(x => x !== v) : [...f.tags, v] }));
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
  <section className={`picker-modal ${result ? 'picker-result' : ''}`} role="dialog" aria-modal="true" aria-labelledby="picker-title">
    {!result ? <>
      <button className="modal-close" aria-label="Close" onClick={onClose}>
    <X size={34}/>
      </button>
      <h2 id="picker-title">Choose for Me</h2>
      <p className="modal-subtitle">Choose your preferences and let it choose for you!</p>
      <div className="picker-section">
    <h3>Minimum rating</h3>
    <div className="segmented rating-segment">{ratings.map(r => <button key={r.label} className={filters.minRating === r.value ? 'selected' : ''} onClick={() => setFilters(f => ({ ...f, minRating: r.value }))}>{r.label}</button>)}</div>
      </div>
      <div className="picker-section">
    <h3>Price range</h3>
    <div className="picker-price">{['P', 'PP', 'PPP'].map(v => <Chip key={v} selected={filters.priceRanges.includes(v)} onClick={() => togglePrice(v)}>{v.replaceAll('P', '₱')}</Chip>)}</div>
      </div>
      <div className="picker-section">
    <h3>Tags</h3>
    <div className="picker-tags">{tags.map(v => <Chip key={v} selected={filters.tags.includes(v)} onClick={() => toggleTag(v)}>{v}</Chip>)}</div>
      </div>
    {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-actions">
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button variant="accent" onClick={choose} disabled={loading}>
          <Dice5 size={21}/>{loading ? 'Choosing...' : 'Choose a café'}</Button>
      </div>
  </> : <>
      <h2 id="picker-title">Your pick!</h2>
      <div className="result-card">
    <CafeCard cafe={result} compact/>
    <div className="result-actions">
          <Button onClick={() => {
      setResult(null);
    }}>View Café</Button>
          <Button variant="outline" onClick={choose}>
      <Dice5 size={20}/> Pick again</Button>
    </div>
      </div>
  </>}
  </section>
</div>;
}
