import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Coffee, MapPin, Plus, Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { createCafe, addVisit, listCafes } from '../api';
import Buttons from '../components/atoms/Buttons';
import PriceLevel from '../components/atoms/PriceLevel';
import StarRating from '../components/atoms/StarRating';
import Chip from '../components/atoms/Chip';
import SearchBar from '../components/molecules/SearchBar';
import OrderRow from '../components/molecules/OrderRow';

const emptyOrder = () => ({ item: '', price: '', rating: 3 });
export default function AddCafePage() {
  const params = new URLSearchParams(useLocation().search);
  const initialMode = params.get('cafe') ? 'visit' : 'new';
  const [mode, setMode] = useState(initialMode);
  const [cafes, setCafes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ name: '', location: '', priceRange: 'PP', rating: 4, tags: ['Study', 'Quiet'], notes: '', date: new Date().toISOString().slice(0, 10), orders: [emptyOrder()], visitNotes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    listCafes().then(rows => {
      setCafes(rows);
      if (params.get('cafe'))
        setSelected(rows.find(c => String(c.id) === params.get('cafe')) || null);
    }).catch(e => setError(e.message));
  }, []);
  const filtered = cafes.filter(c => `${c.name} ${c.location}`.toLowerCase().includes(query.toLowerCase()));
  function toggleTag(t) {
    setForm(f => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t] }));
  }
  function updateOrder(i, o) {
    setForm(f => ({ ...f, orders: f.orders.map((x, n) => n === i ? o : x) }));
  }
  function removeOrder(i) {
    setForm(f => ({ ...f, orders: f.orders.filter((_, n) => n !== i) }));
  }
  function addOrder() {
    setForm(f => ({ ...f, orders: [...f.orders, emptyOrder()] }));
  }
  async function submit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (mode === 'new') {
        const cafe = await createCafe({ name: form.name, location: form.location, priceRange: form.priceRange, rating: form.rating, tags: form.tags, notes: form.notes, visit: { date: form.date, notes: form.visitNotes, orders: form.orders } });
        navigate(`/cafes/${cafe.id}`);
      }
      else {
        if (!selected)
          throw new Error('Select a café first');
        await addVisit(selected.id, { date: form.date, notes: form.visitNotes, orders: form.orders });
        navigate(`/cafes/${selected.id}`);
      }
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setSaving(false);
    }
  }
  return <div className="page-container add-page">
  <div className="add-title-row">
  <div>
      <h1>{mode === 'new' ? 'Add New Café' : 'Add a Visit'}</h1>
      <p>{mode === 'new' ? 'Fill in the form, then log in your first visit' : 'Record a new visit to a café you’ve already saved'}</p>
  </div>
  <div className="mode-toggle">
      <button className={mode === 'new' ? 'active' : ''} onClick={() => setMode('new')}>Add New Café</button>
      <button className={mode === 'visit' ? 'active' : ''} onClick={() => setMode('visit')}>Add a Visit</button>
  </div>
  </div>{mode === 'new' ? <NewCafeForm onSubmit={submit} form={form} setForm={setForm} query={query} setQuery={setQuery} selected={selected} setSelected={setSelected} filtered={filtered} toggleTag={toggleTag} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder}/> : <VisitForm onSubmit={submit} cafes={filtered} selected={selected} setSelected={setSelected} query={query} setQuery={setQuery} form={form} setForm={setForm} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder}/>} {error && <p className="form-error page-error">{error}</p>}<div className="form-actions">
  <Buttons variant="outline" onClick={() => navigate(-1)}>Cancel</Buttons>
  <Buttons type="submit" form="add-form" disabled={saving}>{saving ? 'Saving...' : mode === 'new' ? 'Save Café & Visit' : 'Save Visit'}</Buttons>
  </div>
</div>;
}
function CafePicker({ query, setQuery, filtered, selected, setSelected }) {
  return <section className="find-cafe-panel">
  <h2>{'Find the Café'}</h2>
  <SearchBar value={query} onChange={setQuery} placeholder="Café"/>
  <div className="cafe-select-list">{filtered.slice(0, 5).map(c => <button type="button" key={c.id} className={selected?.id === c.id ? 'selected' : ''} onClick={() => setSelected(c)}>
      <MapPin size={20}/>
      <span>
    <strong>{c.name}</strong>
    <small>{c.location}</small>
      </span>{selected?.id === c.id && <Check size={22}/>}</button>)}</div>
  <div className="map-placeholder">Map</div>
  <a className="map-link" href="https://www.google.com/maps" target="_blank" rel="noreferrer">View on Google Maps ↗</a>
</section>;
}
function NewCafeForm({ onSubmit, form, setForm, query, setQuery, selected, setSelected, filtered, toggleTag, updateOrder, removeOrder, addOrder }) {
  return <form id="add-form" onSubmit={onSubmit} className="new-form-grid">
  <CafePicker query={query} setQuery={setQuery} filtered={filtered} selected={selected} setSelected={setSelected}/>
  <section className="form-panel">
  <h2>Café Information</h2>
  <div className="two-fields">
      <label>Café Name<input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
    </label>
    <label>Branch/Location<input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}/>
          </label>
    </div>
    <div className="two-fields">
          <label>Price range<PriceLevel value={form.priceRange} onChange={v => setForm(f => ({ ...f, priceRange: v }))}/>
      </label>
      <label>Café rating<StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} size={30} label={false}/>
              </label>
      </div>
      <label>Tags<div className="form-chips">{['Study', 'Hangout', 'Aesthetic', 'Quiet'].map(t => <Chip key={t} selected={form.tags.includes(t)} onClick={() => toggleTag(t)}>{t}</Chip>)}</div>
      </label>
      <label>Notes<textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} maxLength={500}/>
              </label>
      </section>
      <VisitFields form={form} setForm={setForm} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder} title="Your Visit"/>
          </form>;
}
function VisitForm({ onSubmit, cafes, selected, setSelected, query, setQuery, form, setForm, updateOrder, removeOrder, addOrder }) {
  return <form id="add-form" onSubmit={onSubmit} className="visit-form-grid">
      <section className="form-panel select-panel">
              <h2>Select café</h2>
              <SearchBar value={query} onChange={setQuery} placeholder="Search saved café..."/>
              <div className="saved-cafe-list">{cafes.map(c => <button type="button" className={selected?.id === c.id ? 'selected' : ''} key={c.id} onClick={() => setSelected(c)}>
                  <Coffee size={24}/>
                  <span>
          <strong>{c.name}</strong>
          <small>{c.location}</small>
                  </span>{selected?.id === c.id && <Check size={26}/>}</button>)}</div>{selected && <p>This visit will be saved to {selected.name}</p>}</section>
      <VisitFields form={form} setForm={setForm} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder} title="New Visit"/>
          </form>;
}
function VisitFields({ form, setForm, updateOrder, removeOrder, addOrder, title }) {
  return <section className="form-panel visit-fields">
      <h2>{title}</h2>
      <label>Visit date<div className="date-input">
        <CalendarDays size={21}/>
        <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}/>
        </div>
              </label>
              <div>
        <span className="field-label">Orders</span>
        <div className="orders-list">{form.orders.map((o, i) => <OrderRow key={i} order={o} onChange={v => updateOrder(i, v)} onRemove={() => removeOrder(i)}/>)}</div>
                  <button className="add-order" type="button" onClick={addOrder}>
          <Plus size={18}/>Add another item</button>
        </div>
        <label>Visit notes<textarea value={form.visitNotes} onChange={e => setForm(f => ({ ...f, visitNotes: e.target.value }))} maxLength={500}/>
                  </label>
        </section>;
}
