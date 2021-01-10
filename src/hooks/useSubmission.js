import { useState, useCallback } from 'react';
import api from '../services/api';
// import { Container } from './styles';

const useSubmission = () => {
    const [Submissions, setSubmissions] = useState([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [isSavingSubmission, setIsSavingSubmission] = useState(false);
    const [isErrorSubmission, setErrorSubmission] = useState(null);

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
        idClass
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
            idClass
        }
        try {
            await api.post(`/submission/ObjectiveQuestion`, request);
            setIsSavingSubmission(false);
            return true;
        }
        catch (err) {
            setErrorSubmission(err);
            setIsSavingSubmission(false);
            return false;
        }
    })

    return {
        Submissions,
        isLoadingSubmissions,
        isErrorSubmission,
        isSavingSubmission,
        saveSubmissionByObjectiveQuestion,
        getSubmissions
    }
}

export default useSubmission;