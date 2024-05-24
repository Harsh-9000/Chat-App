import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import Chat from './assets/chat.jpg';
import Logo from "./Logo";

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        const { data } = await axios.post('/' + url, { username, password });
        setLoggedInUsername(username);
        setId(data.id);
    }

    return (
        <>
            <div className="mt-5 ml-5" >
                <Logo />
            </div>
            <div className="flex flex-row justify-around px-10 mx-10 h-[90vh]">
                <div className="w-[350px] flex flex-col justify-evenly items-center">
                    <h2 className="font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-l from-green-400 via-green-500 to-green-600">
                        Connecting People, <br />One Chat at a Time
                    </h2>
                    <form className="w-full mx-auto mb-4" onSubmit={handleSubmit}>
                        <input value={username}
                            onChange={e => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="block w-full rounded-sm p-2 mb-2 border"
                        />

                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="block w-full rounded-sm p-2 mb-2 border"
                        />

                        <button className="bg-green-500 text-white block w-full rounded-sm p-2">
                            {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
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
