const levels = [['Café Starter', '1+ cafés'], ['Café Explorer', '5+ cafés'], ['Café Enthusiast', '10+ cafés'], ['Café Connoisseur', '20+ cafés'], ['Café Hopper', '30+ cafés']];

export default function LevelLadder({ current }) {
    return (
        <div className="level-ladder">
            {levels.map((l, i) => <div className={`level-step ${i + 1 === current ? 'current' : ''} ${i + 1 < current ? 'completed' : ''}`} key={l[0]}>
            <div className="level-dot">
                {i + 1}
            </div>
            <strong>{l[0]}</strong>
            <small>{l[1]}</small>
            </div>)}
        </div>
    );
}
