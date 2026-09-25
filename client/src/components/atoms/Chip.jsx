export default function Chip({ children, selected=false, onClick, className='', ...props }) {
    const Tag = onClick ? 'button' : 'span'
    return <Tag type={onClick ? 'button' : undefined} className={`chip ${selected ? 'is-selected' : ''} ${className}`} onClick={onClick} {...props}>{children}</Tag>
}
