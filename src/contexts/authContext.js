import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';


const AuthContext = createContext({});

const AuthContextProvider = (props) => {
    const [user, setUser] = useState({
        token: sessionStorage.getItem("auth-token") || '',
        name: sessionStorage.getItem("user.name") || '',
        email: sessionStorage.getItem("user.email") || '',
        profile: (sessionStorage.getItem("user.profile") &&  sessionStorage.getItem("user.profile").toLowerCase()) || '',
        urlImage: sessionStorage.getItem("user.urlImage") || '',
    })

    const isLoged = useMemo(() => !!(user.token && user.name && user.email && user.profile), [user]);

    const handleSetUser = useCallback(({ token, name, email, profile, urlImage }) => {
        setUser({
            token,
            name,
            email,
            profile: profile.toLowerCase(),
            urlImage
        })
        sessionStorage.setItem("auth-token", token);
        sessionStorage.setItem("user.profile", profile);
        sessionStorage.setItem("user.name", name);
        sessionStorage.setItem("user.email", email);
        sessionStorage.setItem("user.urlImage", urlImage || "");
    }, []);

    const handleLogout = useCallback(()=>{
        sessionStorage.clear();
        setUser({});
    },[]); 

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoged,
                handleSetUser,
                handleLogout
            }}
        >
            { props.children }
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthContextProvider
}