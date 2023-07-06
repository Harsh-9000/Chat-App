import PropTypes from 'prop-types';

export default function Avatar(props) {

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

    const userIdBase10 = parseInt(props.userId, 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={"flex items-center w-8 h-8 relative rounded-full " + color}>
            <div className='text-center w-full opacity-70'>{props.username[0]}</div>
            {props.online && (
                <div className='absolute w-3 h-3 bg-green-400 rounded-full bottom-0 right-0 border border-white'></div>
            )}

            {!props.online && (
                <div className='absolute w-3 h-3 bg-gray-400 rounded-full bottom-0 right-0 border border-white'></div>
            )}
        </div>
    );
}

Avatar.propTypes = {
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
};