export default function IconButton({ label, children, className='', ...props }) {
    return <button type="button" aria-label={label} title={label} className={`icon-button ${className}`} {...props}>{children}</button>
}
