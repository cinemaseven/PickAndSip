import { Trophy } from 'lucide-react'
export default function LevelBadge ({ level }) { 
    return (
        <div className="level-badge">
            <Trophy size={19} /> Level {level.number} – {level.name}
        </div> 
    );
}
