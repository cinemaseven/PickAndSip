import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getProfile, updateProfile } from '../api';
import Avatar from '../components/atoms/Avatar';
import Buttons from '../components/atoms/Buttons';
import ProgressBar from '../components/atoms/ProgressBar';
import LevelLadder from '../components/molecules/LevelLadder';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    getProfile().then(p => {
      setProfile(p);
      setUsername(p.username);
    }).catch(e => setError(e.message));
  }, []);
  async function save() {
    try {
      const p = await updateProfile({ username });
      setProfile(x => ({ ...x, ...p }));
      setEditing(false);
    }
    catch (e) {
      setError(e.message);
    }
  }
  if (error)
    return <div className="page-container page-state">
  <p className="form-error">{error}</p>
</div>;
  if (!profile)
    return <div className="page-container page-state">Loading profile...</div>;
  const next = profile.level.next;
  const prev = profile.level.previous;
  const progress = next ? ((profile.visitedCount - prev) / (next - prev)) * 100 : 100;
  return <div className="page-container profile-page">
  <h1>Profile</h1>
  <div className="profile-grid">
  <section className="profile-card">
      <Avatar letter={profile.username[0]?.toUpperCase() || 'E'}/>
      <span className="profile-label">Username</span>{editing ? <input className="profile-input" value={username} onChange={e => setUsername(e.target.value)} maxLength={50}/> : <h2>{profile.username}</h2>}{editing ? <div className="profile-edit-actions">
          <Buttons variant="outline" onClick={() => {
    setEditing(false);
    setUsername(profile.username);
  }}>Cancel</Buttons>
          <Buttons onClick={save}>Save</Buttons>
    </div> : <Buttons variant="accent" onClick={() => setEditing(true)}>Edit username</Buttons>}</section>
      <section className="level-card">
    <div className="level-card-top">
          <div className="level-title">
      <Trophy size={20}/> Café Explorer Level</div>
          <span>{profile.visitedCount} cafés visited</span>
    </div>
    <h2>Level {profile.level.number} – {profile.level.name}</h2>
    <ProgressBar value={progress}/>
    <small className="progress-caption">{next ? `${Math.max(0, next - profile.visitedCount)} more cafés to reach Level ${profile.level.number + 1}!` : 'Highest level reached!'}</small>
    <LevelLadder current={profile.level.number}/>
      </section>
  </div>
  </div>;
}
