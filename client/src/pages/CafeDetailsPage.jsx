import { useEffect, useState } from 'react';
import { ArrowLeft, Coffee, ExternalLink, MapPin, PlusCircle, Pencil, Trash2, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { getCafe, updateCafeNotes, deleteCafeNotes, updateVisitNote, deleteVisitNote } from '../api';
import Buttons from '../components/atoms/Buttons';
import StarRating from '../components/atoms/StarRating';
import StatCard from '../components/molecules/StatCard';

export default function CafeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteValue, setNoteValue] = useState('');

  useEffect(() => {
    getCafe(id).then(c => {
      setCafe(c);
      setEditingNote(null);
      setNoteValue('');
    }).catch(e => setError(e.message));
  }, [id]);

  function startEditing(note) {
    setEditingNote(note);
    setNoteValue(note.text);
  }

  function cancelEditing() {
    setEditingNote(null);
    setNoteValue('');
  }

  async function saveNote() {
    if (!editingNote) return;

    try {
      if (editingNote.type === 'cafe') {
        const notes = await updateCafeNotes(id, editingNote.index, noteValue);
        setCafe(c => ({ ...c, notes }));
      } else {
        const visit = await updateVisitNote(id, editingNote.id, noteValue);
        setCafe(c => ({
          ...c,
          visits: c.visits.map(v => v.id === editingNote.id ? { ...v, notes: visit.notes } : v)
        }));
      }
      cancelEditing();
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeNote(note) {
    if (!window.confirm('Delete this note?')) return;

    try {
      if (note.type === 'cafe') {
        await deleteCafeNotes(id, note.index);
        setCafe(c => ({ ...c, notes: c.notes.filter((_, i) => i !== note.index) }));
      } else {
        await deleteVisitNote(id, note.id);
        setCafe(c => ({
          ...c,
          visits: c.visits.map(v => v.id === note.id ? { ...v, notes: '' } : v)
        }));
      }

      if (editingNote?.type === note.type && editingNote?.id === note.id && editingNote?.index === note.index) {
        cancelEditing();
      }
    } catch (e) {
      setError(e.message);
    }
  }

  if (error)
    return (
      <div className="page-container page-state">
        <p className="form-error">{error}</p>
      </div>
    );

  if (!cafe)
    return <div className="page-container page-state">Loading café...</div>;

  const totalVisits = cafe.visits.length;
  const maps =
    cafe.latitude != null && cafe.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name + ' ' + cafe.location)}`;

  return (
    <div className="page-container details-page">
      <button className="back-link" onClick={() => navigate('/cafes')}>
        <ArrowLeft size={28} />Back to My Cafés
      </button>

      <section className="cafe-hero">
        <div className="details-image">
          <Coffee size={56} strokeWidth={1.5} />
        </div>

        <div className="details-info">
          <h1>{cafe.name}</h1>

          <div className="details-location">
            <span>
              <MapPin size={18} /> {cafe.location}
            </span>

            <a href={maps} target="_blank" rel="noreferrer">
              View on Google Maps <ExternalLink size={15} />
            </a>
          </div>

          <div className="tags">
            {cafe.tags.map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <Buttons variant="accent" onClick={() => navigate(`/add?cafe=${cafe.id}`)}>
          <PlusCircle size={18} />
          Add visit
        </Buttons>
      </section>

      <section className="stats-grid">
        <StatCard label="Overall rating">
          <strong className="stat-big rating">
            <StarRating size={36} fill="currentColor" />{Number(cafe.rating).toFixed(1)}
          </strong>
        </StatCard>

        <StatCard label="Price range">
          <strong className="stat-big price-big">
            {cafe.priceRange === 'P'
              ? '₱100-₱200'
              : cafe.priceRange === 'PP'
                ? '₱200-₱300'
                : cafe.priceRange === 'PPP'
                  ? '₱300+'
                  : cafe.priceRange}
          </strong>
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
          </div>

          {cafe.visits.slice(0, 3).map(v => (
            <div className="visit-row" key={v.id}>
              <time>
                <strong>{new Date(v.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                <small>{new Date(v.date + 'T00:00:00').getFullYear()}</small>
              </time>

              <div className="orders-summary">
                {v.orders.map(o => (
                  <div key={o.id}>
                    <span>{o.item}</span>
                    <span>₱{Number(o.price).toFixed(0)}</span>
                    <span className="rating">
                      <Star size={15} fill="currentColor" />{Number(o.rating).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {cafe.visits.length > 3 && (
            <button className="older-link">
              Show {cafe.visits.length - 3} older visits
            </button>
          )}
        </div>

        <div className="notes-panel">
          <div className="section-mini-title">
            <h2>Notes</h2>
            <span>Newest first</span>
          </div>

          {(() => {
            const notes = [
              ...cafe.notes.map((text, index) => ({
                type: 'cafe',
                index,
                text,
                date: cafe.visits.length
                      ? [...cafe.visits].sort((a, b) => new Date(a.date) - new Date(b.date))[0].date
                      : null
              })),
              ...cafe.visits
                .filter(v => v.notes?.trim())
                .map(v => ({
                  type: 'visit',
                  id: v.id,
                  text: v.notes,
                  date: v.date
                }))
            ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

            if (!notes.length) {
              return <div className="note-box muted">No notes yet.</div>;
            }

            return notes.map(note => {
              const isEditing = editingNote && editingNote.type === note.type &&
                (note.type === 'cafe' ? editingNote.index === note.index : editingNote.id === note.id);

              return (
                <div className="note-box" key={`${note.type}-${note.type === 'cafe' ? note.index : note.id}`}>
                  {isEditing ? (
                    <>
                      <textarea
                        value={noteValue}
                        onChange={e => setNoteValue(e.target.value)}
                        maxLength={500}
                      />

                      <div className="note-edit-actions">
                        <Buttons variant="outline" onClick={cancelEditing}>Cancel</Buttons>
                        <Buttons onClick={saveNote}>Save</Buttons>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="note-header">
                        <time>
                          {new Date(note.date + (note.date?.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>

                        <div className="note-actions">
                          <button onClick={() => startEditing(note)}>
                            <Pencil size={13} />Edit
                          </button>
                          <button onClick={() => removeNote(note)}>
                            <Trash2 size={13} />Delete
                          </button>
                        </div>
                      </div>

                      <div className="note-text">{note.text}</div>
                    </>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </section>
    </div>
  );
}