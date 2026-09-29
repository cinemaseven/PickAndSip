import { Coffee, MapPin, Star } from 'lucide-react';

export default function CafeCard({ cafe, onClick, recent = false, compact = false }) {
    const visits = cafe.visitsCount ?? cafe.visits?.length ?? 0;
    const priceRange =
        cafe.priceRange === 'P'
            ? '₱100-₱200'
            : cafe.priceRange === 'PP'
                ? '₱200-₱300'
                : cafe.priceRange === 'PPP'
                    ? '₱300+'
                    : cafe.priceRange;

    return (
        <article className={`cafe-card ${recent ? 'cafe-card-recent' : ''} ${compact ? 'cafe-card-compact' : ''}`}
            onClick={onClick} onKeyDown={e => e.key === 'Enter' && onClick?.()}
            role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
            
            <div className="cafe-image">
                <Coffee size={56} strokeWidth={1.5} />
            </div>

            <div className="cafe-card-body">
                <h3>{cafe.name}</h3>

                <p className="location">
                    <MapPin size={15} /> {cafe.location}
                </p>

                {!recent && (
                    <div className="cafe-main-meta">
                        <span className="rating">
                            <Star size={17} fill="currentColor" />{' '}
                            {Number(cafe.rating).toFixed(1)}
                        </span>

                        <strong>{priceRange}</strong>
                    </div>
                )}

                {recent && (
                    <div className="recent-meta">
                        <span>{cafe.date}</span>

                        <span className="rating">
                            <Star size={17} fill="currentColor" />{' '}
                            {Number(cafe.rating).toFixed(1)}
                        </span>
                    </div>
                )}

                {!recent && (
                    <div className="cafe-tags-row">
                        <div className="tags">
                            {(cafe.tags || []).map(tag => (
                                <span className="tag" key={tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <span className="visits-count">
                            {visits} visits
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
}