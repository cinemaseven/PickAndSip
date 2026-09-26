export default function StatCard({ label, children }) {
    return (
        <article className="stat-card">
            <p>{label}</p>{children}</article>
    );
}
