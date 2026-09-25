export default function Avatar({ letter='E', size='large' }) {
    return <span className={`avatar avatar-${size}`}>{letter}</span>
}
