import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import Swal from "sweetalert2";
// import { Container } from './styles';

const useSubmission = () => {
    const history = useHistory();

    const [Submissions, setSubmissions] = useState([]);
    const [countSubmissions, setCountSubmissions] = useState(0);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [isSavingSubmission, setIsSavingSubmission] = useState(false);
    const [isErrorSubmission, setErrorSubmission] = useState(null);

    const getCountsubmisssions = useCallback(async ()=>{
        setIsLoadingSubmissions(true);
        try{    
            const response = await api.get('/submission/count');
            setCountSubmissions(response.data.countSubmissions);
        }
        catch(err){

        }
        setIsLoadingSubmissions(false);
    },[]);

    const getSubmissions = useCallback(async () => {
        setIsLoadingSubmissions(true);
        setErrorSubmission(null);
        try {
            const response = await api.get(`/tag`);
            setSubmissions(response.data);
        }
        catch (err) {
            setErrorSubmission(err);
        }
        setIsLoadingSubmissions(false);
    })

    const saveSubmissionByObjectiveQuestion = useCallback(async ({
        answer,
        timeConsuming,
        ip,
        environment,
        idQuestion,
        idList,
        idTest,
        idClass,
        idLesson,
    }) => {
        setIsSavingSubmission(true);
        setErrorSubmission(null);
        const request = {
            answer,
            timeConsuming,
            ip,
            environment,
            idQuestion,
            idList,
            idTest,
            idClass,
            idLesson,
        }
        try {
            await api.post(`/submission/ObjectiveQuestion`, request);
            setIsSavingSubmission(false);
            return true;
        }
        catch (err) {
            if (err.response && err.response.status === 400 && err.response.data && err.response.data.msg === "O professor recolheu a prova! :'(") {
                Swal.fire({
                    icon: "error",
                    title: "O professor recolheu a prova! :'(",
                });
                history.push(`/aluno/turma/${idClass}/provas`);
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "ops... Algum erro aconteceu na operação :(",
                });
            }
            setErrorSubmission(err);
            setIsSavingSubmission(false);
            return false;
        }
    }, [history]);

    const saveSubmissionByDiscursiveQuestion = useCallback(async ({
        answer,
        timeConsuming,
        ip,
        char_change_number,
        environment,
        idQuestion,
        idList,
        idTest,
        idClass,
        idLesson,
    }) => {
        setIsSavingSubmission(true);
        setErrorSubmission(null);
        const request = {
            answer,
            timeConsuming,
            ip,
            char_change_number,
            environment,
            idQuestion,
            idList,
            idTest,
            idClass,
            idLesson,
        }
        try {
            await api.post(`/submission/discursiveQuestion`, request);
            setIsSavingSubmission(false);
            return true;
        }
        catch (err) {
            if (err.response && err.response.status === 400 && err.response.data && err.response.data.msg === "O professor recolheu a prova! :'(") {
                Swal.fire({
                    icon: "error",
                    title: "O professor recolheu a prova! :'(",
                });
                history.push(`/aluno/turma/${idClass}/provas`);

            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "ops... Algum erro aconteceu na operação :(",
                });
            }
            setErrorSubmission(err);
            setIsSavingSubmission(false);
            return false;
        }
    },[history]);

    return {
        Submissions,
        isLoadingSubmissions,
        isErrorSubmission,
        isSavingSubmission,
        countSubmissions,
        saveSubmissionByObjectiveQuestion,
        saveSubmissionByDiscursiveQuestion,
        getSubmissions,
        getCountsubmisssions
    }
}

export default useSubmission;