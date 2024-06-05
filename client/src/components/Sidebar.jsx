import { IoChatbubbleEllipses } from "react-icons/io5"
import { FaUserPlus } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { BiLogOut } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaImage, FaVideo } from "react-icons/fa6";
import Avatar from "./Avatar"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useSocket } from "../contexts/SocketContext";

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const dispatch = useDispatch();
    const socket = useSocket();

    const handleLogout = async () => {
        try {
            const response = await axios.post('/logout', {}, { withCredentials: true });

            if (response.status !== 200) {
                throw new Error('Error during sign out.');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            if (socket) {
                socket.emit('logout');
            }
            setEditUserOpen(false);
            setAllUser([]);
            setOpenSearchUser(false);
            localStorage.removeItem('token');
            dispatch(logout());
        }
    };

    useEffect(() => {
        if (socket) {
            socket.emit('sidebar', user?._id)

            socket.on('chat', (data) => {
                const chatUserData = data.map((chatUser) => {
                    if (chatUser?.recipient?._id !== user?._id) {
                        return {
                            ...chatUser,
                            userDetails: chatUser?.recipient
                        }
                    } else {
                        return {
                            ...chatUser,
                            userDetails: chatUser?.sender
                        }
                    }
                })

                setAllUser(chatUserData)
            })
        }
    }, [socket, user])

    return (
        <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
            <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
                <div>
                    <NavLink title="chat" className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`}>
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

                    <div title="add friend" onClick={() => setOpenSearchUser(true)} className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
                        <FaUserPlus size={20} />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <button className="mx-auto" title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar width={40} height={40} name={user?.name} userId={user?._id} imageUrl={user?.profile_pic} />
                    </button>

                    <button title="logout" onClick={() => handleLogout()} className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
                        <span className="-ml-2">
                            <BiLogOut size={20} />
                        </span>
                    </button>
                </div>
            </div>

            <div className="w-full">
                <div className="h-16 flex items-center">
                    <h2 className="text-xl font-bold p-2 text-slate-800">Message</h2>
                </div>
                <div className="bg-slate-200 p-[0.5px]"></div>

                <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
                    {
                        allUser.length === 0 && (
                            <div className="mt-12">
                                <div className="flex justify-center items-center my-4 text-slate-500">
                                    <AiOutlineUserAdd size={50} />
                                </div>
                                <p className="text-lg text-center text-slate-400">Explore users to start a coversation.</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((chat) => {
                            return (
                                <NavLink to={"/" + chat?.userDetails?._id} key={chat?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-green-700 rounded hover:bg-slate-100 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            imageUrl={chat?.userDetails?.profile_pic}
                                            name={chat?.userDetails?.name}
                                            width={40}
                                            height={40}
                                            userId={chat?.userDetails?._id}
                                        />
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{chat?.userDetails?.name}</h3>
                                        <div className='text-slate-500 text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {
                                                    chat?.lastMessage?.imageUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaImage /></span>
                                                            {!chat?.lastMessage?.text && <span>Image</span>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    chat?.lastMessage?.videoUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaVideo /></span>
                                                            {!chat?.lastMessage?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{chat?.lastMessage?.text}</p>
                                        </div>
                                    </div>
                                    {
                                        Boolean(chat?.unseenMessages) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-green-700 text-white font-semibold rounded-full'>{chat?.unseenMessages}</p>
                                        )
                                    }

                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>

            {
                editUserOpen && (
                    <EditUserDetails data={user} onClose={() => setEditUserOpen(false)} />
                )
            }

            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpenSearchUser(false)} />
                )
            }
        </div>
    )
}

export default Sidebar