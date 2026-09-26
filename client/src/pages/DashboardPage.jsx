import { useEffect, useState } from 'react';
import { CalendarDays, Dice5, Star, Coffee } from 'lucide-react';
import { getDashboard } from '../api';
import LevelBadge from '../components/molecules/LevelBadge';
import CafeCard from '../components/molecules/CafeCard';
import Buttons from '../components/atoms/Buttons';
import { useNavigate } from 'react-router';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    getDashboard().then(setData).catch(e => setError(e.message));
  }, []);
  if (error)
    return <PageState message={error}/>;
  if (!data)
    return <PageState message="Loading your cafés..." loading/>;
  return <div className="page-container dashboard-page">
  <section className="welcome-section">
  <h1>Welcome back, {data.profile.username}!</h1>
  <LevelBadge level={data.level}/>
  </section>
  <section className="summary-grid">
  <article className="summary-card">
      <p className="card-label">Most visited café</p>
      <div className="summary-cafe">
    <div className="summary-image">
          <Coffee size={64}/>
    </div>
    <div>
          <h2>{data.mostVisited?.name || 'No cafés yet'}</h2>
          <div className="summary-meta">
      <span>
              <CalendarDays size={15}/> {data.mostVisited?.visitsCount || 0} visits</span>
      <span>
              <Star size={17} fill="currentColor"/> {Number(data.mostVisited?.rating || 0).toFixed(1)} overall</span>
          </div>
    </div>
      </div>
  </article>
  <article className="summary-card">
      <p className="card-label">Most ordered drink</p>
      <div className="drink-summary">
    <div className="drink-icon">
          <Coffee size={34}/>
    </div>
    <h2>{data.mostOrderedDrink.name}</h2>
      </div>
      <p className="ordered-count">Ordered {data.mostOrderedDrink.count} times</p>
  </article>
  <article className="summary-card quick-card">
      <p className="card-label">Quick action</p>
      <Buttons variant="accent" className="choose-large" onClick={() => navigate('/cafes?choose=true')}>
    <Dice5 size={27}/>Choose for me</Buttons>
      <p>Don’t know where to go?<br />Let <strong>Pick &amp; Sip</strong> choose one for you!</p>
  </article>
  </section>
  <section className="recent-section">
  <div className="section-heading">
      <h2>Recent cafés</h2>
      <button onClick={() => navigate('/cafes')}>View all</button>
  </div>
  <div className="recent-grid">{data.recentCafes.map(c => <CafeCard key={c.id} cafe={c} recent onClick={() => navigate(`/cafes/${c.id}`)}/>)}</div>
  </section>
  </div>;
}
function PageState({ message, loading }) {
  return <div className="page-container page-state">
  <p className={loading ? '' : 'form-error'}>{message}</p>
  </div>;
}
