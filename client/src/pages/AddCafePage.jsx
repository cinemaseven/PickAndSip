import { useEffect, useState } from 'react';
import { CalendarDays, Check, Coffee, Plus, Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCafe, addVisit, listCafes } from '../api';
import Buttons from '../components/atoms/Buttons';
import PriceLevel from '../components/atoms/PriceLevel';
import StarRating from '../components/atoms/StarRating';
import Chip from '../components/atoms/Chip';
import SearchBar from '../components/molecules/SearchBar';
import OrderRow from '../components/molecules/OrderRow';

const emptyOrder = () => ({ item: '', price: '', rating: 0 });

const getCurrentDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 10);
};

export default function AddCafePage() {
  const params = new URLSearchParams(useLocation().search);
  const initialMode = params.get('cafe') ? 'visit' : 'new';
  const [mode, setMode] = useState(initialMode);
  const [cafes, setCafes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    latitude: null,
    longitude: null,
    priceRange: 'P',
    rating: 0,
    tags: [],
    notes: '',
    date: getCurrentDate(),
    orders: [emptyOrder()],
    visitNotes: ''
  });
  const [saving, setSaving] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    listCafes().then(rows => {
      setCafes(rows);

      setSelected(null);
    }).catch(e => setError(e.message));
  }, []);

  const filtered = cafes.filter(c => `${c.name} ${c.location}`.toLowerCase().includes(query.toLowerCase()));

  function addCustomTag() {
    const tag = customTag.trim();

    if (!tag) {
      return;
    }

    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags : [...f.tags, tag]
    }));
    setCustomTag('');
  }

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
        const cafe = await createCafe({ 
          name: form.name, 
          location: form.location, 
          latitude: form.latitude, 
          longitude: form.longitude, 
          priceRange: form.priceRange,
          rating: form.rating, 
          tags: form.tags, 
          notes: form.notes, 
          visit: { 
            date: form.date, 
            notes: form.visitNotes, 
            orders: form.orders 
          } 
        });
        navigate(`/cafes/${cafe.id}`);
      }
      else {
        if (!selected)
          throw new Error('Select a café first');

        await addVisit(selected.id, { 
          date: form.date, 
          notes: form.visitNotes, 
          orders: form.orders 
        });
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

  return (
    <div className="page-container add-page">
      <div className="add-title-row">
        <div>
          <h1>{mode === 'new' ? 'Add New Café' : 'Add a Visit'}</h1>
          <p>{mode === 'new' ? 'Fill in the form, then log in your first visit' : 'Record a new visit to a café you’ve already saved'}</p>
        </div>

        <div className="mode-toggle">
          <button className={mode === 'new' ? 'active' : ''} onClick={() => setMode('new')}>Add New Café</button>
          <button className={mode === 'visit' ? 'active' : ''} onClick={() => setMode('visit')}>Add a Visit</button>
        </div>
      </div>

      {mode === 'new' ? (
        <NewCafeForm
          onSubmit={submit}
          form={form}
          setForm={setForm}
          query={query}
          setQuery={setQuery}
          selected={selected}
          setSelected={setSelected}
          filtered={filtered}
          toggleTag={toggleTag}
          customTag={customTag}
          setCustomTag={setCustomTag}
          addCustomTag={addCustomTag}
          updateOrder={updateOrder}
          removeOrder={removeOrder}
          addOrder={addOrder}
        />
      ) : (
        <VisitForm 
          onSubmit={submit} 
          cafes={filtered} 
          selected={selected} 
          setSelected={setSelected} 
          query={query} 
          setQuery={setQuery} 
          form={form} 
          setForm={setForm} 
          updateOrder={updateOrder} 
          removeOrder={removeOrder} 
          addOrder={addOrder} />
      )}

      {error && <p className="form-error page-error">{error}</p>}

      <div className="form-actions">
        <Buttons variant="outline" onClick={() => navigate(-1)}>Cancel</Buttons>
        <Buttons type="submit" form="add-form" disabled={saving}>{saving ? 'Saving...' : mode === 'new' ? 'Save Café & Visit' : 'Save Visit'}</Buttons>
      </div>
    </div>
  );
}

function MapSearchController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.flyTo(position, 17, {
      duration: 1.2
    });
  }, [map, position]);

  return null;
}

function MapLocationMarker({ selectedPosition, setForm }) {
  useMapEvents({
    click(event) {
      setForm(current => ({
        ...current,
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      }));
    }
  });

  if (!selectedPosition) {
    return null;
  }

  return (
    <CircleMarker
      center={selectedPosition}
      radius={9}
      pathOptions={{
        color: '#33231A',
        fillColor: '#C68B45',
        fillOpacity: 1
      }}
    />
  );
}

