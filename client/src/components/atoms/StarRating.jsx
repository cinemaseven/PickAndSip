import { Star } from 'lucide-react'

export default function StarRating({ value=0, onChange, size=18, label=true }) {
    const interactive = typeof onChange === 'function'
    return (
        <div className={`stars ${interactive ? 'stars-interactive' : ''}`} aria-label={label ? `${value} out of 5 stars` : undefined}>
        {[1,2,3,4,5].map(n => interactive ? (
            <button key={n} type="button" aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)}>
            <Star size={size} fill={n <= value ? 'currentColor' : 'none'} />
            </button>
        ) : (
            <Star key={n} size={size} fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
        ))}
        </div>
    )
}
