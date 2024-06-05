import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSocket } from '../contexts/SocketContext.jsx';
import Avatar from "./Avatar.jsx";
import Loading from "./Loading.jsx"
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi"
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5"
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import moment from 'moment'

const MessagePage = () => {
    const params = useParams();
    const socket = useSocket();
    const user = useSelector(state => state.user)
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false
    })

    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
    const [message, setMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    })
    const [loading, setLoading] = useState(false)
    const [allMessage, setAllMessage] = useState([])
    const currentMessage = useRef(null)

    const handleUploadImageVideoOpen = () => {
        setOpenImageVideoUpload(prev => !prev)
    }

    const handleUploadImage = async (event) => {
        setLoading(true)
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post('/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const imageUrl = response.data.url;
                setLoading(false)
                setOpenImageVideoUpload(false)
                setMessage(prev => ({ ...prev, imageUrl }));
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    }

    const handleClearUploadImage = () => {
        setMessage(prev => {
            return {
                ...prev,
                imageUrl: ""
            }
        })
    }

    const handleUploadVideo = async (event) => {
        setLoading(true)
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('video', file);

            try {
                const response = await axios.post('/upload-video', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const videoUrl = response.data.url;
                setLoading(false)
                setOpenImageVideoUpload(false)
                setMessage(prev => ({ ...prev, videoUrl }));
            } catch (error) {
                console.error("Error uploading video:", error);
            }
        }
    }

    const handleClearUploadVideo = () => {
        setMessage(prev => {
            return {
                ...prev,
                videoUrl: ""
            }
        })
    }

    const handleOnChange = (e) => {
        const { value } = e.target
        setMessage(prev => {
            return {
                ...prev,
                text: value
            }
        })
    }

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (message.text || message.imageUrl || message.videoUrl) {
            if (socket) {
                socket.emit('new-message', {
                    sender: user?._id,
                    recipient: params.userId,
                    text: message.text,
                    imageUrl: message.imageUrl,
                    videoUrl: message.videoUrl,
                    senderId: user?._id
                })
                setMessage({
                    text: "",
                    imageUrl: "",
                    videoUrl: ""
                })
            }
        }
    }

    useEffect(() => {
        if (socket) {
            socket.emit('message-page', params.userId);

            socket.emit('seen', params.userId)

            socket.on('message-user', (data) => {
                setUserData(data)
            })

            socket.on('message', (data) => {
                setAllMessage(data)
            })
        }
    }, [socket, params.userId, user]);

    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [allMessage])

    return (
        <div>
            <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
                <div className="flex items-center gap-4" >
                    <Link to={"/"} className="lg:hidden">
                        <FaAngleLeft size={25} />
                    </Link>

                    <div>
                        <Avatar
                            width={50}
                            height={50}
                            imageUrl={userData?.profile_pic}
                            name={userData?.name}
                            userId={userData?._id}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">{userData?.name}</h3>
                        <p className="-my-1 text-sm text-slate-500">
                            {
                                userData.online ? "online" : "offline"
                            }
                        </p>
                    </div>
                </div>

                <div>
                    <button className="cursor-pointer hover:text-green-500">
                        <HiDotsVertical />
                    </button>
                </div>
            </header>

            {/* All Messages */}
            <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar">

                {/* All Text Message */}
                <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {
                        allMessage.map((msg, index) => {
                            return (
                                <div key={index} className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.senderId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                                    <div className='w-full relative'>
                                        {
                                            msg?.imageUrl && (
                                                <img
                                                    src={msg?.imageUrl}
                                                    className='w-full h-full object-scale-down'
                                                />
                                            )
                                        }
                                        {
                                            msg?.videoUrl && (
                                                <video
                                                    src={msg.videoUrl}
                                                    className='w-full h-full object-scale-down'
                                                    controls
                                                />
                                            )
                                        }
                                    </div>
                                    <p className='px-2'>{msg.text}</p>
                                    <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                                </div>
                            )
                        })
                    }
                </div>

                {/* Uploaded Image Display */}
                {
                    message.imageUrl && (
                        <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                                <IoClose size={30} />
                            </div>
                            <div className='bg-white p-3'>
                                <img
                                    src={message.imageUrl}
                                    alt='uploadImage'
                                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                                />
                            </div>
                        </div>
                    )
                }

                {/* Uploaded Video Display */}
                {
                    message.videoUrl && (
                        <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                                <IoClose size={30} />
                            </div>
                            <div className='bg-white p-3'>
                                <video
                                    src={message.videoUrl}
                                    className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                                    controls
                                    muted
                                    autoPlay
                                />
                            </div>
                        </div>
                    )
                }

                {
                    loading && (
                        <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                            <Loading />
                        </div>
                    )
                }
            </section>

            {/* Send Message */}
            <section className="h-16 bg-white flex items-center px-4">
                <div className="relative">
                    <button onClick={handleUploadImageVideoOpen} className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-green-600 hover:text-white">
                        <FaPlus size={20} />
                    </button>

                    {/* Upload Video and Image */}
                    {
                        openImageVideoUpload && (
                            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                                <form>
                                    <label htmlFor="uploadImage" className="flex items-center p-2 px-3 gap-3 cursor-pointer hover:bg-slate-200" >
                                        <div className="text-blue-500">
                                            <FaImage size={18} />
                                        </div>
                                        <p>Image</p>
                                    </label>

                                    <label htmlFor="uploadVideo" className="flex items-center p-2 px-3 gap-3 cursor-pointer hover:bg-slate-200" >
                                        <div className="text-purple-500">
                                            <FaVideo size={18} />
                                        </div>
                                        <p>Video</p>
                                    </label>

                                    <input
                                        type='file'
                                        id='uploadImage'
                                        onChange={handleUploadImage}
                                        className='hidden'
                                    />

                                    <input
                                        type='file'
                                        id='uploadVideo'
                                        onChange={handleUploadVideo}
                                        className='hidden'
                                    />
                                </form>
                            </div>
                        )
                    }
                </div>

                {/* Message Input */}
                <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
                    <input
                        type='text'
                        placeholder='Type here message...'
                        className='py-1 px-4 outline-none w-full h-full'
                        value={message.text}
                        onChange={handleOnChange}
                    />
                    <button className='text-green-500 hover:text-green-700'>
                        <IoMdSend size={28} />
                    </button>
                </form>
            </section>
        </div>
    );
};

export default MessagePage;
