export default function Avatar({ userId, username, online }) {
    const colors = [
        'bg-gray-200',
        'bg-red-200',
        'bg-orange-200',
        'bg-yellow-200',
        'bg-green-200',
        'bg-teal-200',
        'bg-blue-200',
        'bg-indigo-200',
        'bg-purple-200',
        'bg-pink-200'
    ];

    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={"flex items-center w-8 h-8 relative rounded-full " + color}>
            <div className='text-center w-full opacity-70'>{username[0]}</div>
            {online && (
                <div className='absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-0 border border-white'></div>
            )}

            {!online && (
                <div className='absolute w-3 h-3 bg-gray-400 rounded-full bottom-0 right-0 border border-white'></div>
            )}
        </div>
    );
}