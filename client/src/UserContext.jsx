import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [email, setEmail] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        axios.get('/user-details').then(response => {
            console.log(response.data.data);
            setId(response.data.userId);
            setEmail(response.data.username);
        });
    });

    return (
        <UserContext.Provider value={{ email, setEmail, id, setId }}>
            {children}
        </UserContext.Provider>
    );
}