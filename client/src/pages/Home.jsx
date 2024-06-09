import { Outlet, useLocation } from "react-router-dom";
import RegisterAndLoginForm from "../components/RegisterAndLoginForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../api";
import Sidebar from "../components/Sidebar";
import Logo from "../components/Logo";
import { useSocket } from '../contexts/SocketContext.jsx';
import { setOnlineUser } from "../redux/userSlice";
import Loading from "../components/Loading.jsx";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const basePath = location.pathname === '/';
    const socket = useSocket();

    useEffect(() => {
        const loadUserDetails = async () => {
            setLoading(true);
            try {
                await fetchUserDetails(dispatch);
            } catch (error) {
                console.error("Error loading user details", error);
            }
            setLoading(false);
        };

        loadUserDetails();
    }, [dispatch]);

    useEffect(() => {
        if (socket) {
            const handleOnlineUser = (data) => {
                dispatch(setOnlineUser(data));
            };
            socket.on('onlineUser', handleOnlineUser);

            return () => {
                socket.off('onlineUser', handleOnlineUser);
            };
        }
    }, [socket, dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        );
    }

    if (user?._id) {
        return (
            <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen bg-green-100">
                <section className={`bg-green-100 ${!basePath && "hidden"} lg:block`}>
                    <Sidebar />
                </section>

                <section className={`${basePath && "hidden"}`}>
                    <Outlet />
                </section>

                <div className={`justify-center items-center flex-col gap-2 ${!basePath ? "hidden" : "lg:flex"}`}>
                    <div>
                        <Logo />
                    </div>
                    <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
                </div>
            </div>
        );
    }

    return <RegisterAndLoginForm />;
};

export default Home;