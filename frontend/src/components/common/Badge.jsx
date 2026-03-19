export default function Badge({ text, color = 'gray' }) {
    return <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded font-semibold`}>{text}</span>;
}
