import { getCurrentUser } from "./backend/apiAuth";
import useFetch from "./hooks/use-fetch";

import { createContext, useEffect, useContext } from 'react';

const UrlContext = createContext();


const UrlProvider = ({ children }) => {
    const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

    const isAuthenticated = user?.role === "authenticated";
    useEffect(() => {
        fetchUser();
    }, []);

    return <UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
        {children}
    </UrlContext.Provider>
}

export const UrlState = () => {
    return useContext(UrlContext);
}

export default UrlProvider;