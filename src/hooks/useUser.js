import { useCallback, useState } from 'react';
import api from '../services/api';

const useUser = () => {
    const [user, setUser] = useState();
    const [isLoadingUser, setLoadingUser] = useState();

    const getUser = useCallback(async (id) => {
        setLoadingUser(true);
        try {
            const response = await api.get(`/user/${id}`);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
        setLoadingUser(false);
    }, []);

    return { user, isLoadingUser, getUser };
}

export default useUser;