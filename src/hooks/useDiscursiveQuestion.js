import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useDiscursiveQuestion = () => {
    const [paginedDiscursiveQuestions, setPaginedDiscursiveQuestions] = useState(null);
    const [infoDiscursiveQuestion, setInfoDiscursiveQuestion] = useState(null);
    const [isLoadingInfoDiscursiveQuestion, setIsLoadingInfoDiscursiveQuestion] = useState(false);
    const [errorInfoDiscursiveQuestion, setErrorInfoDiscursiveQuestion] = useState(null);
    const [isLoadingDiscursiveQuestions, setIsLoadingDiscursiveQuestions] = useState(false);
    const [errorDiscursiveQuestions, setErrorDiscursiveQuestions] = useState(null);

    const getPaginedDiscursiveQuestions = useCallback(async (page = 1, querys) => {
        setIsLoadingDiscursiveQuestions(true);
        setErrorDiscursiveQuestions(null);
        //console.log(`/question/page/${page}?${querys}`);
        try {
            const response = await api.get(`/discursiveQuestion/page/${page}?${querys}`);
            setPaginedDiscursiveQuestions(response.data);
        }
        catch (err) {
            setErrorDiscursiveQuestions(err);
        }
        setIsLoadingDiscursiveQuestions(false);
    }, [])

    const createDiscursiveQuestion = useCallback(async ({
        title,
        description,
        status,
        difficulty,
        tags
    }) => {
        const isValid = validateDiscursivequestion({
            title,
            description,
            tags
        });
        if(!isValid){
            return;
        }
        const request = {
            title,
            description,
            status,
            difficulty,
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
            await api.post('/discursiveQuestion', request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Exercício criado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Exercício não pôde ser criado",
            });
            return false;
        }
    }, [validateDiscursivequestion]);

    const updateDiscursiveQuestion = useCallback(async (id, {
        title,
        description,
        status,
        difficulty,
        tags
    }) => {
        const isValid = validateDiscursivequestion({
            title,
            description,
            tags
        });
        console.log('isValid: ',isValid)

        if(!isValid){
            return;
        }
        const request = {
            title,
            description,
            status,
            difficulty,
            tags
        }
        Swal.fire({
            title: "Editando Exercício",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.put(`/discursiveQuestion/${id}`, request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Exercício editado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Exercício não pôde ser editado",
            });
            return false;
        }
    }, [validateDiscursivequestion]);

    const getInfoDiscursiveQuestion = useCallback(async id => {
        setIsLoadingInfoDiscursiveQuestion(true);
        setErrorInfoDiscursiveQuestion(null);
        try {
            const response = await api.get(`/discursiveQuestion/${id}/info`);
            setInfoDiscursiveQuestion(response.data);
        }
        catch (err) {
            console.log(err);
            setErrorInfoDiscursiveQuestion(err);
        }
        setIsLoadingInfoDiscursiveQuestion(false);
    }, [])

    const validateDiscursivequestion = useCallback(({
        title,
        description,
        tags
    }) => {
        let msg = '';
        msg += !title ? "Informe o título do exercício;<br/>" : "";
        msg += !description ? "Informe o enunciado do exercício;<br/>" : "";
        if (!tags.length) {
            msg += 'Escolha pelo menos uma tag;<br/>';
        }
       
        if (msg) {
            Swal.fire({
                icon: "error",
                title: "Não foi possivel salvar o exercício",
                html: msg,
            });
            return false;
        }
        return true;
    }, [])

    return {
        paginedDiscursiveQuestions,
        isLoadingDiscursiveQuestions,
        errorDiscursiveQuestions,
        infoDiscursiveQuestion,
        isLoadingInfoDiscursiveQuestion,
        errorInfoDiscursiveQuestion,
        setInfoDiscursiveQuestion,
        createDiscursiveQuestion,
        updateDiscursiveQuestion,
        getPaginedDiscursiveQuestions,
        getInfoDiscursiveQuestion
    };
}
export default useDiscursiveQuestion;