import { useState } from "react";
import axios from "axios";
import Chat from '../assets/chat.jpg';
import Logo from "./Logo";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setToken } from "../redux/userSlice";
import { fetchUserDetails } from "../api";

export default function RegisterAndLoginForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [uploadPhoto, setUploadPhoto] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setIsLoading(true);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            let response;
            if (isLoginOrRegister === 'register') {
                formData.append('name', name);
                if (uploadPhoto) {
                    formData.append('profile_pic', uploadPhoto);
                }

                response = await axios.post('/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data?.success) {
                    toast.success('Registration successful!');
                }
            } else {
                response = await axios.post('/login', { email, password }, { withCredentials: true });
                if (response.data?.success) {
                    dispatch(setToken(response?.data?.token));
                    localStorage.setItem('token', response?.data?.token);
                    toast.success('Login successful!');
                }
            }

            if (response.data?.success) {
                await fetchUserDetails(dispatch);
            }

        } catch (error) {
            console.log(error);
            toast.error(`${error.response.data.message || error.message}`);
        } finally {
            setIsLoading(false);
            setEmail("");
            setName("");
            setPassword("");
            setUploadPhoto("");
            if (isLoginOrRegister === 'register') {
                setIsLoginOrRegister('login');
            }
        }
    };

    const handleUploadPhoto = (ev) => {
        const file = ev.target.files[0];
        setUploadPhoto(file);
    };

    const handleClearUploadPhoto = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setUploadPhoto(null);
    };

    return (
        <>
            <div className="mt-2 ml-2" >
                <Logo />
            </div>
            <div className="flex flex-row justify-around px-10 mx-10 h-[90vh]">
                <div className="w-[350px] flex flex-col justify-evenly items-center">
                    <h2 className="font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-l from-green-400 via-green-500 to-green-600">
                        Connecting People, <br />One Chat at a Time
                    </h2>
                    <form className="w-full mx-auto mb-4" onSubmit={handleSubmit}>
                        {isLoginOrRegister === 'register' && (
                            <input value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                type="text"
                                placeholder="Name"
                                className="block w-full rounded-sm p-2 mb-2 border"
                            />
                        )}

                        <input value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder="Email"
                            className="block w-full rounded-sm p-2 mb-2 border"
                        />

                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            required
                            placeholder="Password"
                            className="block w-full rounded-sm p-2 mb-2 border"
                        />

                        {isLoginOrRegister === 'register' && (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="profile_pic" className="text-gray-500">
                                    <div className="h-12 mb-4 bg-slate-200 flex justify-center items-center border rounded cursor-pointer hover:border-green-500">
                                        <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                                            {
                                                uploadPhoto ? uploadPhoto?.name : "Upload profile pic"
                                            }
                                        </p>
                                        {uploadPhoto && (
                                            <button className="text-lg ml-2 hover:text-red-600" onClick={handleClearUploadPhoto} >
                                                <IoClose />
                                            </button>
                                        )}
                                    </div>
                                </label>

                                <input required type="file" id="profile_pic" name="profile_pic" className="bg-slate-100 px-2 py-1 focus:outline-green-500 hidden" onChange={handleUploadPhoto} />
                            </div>
                        )}

                        <button
                            className={`bg-green-500 text-white block w-full rounded-sm p-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : (isLoginOrRegister === 'register' ? 'Register' : 'Login')}
                        </button>

                        <div className="text-center mt-2">
                            {isLoginOrRegister === 'register' && (
                                <div>
                                    Already a member?&nbsp;
                                    <button onClick={() => setIsLoginOrRegister('login')} className="text-blue-500 hover:underline hover:text-blue-700">
                                        Login here
                                    </button>
                                </div>
                            )}

                            {isLoginOrRegister === 'login' && (
                                <div>
                                    Don&apos;t have an account?&nbsp;
                                    <button onClick={() => setIsLoginOrRegister('register')} className="text-blue-500 hover:underline hover:text-blue-700">
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="flex justify-center items-center">
                    <img src={Chat} alt="" className="w-[550px]" />
                </div>
            </div>
        </>
    )
}
