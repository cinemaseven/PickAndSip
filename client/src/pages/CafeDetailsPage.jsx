import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, MapPin, PlusCircle, Pencil, Trash2, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { getCafe, updateCafeNotes, deleteCafeNotes } from '../api';
import Buttons from '../components/atoms/Buttons';
import StarRating from '../components/atoms/StarRating';
import StatCard from '../components/molecules/StatCard';

export default function CafeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  useEffect(() => {
    getCafe(id).then(c => {
      setCafe(c);
      setNoteValue(c.notes?.[0] || '');
    }).catch(e => setError(e.message));
  }, [id]);
  async function saveNote() {
    try {
      await updateCafeNotes(id, 0, noteValue);
      setCafe(c => ({ ...c, notes: [noteValue] }));
      setEditing(false);
    }
    catch (e) {
      setError(e.message);
    }
  }
  async function removeNote() {
    if (!window.confirm('Delete this note?'))
      return;
    try {
      await deleteCafeNotes(id, 0);
      setCafe(c => ({ ...c, notes: [] }));
      setNoteValue('');
    }
    catch (e) {
      setError(e.message);
    }
  }
  if (error)
    return <div className="page-container page-state">
  <p className="form-error">{error}</p>
</div>;
  if (!cafe)
    return <div className="page-container page-state">Loading café...</div>;
  const totalVisits = cafe.visits.length;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.location)}`;
  return <div className="page-container details-page">
  <button className="back-link" onClick={() => navigate('/cafes')}>
  <ArrowLeft size={28}/>Back to My Cafés</button>
  <section className="cafe-hero">
  <div className="details-image">
      <span>☕</span>
  </div>
  <div className="details-info">
      <h1>{cafe.name}</h1>
      <div className="details-location">
    <span>
          <MapPin size={18}/> {cafe.location}</span>
    <a href={maps} target="_blank" rel="noreferrer">View on Google Maps <ExternalLink size={15}/>
    </a>
      </div>
      <div className="tags">{cafe.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
  </div>
  <Buttons variant="accent" onClick={() => navigate(`/add?cafe=${cafe.id}`)}>
      <PlusCircle size={18}/>Add visit</Buttons>
  </section>
  <section className="stats-grid">
  <StatCard label="Overall rating">
      <strong className="stat-big rating">
    <StarRating size={36} fill="currentColor"/>{Number(cafe.rating).toFixed(1)}</strong>
  </StatCard>
  <StatCard label="Price range">
      <strong className="stat-big price-big">{cafe.priceRange.replaceAll('P', '₱')}</strong>
  </StatCard>
  <StatCard label="Total visits">
      <strong className="stat-big">{totalVisits}</strong>
  </StatCard>
  </section>
  <section className="history-notes">
  <div className="visit-history">
      <div className="section-mini-title">
    <h2>Visit History</h2>
    <span>Newest first</span>
      </div>{cafe.visits.slice(0, 3).map(v => <div className="visit-row" key={v.id}>
    <time>
          <strong>{new Date(v.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
          <small>{new Date(v.date + 'T00:00:00').getFullYear()}</small>
    </time>
    <div className="orders-summary">{v.orders.map(o => <div key={o.id}>
      <span>{o.item}</span>
      <span>₱{Number(o.price).toFixed(0)}</span>
      <span className="rating">
              <StarRating size={15} fill="currentColor"/>{Number(o.rating).toFixed(1)}</span>
          </div>)}</div>
      </div>)}{cafe.visits.length > 3 && <button className="older-link">Show {cafe.visits.length - 3} older visits</button>}</div>
  <div className="notes-panel">
      <div className="section-mini-title">
    <h2>Notes</h2>
    <div className="note-actions">
          <button onClick={() => setEditing(true)}>
      <Pencil size={13}/>Edit</button>
          <button onClick={removeNote}>
      <Trash2 size={13}/>Delete</button>
    </div>
      </div>{editing ? <>
    <textarea value={noteValue} onChange={e => setNoteValue(e.target.value)} maxLength={500}/>
          <div className="note-edit-actions">
      <Buttons variant="outline" onClick={() => {
    setEditing(false);
    setNoteValue(cafe.notes?.[0] || '');
  }}>Cancel</Buttons>
      <Buttons onClick={saveNote}>Save</Buttons>
          </div>
    </> : cafe.notes.length ? cafe.notes.map((n, i) => <div className="note-box" key={i}>{n}</div>) : <div className="note-box muted">No notes yet.</div>}</div>
  </section>
  </div>;
}
