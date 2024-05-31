import { useRef, useState } from "react";
import PropTypes from "prop-types";
import Avatar from "./Avatar";
import Divider from "./Divider";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { fetchUserDetails } from "../api";

const EditUserDetails = ({ onClose, data }) => {
    const [name, setName] = useState(data?.name);
    const [uploadPhoto, setUploadPhoto] = useState(data?.profile_pic);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);

        console.log(uploadPhoto instanceof File);

        if (uploadPhoto && uploadPhoto instanceof File) {
            formData.append('profile_pic', uploadPhoto);
        } else if (typeof uploadPhoto === 'string') {
            formData.append('existing_profile_pic', uploadPhoto);
        }

        try {
            const response = await axios.post('/update-user', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data?.success) {
                toast.success('Profile updated successfully!');
                fetchUserDetails(dispatch);
                onClose();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.log(error);
            toast.error(`${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUploadPhoto = (ev) => {
        const file = ev.target.files[0];
        setUploadPhoto(file);
    }

    const handleOpenUploadPhoto = (ev) => {
        ev.preventDefault();
        fileInputRef.current.click();
    };

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
                <h2 className="font-semibold">Profile Details</h2>
                <p className="text-sm">Edit User Details</p>

                <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full py-1 px-2 focus:outline-green-200 border rounded"
                        />
                    </div>

                    <div>
                        <div>Photo:</div>
                        <div className="my-1 flex items-center gap-4">
                            <Avatar
                                userId={data?._id}
                                width={40}
                                height={40}
                                imageUrl={uploadPhoto instanceof File ? URL.createObjectURL(uploadPhoto) : uploadPhoto}
                                name={name}
                            />
                            <label htmlFor="profile_pic">
                                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    ref={fileInputRef}
                                    onChange={handleUploadPhoto}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex gap-2 w-fit ml-auto">
                        <button type="button" onClick={onClose} className="border-white border bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500">Cancel</button>
                        <button type="submit" className="border-white border bg-green-600 text-white px-4 py-1 rounded hover:bg-green-500" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

EditUserDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        profile_pic: PropTypes.string,
    }).isRequired,
};

export default EditUserDetails;
