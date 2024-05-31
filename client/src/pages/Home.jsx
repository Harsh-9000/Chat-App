import { Outlet } from "react-router-dom";
import RegisterAndLoginForm from "../components/RegisterAndLoginForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../api";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

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
            <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
                <section className="bg-green-100">
                    <Sidebar />
                </section>

                <section>
                    <Outlet />
                </section>
            </div>
        );
    }

    return <RegisterAndLoginForm />;
};

export default Home;
