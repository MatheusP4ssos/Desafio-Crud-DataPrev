export default function Operations({ icon = "", color = "", text = "", onClick }) {
  const base = "inline-flex items-center gap-2 rounded-md";
  return (
    <div>
      <button className={`${base} ${color}`} type="button" onClick={onClick}>
        {icon ? <i className={icon} aria-hidden="true" /> : null}
        <span>{text}</span>
      </button>
    </div>
  );
}
