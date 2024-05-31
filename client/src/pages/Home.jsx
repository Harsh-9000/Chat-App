import { Outlet, useLocation } from "react-router-dom";
import RegisterAndLoginForm from "../components/RegisterAndLoginForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../api";
import Sidebar from "../components/Sidebar";
import Logo from "../components/Logo";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation()
    const basePath = location.pathname === '/'

    useEffect(() => {
        const loadUserDetails = async () => {
            setLoading(true);
            await fetchUserDetails(dispatch);
            setLoading(false);
        };

        loadUserDetails();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
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
