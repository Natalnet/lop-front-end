import { useCallback, useState } from 'react';
import api from '../services/api';

const UseQuestion = () => {
    const [paginedQuestions, setPaginedQuestions] = useState(null);
    //const [questions, setQuestions] = useState([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [errorQuestion, setErrorQuestion] = useState(null);

    const getPaginedQuestions = useCallback(async (page = 1, querys)=>{
        setIsLoadingQuestions(true);
        setErrorQuestion(null);
        //console.log(`/question/page/${page}?${querys}`);
        try{
            const response = await api.get(`/question/page/${page}?${querys}`);
            //console.log('question: ', response.data);
            setPaginedQuestions(response.data);
        }
        catch(err){
            setErrorQuestion(err);
        }
        setIsLoadingQuestions(false);
    },[])


    return {paginedQuestions, isLoadingQuestions, errorQuestion, getPaginedQuestions};
}


export default UseQuestion;