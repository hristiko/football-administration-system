function Message({ type, text }) {

    if (!text) return null;
    
    const bg = type === 'error' ? '#ffcccc' : '#ccffcc';
    const color = type === 'error' ? '#b30000' : '#006600';
    
    return (
        <div style={{
            background: bg,
            color,
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '6px'
        }}>
            {text}
        </div>
    );

}

export default Message;