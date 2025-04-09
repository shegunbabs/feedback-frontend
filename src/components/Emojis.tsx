function Emojis() {
    const emojis = [
        '&#x1F622;',
        '&#x1F625;',
        '&#x1F610;',
        '&#x1F600;',
        '&#x1F602;',
    ];

    return (
        <div>
            {
                emojis.map((emoji, index) => (
                    <h3 key={index} className="inline text-xl cursor-pointer" dangerouslySetInnerHTML={{ __html: emoji }} />
                ))
            }
        </div>
    )
}

export default Emojis;