function CafePicker({ query, setQuery, form, setForm }) {
  const defaultCenter = [15.145, 120.5887];

  const selectedPosition =
    form.latitude != null && form.longitude != null
      ? [form.latitude, form.longitude]
      : null;

  async function searchLocation() {
    const searchText = query.trim();

    if (!searchText) {
      return;
    }

    try {
      const locationText = form.location.trim();

      const searchQuery = locationText
        ? `${searchText}, ${locationText}`
        : `${searchText}, Pampanga, Philippines`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Unable to search for the café location.');
      }

      const results = await response.json();

      if (!results.length) {
        return;
      }

      const latitude = Number(results[0].lat);
      const longitude = Number(results[0].lon);

      setForm(current => ({
        ...current,
        latitude,
        longitude
      }));
    }
    catch (error) {
      console.error('Location search failed:', error);
    }
  }

  return (
    <section className="find-cafe-panel">
      <h2>Find the Café</h2>

      <SearchBar
        value={query}
        onChange={setQuery}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault();
            searchLocation();
          }
        }}
        placeholder="Café"
      />

      <div className="map-placeholder">
        <MapContainer
          center={selectedPosition || defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="cafe-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapSearchController
            position={selectedPosition}
          />

          <MapLocationMarker
            selectedPosition={selectedPosition}
            setForm={setForm}
          />
        </MapContainer>
      </div>

      <div className="map-location-status">
        {selectedPosition ? (
          <>
            <strong>Location selected</strong>

            <span>
              {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
            </span>
          </>
        ) : (
          <span>
            Search for the café or click the map to choose its location.
          </span>
        )}
      </div>
    </section>
  );
}

function NewCafeForm({onSubmit, form, setForm, query, setQuery, selected, setSelected, filtered, toggleTag, customTag, setCustomTag, addCustomTag, updateOrder, removeOrder, addOrder}) {
  return (
    <form id="add-form" onSubmit={onSubmit} className="new-form-grid">
      <CafePicker query={query} setQuery={setQuery} form={form} setForm={setForm} />

      <section className="form-panel">
        <h2>Café Information</h2>

        <div className="two-fields">
          <label>Café Name<input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </label>

          <label>Branch/Location<input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </label>
        </div>

        <div className="two-fields">
          <label>Price range<PriceLevel value={form.priceRange} onChange={v => setForm(f => ({ ...f, priceRange: v }))} />
          </label>

          <label>Café rating<StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} size={30} label={false} />
          </label>
        </div>

        <label>Tags
          <div className="form-chips">
            {['Study', 'Hangout', 'Aesthetic', 'Quiet', ...form.tags.filter(tag => !['Study', 'Hangout', 'Aesthetic', 'Quiet'].includes(tag))].map(tag => (
              <Chip
                key={tag}
                selected={form.tags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>

          <div className="custom-tag-row">
            <input
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              placeholder="Add a new tag"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <button type="button" onClick={addCustomTag}>
              Add tag
            </button>
          </div>
        </label>

        <label>Notes<textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} maxLength={500} />
        </label>
      </section>

      <VisitFields form={form} setForm={setForm} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder} title="Your Visit" />
    </form>
  );
}

function VisitForm({onSubmit, cafes,selected, setSelected, query, setQuery, form, setForm, updateOrder, removeOrder, addOrder}) {
  return (
    <form id="add-form" onSubmit={onSubmit} className="visit-form-grid">
      <section className="form-panel select-panel">
        <h2>Select café</h2>
        <SearchBar value={query} onChange={setQuery} placeholder="Search saved café..." />

        {query.trim() && (
          <div className="saved-cafe-list">
            {cafes.map(c => (
              <button
                type="button"
                className={selected?.id === c.id ? 'selected' : ''}
                key={c.id}
                onClick={() => setSelected(c)}
              >
                <Coffee size={24} />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.location}</small>
                </span>
                {selected?.id === c.id && <Check size={26} />}
              </button>
            ))}
          </div>
        )}

        {selected && <p>This visit will be saved to {selected.name}</p>}
      </section>

      <VisitFields form={form} setForm={setForm} updateOrder={updateOrder} removeOrder={removeOrder} addOrder={addOrder} title="New Visit" />
    </form>
  );
}

function VisitFields({ form, setForm, updateOrder, removeOrder, addOrder, title }) {
  return (
    <section className="form-panel visit-fields">
      <h2>{title}</h2>

      <label>Visit date
        <div className="date-input">
          <CalendarDays size={21} />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </div>
      </label>

      <div>
        <span className="field-label">Orders</span>

        <div className="orders-list">
          {form.orders.map((o, i) => (
            <OrderRow key={i} order={o} onChange={v => updateOrder(i, v)} onRemove={() => removeOrder(i)} />
          ))}
        </div>

        <button className="add-order" type="button" onClick={addOrder}>
          <Plus size={18} />Add another item
        </button>
      </div>

      <label>Visit notes<textarea value={form.visitNotes} onChange={e => setForm(f => ({ ...f, visitNotes: e.target.value }))} maxLength={500} />
      </label>
    </section>
  );
}