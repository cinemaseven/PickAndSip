import './styles.css'

const recentCafes = [
  {
    id: 1,
    name: 'Café MMs',
    location: 'Santa Rita, Pampanga',
    date: 'Sep 17',
    rating: '5.0',
  },
  {
    id: 2,
    name: 'Café Athalia',
    location: 'Santa Rita, Pampanga',
    date: 'Sep 17',
    rating: '3.1',
  },
  {
    id: 3,
    name: 'Centro',
    location: 'Santa Rita, Pampanga',
    date: 'Sep 17',
    rating: '4.6',
  },
  {
    id: 4,
    name: 'Myoc',
    location: 'Santa Rita, Pampanga',
    date: 'Sep 17',
    rating: '2.3',
  },
]

// function LogoMark() {
//   return (
//     <div className="logo-mark" aria-hidden="true">
//       <span className="logo-bean" />
//       <span className="logo-dot" />
//     </div>
//   )
// }

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Pick & Sip home">
      {/* <LogoMark /> */}
      <span>Pick &amp; Sip</span>
    </a>
  )
}

function NavBar() {
  return (
    <header className="navbar">
      <Brand />

      <nav className="main-nav" aria-label="Main navigation">
        <a className="nav-link active" href="/">
          Home
        </a>

        <a className="nav-link" href="/cafes">
          My Cafés
        </a>

        <a className="nav-link" href="/add">
          Add Café / Visit
        </a>
      </nav>

      <div className="nav-profile">
        <span className="level-pill">Level 2</span>

        <a className="avatar" href="/profile" aria-label="Open profile">
          E
        </a>
      </div>
    </header>
  )
}

function LevelBadge() {
  return (
    <div className="level-badge">
      Level 2 – Café Explorer
    </div>
  )
}

function StatIcon({ type }) {
  if (type === 'calendar') {
    return (
      <span className="stat-icon" aria-hidden="true">
        ▣
      </span>
    )
  }

  if (type === 'star') {
    return (
      <span className="stat-icon stat-icon-star" aria-hidden="true">
        ★
      </span>
    )
  }

  return (
    <span className="stat-icon dice-icon" aria-hidden="true">
      ⚄
    </span>
  )
}

