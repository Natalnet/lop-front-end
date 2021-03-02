import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useUser = () => {
    const [user, setUser] = useState();
    const [isLoadingUser, setLoadingUser] = useState();
    const [isSavingUser, setIsSavingUser] = useState();
    const [errUpdateProfileUser, setErrUpdateProfileUser] = useState({
        name: '',
        currentPassowrd: '',
        confirmNewPassword: ''
    });
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

    const getInfoProfileUser = useCallback(async (id) => {
        setLoadingUser(true);
        try {
            const response = await api.get('/user/info/profile');
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
        setLoadingUser(false);
    }, []);

    const updateInfoProfileUser = useCallback(async (userInfo, editPassowrd) => {
        setIsSavingUser(true);
        setErrUpdateProfileUser({
            name: '',
            currentPassowrd: '',
            confirmNewPassword: ''
        });
        if(editPassowrd){
            if(userInfo.newPassword.length < 6){
                setErrUpdateProfileUser({
                    name: '',
                    currentPassowrd: '',
                    confirmNewPassword: 'Senha deve conter no mínimo 6 caracteres'
                });
                setIsSavingUser(false);
                return;
            }
            else if(userInfo.newPassword !== userInfo.confirmNewPassword){
                setErrUpdateProfileUser({
                    name: '',
                    currentPassowrd: '',
                    confirmNewPassword: 'Senhas não batem'
                });
                setIsSavingUser(false);
                return;
            }
            delete userInfo.confirmNewPassword;
        }
        
        const request = {
            user: userInfo,
            editPassowrd
        }
        try {
            const response = await api.put('/user/info', request);
            setUser(response.data);
            sessionStorage.setItem('user.name', response.data.name)
            Swal.fire({
                icon: "success",
                title: "Perfil atualizado com sucesso!",
            });
        } catch (err) {
            //console.log(Object.getOwnPropertyDescriptors(err))
            if(err.response && err.response.status === 400){
                if(Array.isArray(err.response.data) ){
                    setErrUpdateProfileUser({
                        name: err.response.data[0].message,
                        currentPassowrd: '',
                        confirmNewPassword: ''
                    });
                }
                else if(err.response.data.message){
                    setErrUpdateProfileUser({
                        name: '',
                        currentPassowrd: err.response.data.message,
                        confirmNewPassword: ''
                    }); 
                }
            }
            Swal.fire({
                icon: "error",
                title: "ops... Perfil não pôde ser atualizado!",
            });
        }
        setIsSavingUser(false);
    }, []);

    return { user, isLoadingUser, isSavingUser, errUpdateProfileUser, getUser, getInfoProfileUser, updateInfoProfileUser };
}

export default useUser;