import { IoChatbubbleEllipses } from "react-icons/io5"
import { FaUserPlus } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar"
import { useSelector } from "react-redux";
import { useState } from "react";
import EditUserDetails from "./EditUserDetails";

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)

    return (
        <div className="w-full h-full">
            <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
                <div>
                    <NavLink title="chat" className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`}>
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

                    <div title="add friend" className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
                        <FaUserPlus size={20} />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <button className="mx-auto" title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar width={40} height={40} name={user?.name} userId={user?._id} imageUrl={user?.profile_pic} />
                    </button>

                    <button title="logout" className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
                        <span className="-ml-2">
                            <BiLogOut size={20} />
                        </span>
                    </button>
                </div>
            </div>

            {
                editUserOpen && (
                    <EditUserDetails data={user} onClose={() => setEditUserOpen(false)} />
                )
            }
        </div>
    )
}

export default Sidebar