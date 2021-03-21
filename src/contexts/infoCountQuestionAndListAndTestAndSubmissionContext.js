import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { AuthContext } from './authContext';
import useList from 'src/hooks/useList';
import UseQuestion from 'src/hooks/useQuestion';
import useSubmission from 'src/hooks/useSubmission';
import useTest from 'src/hooks/useTest';

const InfoCountQuestionAndListAndTestAndSubmissionContext = createContext({
    countSubmissions: 0,
    countQuestions: 0,
});

const InfoCountQuestionAndListAndTestAndSubmissionContextProvider = (props) => {

    const { isLoged } = useContext(AuthContext);
    const { getCountsubmisssions, countSubmissions } = useSubmission();
    const { getCountQuestions, countQuestions } = UseQuestion();
    const { getCountlists, countLists } = useList();
    const { getCountTests, countTests } = useTest();

    const getInfoQuestionAndListAndTestAndSubmission = useCallback(() => {
        if (!isLoged) {
            return;
        }
        // getCountsubmisssions();
        getCountQuestions();
        getCountlists();
        getCountTests();
    }, [isLoged, getCountsubmisssions, getCountQuestions, getCountlists, getCountTests]);

    useEffect(() => {
        getInfoQuestionAndListAndTestAndSubmission();
    }, []);

    return (
        <InfoCountQuestionAndListAndTestAndSubmissionContext.Provider
            value={{
                countSubmissions,
                countQuestions,
                countLists,
                countTests,
                getInfoQuestionAndListAndTestAndSubmission
            }}
        >
            { props.children }
        </InfoCountQuestionAndListAndTestAndSubmissionContext.Provider>
    )
}

export {
    InfoCountQuestionAndListAndTestAndSubmissionContext,
    InfoCountQuestionAndListAndTestAndSubmissionContextProvider
}