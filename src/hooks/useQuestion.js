import React, { useCallback, useState } from 'react';
import api from '../services/api';
import { BiCodeAlt } from 'react-icons/bi';
import { GoChecklist } from 'react-icons/go';
import { CgUserList } from 'react-icons/cg';

const UseQuestion = () => {
    const [paginedQuestions, setPaginedQuestions] = useState(null);
    const [countQuestions, setCountQuestions] = useState(0 || sessionStorage.getItem('countQuestions') || 0);
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

    
    const getCountQuestions = useCallback(async ()=>{
        setIsLoadingQuestions(true);
        try{    
            const response = await api.get('/question/count');
            setCountQuestions(response.data.countQuestions);
            sessionStorage.setItem('countQuestions', response.data.countQuestions);

        }
        catch(err){

        }
        setIsLoadingQuestions(false);
    },[]);

    const getQuestion = useCallback(async (idQuestion, {idClass, idList, idTest, idLesson }) => {
        setIsLoadingQuestion(true);
        setErrorQuestion(null);
        try {
            const response = await api.get(`/question/${idQuestion}`, {
                params: {

                    idClass,
                    idList,
                    idTest,
                    idLesson,
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
            case 'PROGRAMMING':
                return (
                    <span
                        title='Exercicício de programação'
                    >
                        <BiCodeAlt size={25} color='#467fcf' className='mr-2' />
                    </span>
                )
            case 'OBJECTIVE':
                return (
                    <span
                        title='Exercicício de multipla escolha'
                    >
                        <GoChecklist size={25} color='#467fcf' className='mr-2' />
                    </span>
                )
            case 'DISCURSIVE':
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
        countQuestions,
        getQuestion,
        getPaginedQuestions, 
        getIconTypeQuestion,
        getCountQuestions
    };
}


export default UseQuestion;