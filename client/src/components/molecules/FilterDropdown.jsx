import { ChevronDown } from 'lucide-react';

export default function FilterDropdown({ label, value, options, onChange }) {
    return (
        <label className="filter-dropdown">
        <span>{label}</span>
        <ChevronDown size={20}/>
        <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
        <option value="">Any</option>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </label>
    );
}
