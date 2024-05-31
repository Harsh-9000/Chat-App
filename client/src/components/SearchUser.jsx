import { useEffect, useRef, useState } from "react"
import { IoSearchOutline } from "react-icons/io5"
import Loading from "./Loading"
import UserSearchCard from "./UserSearchCard"
import { toast } from "react-toastify"
import axios from "axios"
import PropTypes from 'prop-types'

const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const searchUserRef = useRef(null);

    const handleSearchUser = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/search-user', { search }, {
                withCredentials: true
            });

            setSearchUser(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchUserRef.current && !searchUserRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-40 p-2">
            <div className="w-full max-w-lg mx-auto mt-10" ref={searchUserRef}>
                <div className="bg-white rounded h-14 overflow-hidden flex">
                    <input
                        type="text"
                        placeholder="Search user by name, email..."
                        className="w-full outline-none px-4 py-1 h-full"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />

                    <div className="h-14 w-14 flex justify-center items-center">
                        <IoSearchOutline size={25} />
                    </div>
                </div>

                <div className="bg-white mt-2 w-full p-4 rounded">
                    {
                        searchUser.length === 0 && !loading && (
                            <p className="text-center text-slate-500">No User Found</p>
                        )
                    }

                    {
                        loading && (
                            <p><Loading /></p>
                        )
                    }

                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user) => {
                                return (
                                    <UserSearchCard key={user._id} user={user} onClose={onClose} />
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

SearchUser.propTypes = {
    onClose: PropTypes.func.isRequired
}

export default SearchUser