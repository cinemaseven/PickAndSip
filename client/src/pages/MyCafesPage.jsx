import { useEffect, useMemo, useState } from 'react';
import { Dice5 } from 'lucide-react';
import { listCafes } from '../api';
import SearchBar from '../components/molecules/SearchBar';
import FilterBar from '../components/organisms/FilterBar';
import CafeCard from '../components/molecules/CafeCard';
import Buttons from '../components/atoms/Buttons';
import ChooseForMeModal from '../components/organisms/ChooseForMeModal';
import { useLocation, useNavigate } from 'react-router';

export default function MyCafesPage() {
  const [cafes, setCafes] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ minRating: null, priceRanges: [], tags: [] });
  const [chooseOpen, setChooseOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    listCafes().then(setCafes).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (new URLSearchParams(location.search).get('choose') === 'true')
      setChooseOpen(true);
  }, [location.search]);
  const visible = useMemo(() => cafes.filter(c => {
    const q = search.trim().toLowerCase();
    if (q && !`${c.name} ${c.location}`.toLowerCase().includes(q))
      return false;
    if (filters.minRating != null && c.rating < Number(filters.minRating))
      return false;
    if (filters.priceRanges.length && !filters.priceRanges.includes(c.priceRange))
      return false;
    if (filters.tags.length && !filters.tags.some(t => c.tags.includes(t)))
      return false;
    return true;
  }), [cafes, search, filters]);
  return <div className="page-container cafes-page">
  <div className="page-title-row">
  <div>
      <h1>My Cafés</h1>
      <p>{cafes.length} cafés saved</p>
  </div>
  <Buttons variant="accent" className="choose-top" onClick={() => setChooseOpen(true)}>
      <Dice5 size={24}/>Choose for me</Buttons>
  </div>
  <SearchBar value={search} onChange={setSearch} placeholder="Search by café name or location"/>
  <FilterBar filters={filters} setFilters={setFilters}/>{error ? <p className="form-error">{error}</p> : loading ? <p className="loading-text">Loading cafés...</p> : visible.length === 0 ? <div className="empty-state">
  <h2>No cafés found</h2>
  <p>No cafés match your search or filters.</p>
  </div> : <div className="cafe-grid">{visible.map(c => <CafeCard key={c.id} cafe={c} onClick={() => navigate(`/cafes/${c.id}`)}/>)}</div>}{chooseOpen && <ChooseForMeModal onClose={() => setChooseOpen(false)}/>}</div>;
}
