import { useCallback, useState } from 'react';
import api from '../services/api';
const useDataScience = () => {

    const [csvListStudents, setCsvListStudents] = useState([]);
    const [isLoadingCsvListStudents, setIsLoadingCsvListStudents] = useState([]);

    const getCsvListStudents = useCallback(async idClass => {
        setIsLoadingCsvListStudents(true);
        try {
            const response = await api.get(`dataScience/class/${idClass}/list`);
            const csvListStudentsTmp = [...response.data];
            csvListStudentsTmp.forEach((csvListStudent, i) => {
                csvListStudent.lists.push({
                    id: `${i + csvListStudent.id}`,
                    title: 'Média',
                    questionsCompletedSumissionsCount: csvListStudent.lists.reduce((previousValue, currentIndex) => {
                        return previousValue + currentIndex.questionsCompletedSumissionsCount / currentIndex.questionsCount
                    }, 0) / csvListStudent.lists.length,
                    questionsCount: 1,
                })
                // csvListStudent.average = csvListStudent.lists.reduce((previousValue, currentIndex) => {
                //     return previousValue + (currentIndex.questionsCompletedSumissionsCount / currentIndex.questionsCount)
                // }, 0);
                // csvListStudent.average= Number((csvListStudent.average / csvListStudent.lists.length) * 100).toFixed(2);

            })
            console.log(csvListStudentsTmp);
            setCsvListStudents(csvListStudentsTmp);
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