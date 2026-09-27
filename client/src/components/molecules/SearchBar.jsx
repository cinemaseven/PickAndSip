import { Search } from 'lucide-react';

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search',
    onKeyDown
    }) {
    return (
        <label className="search-bar">
        <Search size={20} />

        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
        />
        </label>
    );
}