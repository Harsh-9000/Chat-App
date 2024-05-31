import axios from 'axios';
import { setUser, logout } from './redux/userSlice';

export const fetchUserDetails = async (dispatch) => {
    try {
        const response = await axios({ url: '/user-details', withCredentials: true });
        dispatch(setUser(response.data.data));

        if (response.data.logout) {
            dispatch(logout());
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};