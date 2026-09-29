export default function Card({ title, icon: IconCmp, color = "blue", right, className = "", children }) {
  return (
    <section className={`card ${className}`}>
      <header className="card-h">
        {IconCmp && (
          <span className={`ic ${color}`}>
            <IconCmp width={14} height={14} />
          </span>
        )}
        <span>{title}</span>
        {right && <span className="right">{right}</span>}
      </header>
      {children}
    </section>
  );
}
