export default function Button({ children, onClick, variant = 'primary' }) {
    const base = 'px-4 py-2 rounded font-medium transition-colors';
    const styles = variant === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
    return <button onClick={onClick} className={${base} }>{children}</button>;
}
