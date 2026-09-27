const values = [
    { value: 'P', label: '₱100–₱200' },
    { value: 'PP', label: '₱200–₱300' },
    { value: 'PPP', label: '₱300+' }
]

export default function PriceLevel({ value, onChange }) {
    return (
    <div className="price-levels">
        {values.map(({ value: optionValue, label }) => (
        <button key={optionValue}
            type="button"
            className={value === optionValue ? 'selected' : ''}
            onClick={() => onChange?.(optionValue)}>
            {label}
        </button>
        ))}
    </div>
    )
}