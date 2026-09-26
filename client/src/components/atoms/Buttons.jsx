export default function Buttons({ children, variant='primary', type='button', className='', ...props }) {
    return <button type={type} className={`button button-${variant} ${className}`} {...props}>{children}</button>
}
