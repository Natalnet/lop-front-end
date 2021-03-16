import React, { createContext, useEffect } from 'react';
import useList from 'src/hooks/useList';
import UseQuestion from 'src/hooks/useQuestion';
import useSubmission from 'src/hooks/useSubmission';
import useTest from 'src/hooks/useTest';

const InfoCountQuestionAndListAndTestAndSubmissionContext = createContext({
    countSubmissions: 0,
    countQuestions: 0,
});

const InfoCountQuestionAndListAndTestAndSubmissionContextProvider = (props) => {
    const { getCountsubmisssions, countSubmissions } = useSubmission();
    const { getCountQuestions, countQuestions } = UseQuestion();
    const { getCountlists, countLists } = useList();
    const { getCountTests, countTests } = useTest();
    useEffect(() => {
        getCountsubmisssions();
        getCountQuestions();
        getCountlists();
        getCountTests();
    }, []);

    return (
        <InfoCountQuestionAndListAndTestAndSubmissionContext.Provider
            value={{
                countSubmissions,
                countQuestions,
                countLists,
                countTests
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