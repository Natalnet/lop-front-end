import { useCallback, useState } from 'react';
import api from '../services/api';
const useDataScience = () => {

    const [csvListStudents, setCsvListStudents] = useState([]);
    const [isLoadingCsvListStudents, setIsLoadingCsvListStudents] = useState(false);

    const getCsvListStudents = useCallback(async idClass => {
        setIsLoadingCsvListStudents(true);
        try {
            const response = await api.get(`dataScience/class/${idClass}/list/dashboard`);
            setCsvListStudents(response.data);
        }
        catch (err) {
            console.error('erro ao obter csvList')
        }
        setIsLoadingCsvListStudents(false);

    }, []);

    const handleSetcsvListStudents = useCallback((csvListStudentsData) => {
        setCsvListStudents(csvListStudentsData);
    }, []);

    return { csvListStudents, isLoadingCsvListStudents, getCsvListStudents, handleSetcsvListStudents };
}

export default useDataScience;