function MostVisitedCard() {
  return (
    <article className="summary-card most-visited-card">
      <p className="card-label">Most visited café</p>

      <div className="most-visited-content">
        <div className="photo-placeholder" aria-hidden="true" />

        <div>
          <h2>Café MMs</h2>

          <div className="cafe-meta">
            <span>
              <StatIcon type="calendar" />
              10 visits
            </span>

            <span>
              <StatIcon type="star" />
              5.0 overall
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

function MostOrderedCard() {
  return (
    <article className="summary-card most-ordered-card">
      <p className="card-label">Most ordered drink</p>

      <div className="drink-content">
        <div className="drink-placeholder" aria-hidden="true" />

        <div>
          <h2>Iced Seasalt<br />Latte</h2>
        </div>
      </div>

      <p className="ordered-count">Ordered 13 times</p>
    </article>
  )
}

function ChooseForMeCard() {
  return (
    <article className="summary-card quick-action-card">
      <p className="card-label">Quick action</p>

      <button className="choose-button" type="button">
        <span className="choose-icon" aria-hidden="true">
          ⚄
        </span>

        <span>Choose for me</span>
      </button>

      <p className="choose-description">
        Don’t know where to go?
        <br />
        Let <strong>Pick &amp; Sip</strong> choose one for you!
      </p>
    </article>
  )
}

function RecentCafeCard({ cafe }) {
  return (
    <article className="recent-cafe-card">
      <div className="recent-cafe-photo" aria-hidden="true" />

      <div className="recent-cafe-content">
        <h3>{cafe.name}</h3>

        <p className="cafe-location">
          <span aria-hidden="true">♟</span>
          {cafe.location}
        </p>

        <div className="recent-cafe-footer">
          <time>{cafe.date}</time>

          <span className="rating">
            <span aria-hidden="true">★</span>
            {cafe.rating}
          </span>
        </div>
      </div>
    </article>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        {/* <LogoMark /> */}

        <div>
          <p className="footer-name">Pick &amp; Sip</p>
          <p className="footer-tagline">
            “Pick your place. Sip your way.”
          </p>
        </div>
      </div>

      <div className="footer-right">
        <strong>est. 2026</strong>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="app" id="top">
      <NavBar />

      <main className="home">
        <section className="welcome-section">
          <h1>
            Welcome back, [username]!
          </h1>

          <LevelBadge />
        </section>

        <section className="summary-grid" aria-label="Café summary">
          <MostVisitedCard />
          <MostOrderedCard />
          <ChooseForMeCard />
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <h2>Recent cafés</h2>

            <a href="/cafes">View all</a>
          </div>

          <div className="recent-cafe-grid">
            {recentCafes.map((cafe) => (
              <RecentCafeCard
                key={cafe.id}
                cafe={cafe}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


// import { useEffect, useState } from 'react'
// import { listSightings, createSighting, deleteSighting } from './api'
// import DemoNotice from './components/DemoNotice.jsx'

// // A deliberately small working app. Replace all of it with your own project.
// //
// // What is worth keeping is the SHAPE: four states rather than two, a loading
// // message that admits a free-tier server can be slow to wake, and errors that
// // say something rather than rendering an empty list.

// const EMPTY_FORM = { place: '', description: '', spookiness: 3 }

// export default function App() {
//   const [status, setStatus] = useState('loading')   // loading | ready | error
//   const [rows, setRows] = useState([])
//   const [error, setError] = useState(null)
//   const [slow, setSlow] = useState(false)
//   const [form, setForm] = useState(EMPTY_FORM)
//   const [saving, setSaving] = useState(false)

//   async function load() {
//     setStatus('loading')
//     setError(null)

//     // A free-tier API sleeps. If this is taking a while, say so rather than
//     // spinning silently, which looks broken. See page 6.
//     const timer = setTimeout(() => setSlow(true), 3000)

//     try {
//       setRows(await listSightings())
//       setStatus('ready')
//     } catch (caught) {
//       setError(caught)
//       setStatus('error')
//     } finally {
//       clearTimeout(timer)
//       setSlow(false)
//     }
//   }

//   useEffect(() => {
//     load()
//   }, [])

//   async function handleSubmit(event) {
//     event.preventDefault()
//     if (!form.place.trim()) return

//     setSaving(true)
//     try {
//       const created = await createSighting({
//         place: form.place.trim(),
//         description: form.description.trim(),
//         spookiness: Number(form.spookiness),
//       })
//       setRows([created, ...rows])
//       setForm(EMPTY_FORM)
//     } catch (caught) {
//       setError(caught)
//     } finally {
//       setSaving(false)
//     }
//   }

//   async function handleDelete(id) {
//     const previous = rows
//     setRows(rows.filter((row) => row.id !== id))   // optimistic
//     try {
//       await deleteSighting(id)
//     } catch (caught) {
//       setRows(previous)                            // put it back on failure
//       setError(caught)
//     }
//   }

//   return (
//     <div className="page">
//       <header>
//         <h1>HAUnted Sightings</h1>
//         <p className="lede">
//           Replace this with your own project. This one is here so the template
//           has something that works.
//         </p>
//       </header>

//       <DemoNotice />

//       {error && (
//         <p className="error" role="alert">
//           {error.message} <button onClick={load}>Try again</button>
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="card">
//         <h2>Report a sighting</h2>

//         <label htmlFor="place">Place</label>
//         <input
//           id="place"
//           value={form.place}
//           onChange={(event) => setForm({ ...form, place: event.target.value })}
//           maxLength={120}
//           required
//         />

//         <label htmlFor="description">What happened</label>
//         <textarea
//           id="description"
//           value={form.description}
//           onChange={(event) => setForm({ ...form, description: event.target.value })}
//           maxLength={2000}
//           rows={3}
//         />

//         <label htmlFor="spookiness">Spookiness, 1 to 5</label>
//         <input
//           id="spookiness"
//           type="number"
//           min="1"
//           max="5"
//           value={form.spookiness}
//           onChange={(event) => setForm({ ...form, spookiness: event.target.value })}
//           required
//         />

//         <button type="submit" disabled={saving}>
//           {saving ? 'Saving...' : 'Add sighting'}
//         </button>
//       </form>

//       {/* Four states. Empty and error are different things and must not look
//           the same: an empty list means "nothing here yet", an error means
//           "we could not find out". */}
//       {status === 'loading' && (
//         <p className="muted">
//           Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
//         </p>
//       )}

//       {status === 'ready' && rows.length === 0 && (
//         <p className="muted">No sightings reported yet. Add the first one above.</p>
//       )}

//       {status === 'ready' && rows.length > 0 && (
//         <ul className="list">
//           {rows.map((row) => (
//             <li key={row.id} className="card">
//               <div className="row-head">
//                 <h3>{row.place}</h3>
//                 <span className="spooky" aria-label={`Spookiness ${row.spookiness} of 5`}>
//                   {'*'.repeat(row.spookiness)}
//                 </span>
//               </div>
//               {row.description
//                 ? <p>{row.description}</p>
//                 : <p className="muted">No description given.</p>}
//               <footer>
//                 <time dateTime={row.reported_at}>
//                   {new Date(row.reported_at).toLocaleString()}
//                 </time>
//                 <button onClick={() => handleDelete(row.id)}>Delete</button>
//               </footer>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   )
// }
