import React, { useCallback, useState } from 'react';
import api from '../services/api';
import { BiCodeAlt } from 'react-icons/bi';
import { GoChecklist } from 'react-icons/go';
import { CgUserList } from 'react-icons/cg';

const UseQuestion = () => {
    const [paginedQuestions, setPaginedQuestions] = useState(null);
    const [question, setQuestion] = useState(null);
    const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [errorQuestion, setErrorQuestion] = useState(null);

    const getPaginedQuestions = useCallback(async (page = 1, querysParams) => {
        setIsLoadingQuestions(true);
        setErrorQuestion(null);
        //console.log(`/question/page/${page}?${querys}`);
        try {
            const response = await api.get(`/question/page/${page}`, {
                params: querysParams
            });
            setPaginedQuestions(response.data);
        }
        catch (err) {
            setErrorQuestion(err);
        }
        setIsLoadingQuestions(false);
    }, []);

    const getQuestion = useCallback(async (idQuestion, {idClass, idList, idTest }) => {
        setIsLoadingQuestion(true);
        setErrorQuestion(null);
        try {
            const response = await api.get(`/question/${idQuestion}`, {
                params: {
                    idClass,
                    idList,
                    idTest,
                    difficulty: 'yes',
                    draft: 'yes',
                    exclude: 'id code status createdAt updatedAt author_id solution'
                }
            });
            setQuestion(response.data);
            //console.log('question: ',response.data)
        }
        catch (err) {
            setErrorQuestion(err);
        }
        setIsLoadingQuestion(false);
    }, []);

    const getIconTypeQuestion = useCallback(type => {
        switch (type) {
            case 'PROGRAMAÇÃO':
                return (
                    <span
                        title='Exercicício de programação'
                    >
                        <BiCodeAlt size={25} color='#467fcf' className='mr-2' />
                    </span>
                )
            case 'OBJETIVA':
                return (
                    <span
                        title='Exercicício de multipla escolha'
                    >
                        <GoChecklist size={25} color='#467fcf' className='mr-2' />
                    </span>
                )
            case 'DISCURSIVA':
                return (
                    <span
                        title='Exercicício discursivo'
                    >
                        <CgUserList size={25} color='#467fcf' className='mr-2' />
                    </span>
                )

            default:
                return '';
        }

    }, []);

    return { 
        paginedQuestions, 
        isLoadingQuestions, 
        errorQuestion,
        question,
        isLoadingQuestion,
        getQuestion,
        getPaginedQuestions, 
        getIconTypeQuestion 
    };
}


export default UseQuestion;