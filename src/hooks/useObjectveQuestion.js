import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useObjectiveQuestion = () => {
    const [paginedObjectiveQuestions, setPaginedObjectiveQuestions] = useState(null);
    const [infoObjectiveQuestion, setInfoObjectiveQuestion] = useState(null);
    const [isLoadingInfoObjectiveQuestion, setIsLoadingInfoObjectiveQuestion] = useState(false);
    const [errorInfoObjectiveQuestion, setErrorInfoObjectiveQuestion] = useState(null);
    const [isLoadingObjectiveQuestions, setIsLoadingObjectiveQuestions] = useState(false);
    const [errorObjectiveQuestions, setErrorObjectiveQuestions] = useState(null);

    const getPaginedObjectiveQuestions = useCallback(async (page = 1, querys) => {
        setIsLoadingObjectiveQuestions(true);
        setErrorObjectiveQuestions(null);
        //console.log(`/question/page/${page}?${querys}`);
        try {
            const response = await api.get(`/objectiveQuestion/page/${page}?${querys}`);
            setPaginedObjectiveQuestions(response.data);
        }
        catch (err) {
            setErrorObjectiveQuestions(err);
        }
        setIsLoadingObjectiveQuestions(false);
    }, [])

    const createObjectveQuestion = useCallback(async ({
        title,
        description,
        status,
        difficulty,
        alternatives,
        tags
    }) => {
        let msg = '';
        msg += !title ? "Informe o título do exercício<br/>" : "";
        msg += !description ? "Informe o enunciado do exercício<br/>" : "";
        if (!tags.length) {
            msg += 'Escolha pelo menos uma tag<br/>';
        }
        const alternativesCorret = alternatives.filter(a => a.isCorrect);
        if (alternatives.length < 2) {
            msg += 'O Exercício deve conter pelo menos duas alternativas<br/>';
        }
        if (alternativesCorret.length !== 1) {
            msg += 'Uma alternativa deve estar marcada como a correta<br/>';
        }
        const alternativesEmpty = alternatives.filter(a => !a.description);
        if (alternativesEmpty.length) {
            msg += 'Toda alternativa deve conter uma descrição<br/>';
        }
        if (msg) {
            Swal.fire({
                type: "error",
                title: "Não foi possivel cadastrar o exercício",
                html: msg,
            });
            return false;
        }
        const request = {
            title,
            description,
            status,
            difficulty,
            alternatives,
            tags
        }
        Swal.fire({
            title: "Criando Exercício",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.post('/objectiveQuestion', request);
            Swal.hideLoading();
            Swal.fire({
                type: "success",
                title: "Exercício criado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                type: "error",
                title: "ops... Exercício não pôde ser criado",
            });
            return false;
        }
    }, []);

    const getInfoObjectiveQuestion = useCallback(async id=>{
        setIsLoadingInfoObjectiveQuestion(true);
        setErrorInfoObjectiveQuestion(null);
        try{
            const response = await api.get(`/objectiveQuestion/${id}/info`);
            setInfoObjectiveQuestion(response.data);
        }
        catch(err){
            console.log(err);
            setErrorInfoObjectiveQuestion(err);
        }   
        setIsLoadingInfoObjectiveQuestion(false);
    },[])

    return { 
        paginedObjectiveQuestions, 
        isLoadingObjectiveQuestions, 
        errorObjectiveQuestions,
        infoObjectiveQuestion,
        isLoadingInfoObjectiveQuestion,
        errorInfoObjectiveQuestion,
        setInfoObjectiveQuestion,
        createObjectveQuestion, 
        getPaginedObjectiveQuestions, 
        getInfoObjectiveQuestion
    };
}
export default useObjectiveQuestion;