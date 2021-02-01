import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";
// import { Container } from './styles';

const useClass = () => {
    const [isLoadingClass, setIsLoadingClass] = useState(false);
    const [classRoon, setClassRoon] = useState(null);

    const getClass = useCallback(async (classId) => {
        try {
            setIsLoadingClass(true);
            const response = await api.get(`/class/${classId}`)
            setClassRoon(response.data)
        }
        catch (err) {
            Swal.fire({
                type: "error",
                title: "ops... erro ao carregar turma",
            });
        }
        setIsLoadingClass(false);
    }, [])

   

    return { isLoadingClass, classRoon, getClass};
}

export default useClass;