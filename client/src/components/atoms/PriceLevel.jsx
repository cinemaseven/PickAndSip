const values = ['P','PP','PPP']
export default function PriceLevel({ value, onChange }) {
    return <div className="price-levels">{values.map(v => <button key={v} type="button" className={value === v ? 'selected' : ''} onClick={() => onChange?.(v)}>{v.replaceAll('P','₱')}</button>)}</div>
}
