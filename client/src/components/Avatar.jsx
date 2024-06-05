import PropTypes from 'prop-types';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-gray-200',
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200"
]

const randomNumber = Math.floor(Math.random() * bgColor.length)

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser)

    let avatarName = ""

    if (name) {
        const splitName = name?.split(" ")

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const isOnline = onlineUser.includes(userId)

    return (
        <div className={`text-slate-800 rounded-full font-bold relative`} style={{ width: width + "px", height: height + "px" }}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    name ? (
                        <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                            {avatarName}
                        </div>
                    ) : (
                        <PiUserCircle
                            size={width}
                        />
                    )
                )
            }

            {
                isOnline && userId && (
                    <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
                )
            }

            {
                !isOnline && userId && (
                    <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
                )
            }

        </div>
    )
}

Avatar.propTypes = {
    userId: PropTypes.string,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number
};

Avatar.defaultProps = {
    name: '',
    imageUrl: '',
    width: 50,
    height: 50
};

export default Avatar;