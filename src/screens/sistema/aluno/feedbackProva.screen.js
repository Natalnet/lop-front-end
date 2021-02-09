import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { BlockMath } from "react-katex";
import Swal from "sweetalert2";
import api, { baseUrlBackend } from "../../../services/api";
import apiCompiler from "../../../services/apiCompiler";
import AceEditorWrapper, { themesAceEditor } from "../../../components/templates/aceEditorWrapper.template"
import HTMLFormat from "../../../components/ui/htmlFormat";
import { Card, CardBody, CardHead, CardTitle, CardOptions } from '../../../components/ui/card';
import Radio from '@material-ui/core/Radio';
import { Row, Col } from '../../../components/ui/grid';
import * as B from "../../../components/ui/blockly";
import { getBlocklyCode, getBlocklyXML, findLocalIp, isXml } from '../../../util/auxiliaryFunctions.util';
import SupportedLanguages from "../../../config/SupportedLanguages";
import socket from "socket.io-client";
import useAccess from '../../../hooks/useAccess';
import useQuestion from '../../../hooks/useQuestion';
import useSubmission from '../../../hooks/useSubmission';
import useClass from '../../../hooks/useClass';
import useDifficulty from '../../../hooks/useDifficulty';
import useList from '../../../hooks/useList';
import useTest from '../../../hooks/useTest';
import useLesson from '../../../hooks/useLesson';
import { IoMdEye } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { Load } from '../../../components/ui/load';

import TemplateSistema from "../../../components/templates/sistema.template";


const FeedbackProva = props => {

    const idClass = useMemo(() => props.match.params.idClass, [props]);
    const idList = useMemo(() => props.match.params.idList, [props]);
    const idTest = useMemo(() => props.match.params.idTest, [props]);
    const idLesson = useMemo(() => props.match.params.idLesson, [props]);

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);
    

    const { getClass, isLoadingClass, classRoon } = useClass();

    //questions propertys

    //class propertys
    const [language, setLanguage] = useState(SupportedLanguages.list[0]);
    const [languages, setLanguages] = useState(SupportedLanguages.list);

    const [isCorrecting, setCorrecting] = useState(true);
    const simpleWorkspace = useRef(null);
    

    const loadingInfoTurma = false;
    const [loadingQuestions, setLoadingQuestions]  = useState(true);
    const [loadingCurrentAnswer, setLoadingCurrentAnswer]  = useState(true);
   
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({title: '',
                                                            type: '',
                                                            description: '',
                                                            katexDescription: '',
                                                            solution: '',
                                                            difficulty: '',
                                                            feedBackTest: '',
                                                            results: [],
                                                            response: [],
                                                            alternatives: [],
                                                            question_id: ''
                                                            });
    const [ currentAnswer, setCurrentAnswer ] = useState({answer : '',
                                                          hitPercentage: 0,
                                                          timeConsuming: 0,
                                                          char_change_number: 0,
                                                          reviewed : false
                                                        });

    const [ currentQuestionFeedback, setCurrentQuestionFeedback ] = useState({comments: "",
                                                                              compilation_error: false,
                                                                              runtime_error: false,
                                                                              presentation_error: false,
                                                                              wrong_answer: false,
                                                                              invalid_algorithm: false,
                                                                              teacherGrade: null,
                                                                            });
    const [correction, setCorrection ] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const idQuestion = 1;

    const themes = themesAceEditor;
    const theme = themes[0];

    useEffect( () => {
        if (idClass) {
            getClass(idClass);
        }
    }, [idClass]);

    useEffect(() => {
        if (classRoon) {
            setLanguage(classRoon.languages[0]);
            setLanguages(classRoon.languages);
        }
    }, [classRoon])

    useEffect( () => {
        async function fetchQuestions(){
        
            
            //const { idTurma, idAluno, idProva } = this.state;
            let query = `?idClass=${idClass}`;
            query += `&idTest=${idTest}`;
            //query += `&idUser=${idAluno}`;
            //let query = `?idClass=${idClass}`;
            //const response = await api.get(`/test/${idTest}${query}`);
            //console.log(`request ${idTest}${query}`);
            setLoadingQuestions(true);
            try {
                const response = await api.get(`/feedBacksTest/show/${query}`);
                setQuestions(response.data.questions);
            }
            catch (err) {
                console.log("erro!");
            }
            setLoadingQuestions(false);
            console.log('query finished');
        }
        
        fetchQuestions();
    }, [idClass,idTest]);


    useEffect ( () => {

        if(loadingQuestions) //ignora se ainda esta carregando
            return;
 
        setLoadingCurrentAnswer(true);
        //if (loading) this.setState({ loadingquestion: true });
        const question = questions[currentQuestionIdx];
        //verifica se já existe um feedback para questão
 
        
        if (question.feedBackTest) {
            setCurrentQuestionFeedback({
                comments: question.feedBackTest.comments,
                compilation_error: question.feedBackTest.compilation_error,
                runtime_error: question.feedBackTest.runtime_error,
                presentation_error: question.feedBackTest.presentation_error,
                wrong_answer: question.feedBackTest.wrong_answer,
                invalid_algorithm: question.feedBackTest.invalid_algorithm,
                teacherGrade:  ( question.feedBackTest.hitPercentage / 10).toFixed(2)
            });
        }
        else {
            setCurrentQuestionFeedback({
                comments: "",
                compilation_error: false,
                runtime_error: false,
                presentation_error: false,
                wrong_answer: false,
                invalid_algorithm: false,
                teacherGrade: null,
            });
        }
        

        setCurrentQuestion({
            title: question.title,
            type: question.type,
            description: question.description,
            katexDescription: question.katexDescription,
            solution: question.solution,
            difficulty: question.difficulty,
            feedBackTest: question.feedBackTest,
            results: Array.isArray(question.results) ? [...question.results] : [],
            response: Array.isArray(question.results) ? [...question.results] : [],
            alternatives: Array.isArray(question.alternatives) ? [...question.alternatives] : [],
            question_id: question.id
        });
        
        /*setState({
            title: currentQuestion.title,
            type: currentQuestion.type,
            description: currentQuestion.description,
            katexDescription: currentQuestion.katexDescription,
            solution: currentQuestion.solution,
            difficulty: currentQuestion.difficulty,
            feedBackTest: currentQuestion.feedBackTest,
            results: Array.isArray(currentQuestion.results) ? [...currentQuestion.results] : [],
            response: Array.isArray(currentQuestion.results) ? [...currentQuestion.results] : [],
            alternatives: Array.isArray(currentQuestion.alternatives) ? [...currentQuestion.alternatives] : [],
            question_id: currentQuestion.id,
        });*/

        //verifica se há um asubmissão para a questão
        
        if (question.lastSubmission) {
            console.log("setting current answer ");
            console.log(question.lastSubmission);
            setCurrentAnswer({
                answer : question.lastSubmission.answer !== '' ? question.lastSubmission.answer : '',
                hitPercentage: question.lastSubmission.hitPercentage ? ( question.lastSubmission.hitPercentage / 10).toFixed(2) : 0,
                timeConsuming: question.lastSubmission.timeConsuming ? question.lastSubmission.timeConsuming : 0,
                char_change_number: question.lastSubmission.char_change_number ? question.lastSubmission.char_change_number : 0,
                reviewed : question.feedBackTest ? question.feedBackTest.isEditedByTeacher : false
            });
        }
        else {
            setCurrentAnswer({
                answer: undefined,
                hitPercentage: ( question.lastSubmission.hitPercentage / 10).toFixed(2),
                timeConsuming: 0,
                char_change_number: 0,
                reviewed : false
            });
        }
        
        setLoadingCurrentAnswer(false);

        //verifica se a questão já foi editada pelo professor
        /*
        if (question.feedBackTest && question.feedBackTest.isEditedByTeacher) {
            this.setState({
                corrected: true,
            });
        }
        else {
            this.setState({
                corrected: false,
            });
        }
        this.setState({ loadingQuestion: false });
        */
        

    },[questions, currentQuestionIdx, loadingQuestions]);
   
    useEffect( () => {
        testAnswer(null);
    },[currentAnswer]);

    
    useEffect( () => {
        

    },[correction]);
    
    /*apenas testa a resposta sem gravar no banco*/
    async function testAnswer(e) {

        if(e)
            e.preventDefault();
        //const { answer, language, results } = state;
        
        
        
        const request = {
            codigo: language === "blockly" ? getBlocklyCode(this.simpleWorkspace.current.workspace) : currentAnswer.answer,
            linguagem: language === "blockly" ? 'python' : language,
            results: currentQuestion.results,
        };

        setCorrecting(true);
        try {
            if(currentAnswer.answer){
                
                console.log('sending aswer to backend');
                console.log(request);
                const response = await apiCompiler.post("/apiCompiler", request);
                
                setCorrection({
                    results: response.data.results,
                    hitPercentage: response.data.percentualAcerto,
                    descriptionErro: response.data.descriptionErro,
                });
            }
            else{
                setCorrection({
                    results: Array.isArray(currentQuestion.results) ? [...currentQuestion.results] : [],
                    hitPercentage: 0,
                    descriptionErro: '',
                });
            }
        } catch (err) {
            console.log(Object.getOwnPropertyDescriptors(err));
            
            Swal.fire({
                type: "error",
                title: "ops... Algum erro ao submeter a questão ao sistema de correções :(",
            });
            console.log(err);
        }
        setCorrecting(false);
    }


    return (
       
        <TemplateSistema {...props} active={"provas"} submenu={"telaTurmas"}>
            <Row>
                <Col className='col-12'>
                    {loadingInfoTurma ? (
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                    ) : (
                        <h5 style={{ margin: "0px" }}>
                            <i className="fa fa-angle-left ml-2 mr-2" />
                            <Link
                                to={`/aluno/turma/${idClass}/provas`}
                            >Voltar</Link>
                        </h5>
                    )}
                </Col>
            </Row>
            <Row>
                <Col className='col-12'>
                    <Card className="card-status-primary">
                        <CardHead>
                            <CardTitle>
                                {loadingQuestions || !currentQuestion.description ? (
                                    <div className="loader" style={{ margin: "0px auto" }}></div>
                                ) : (
                                    <b>
                                        <i className="fa fa-code mr-2" /> {currentQuestion.title}
                                    </b>
                                )}
                            </CardTitle>
                        </CardHead>
                        <CardBody className="overflow-auto">
                            <Row>
                            {loadingQuestions || !currentQuestion.description ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : (
                                <Col className='col-8'>
                                    {/* <HTMLFormat>{description}</HTMLFormat> */}
                                    <SunEditor
                                        lang="pt_br"
                                        height="auto"
                                        disable={true}
                                        showToolbar={false}
                                        // onChange={this.handleDescriptionChange.bind(this)}
                                        setContents={currentQuestion.description || ""}
                                        setDefaultStyle="font-size: 15px; text-align: justify"
                                        setOptions={{
                                            toolbarContainer: '#toolbar_container',
                                            resizingBar: false,
                                            katex: katex,
                                        }}
                                    />
                                    {currentQuestion.katexDescription ? (
                                        <BlockMath>{currentQuestion.katexDescription}</BlockMath>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            )}
                            {loadingQuestions ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : (
                                currentQuestion.type === 'PROGRAMMING' &&
                                <Col className='col-4'>
                                    <table
                                    className="table table-exemplo"
                                    style={{
                                        border: "1px solid rgba(0, 40, 100, 0.12)"
                                    }}
                                    >
                                    <tbody>
                                        <tr>
                                        <td className="pt-0">
                                            <b>Exemplo de entrada</b>
                                        </td>
                                        <td className="pt-0">
                                            <b>Exemplo de saída</b>
                                        </td>
                                        </tr>
                                        {currentQuestion.results && currentQuestion.results
                                        .map((res, i) => (
                                            <tr key={i}>
                                            <td>
                                                <HTMLFormat>{res.inputs}</HTMLFormat>
                                            </td>
                                            <td>
                                                <HTMLFormat>{res.output}</HTMLFormat>
                                            </td>
                                            </tr>
                                        ))
                                        .filter((res, i) => i < 2)}
                                    </tbody>
                                    </table>
                                </Col>

                                )}
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {currentQuestion.type === 'PROGRAMMING' &&
            <>
                <Row>
                    <Col className='col-2'>
                        <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
                        <select className="form-control" onChange={(e) => this.changeLanguage(e)}>
                        {languages.map((lang) => {
                            const languageIdx = SupportedLanguages.list.indexOf(lang);
                            return (
                            <option key={lang} value={lang}>
                                {SupportedLanguages.niceNames[languageIdx]}
                            </option>
                            );
                        })}
                        </select>
                    </Col>
                    <Col className='col-2'>
                        <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
                        <select
                            defaultValue="monokai"
                            className="form-control"
                            onChange={(e) => this.changeTheme(e)}
                        >
                            {themes.map((thene) => (
                                <option key={thene} value={thene}>
                                    {thene}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <Row>
                    <Col className='col-6'>
                        <Card>
                            
                            {loadingCurrentAnswer ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : language === 'blockly' ? (
                                <B.BlocklyComponent
                                    ref={simpleWorkspace}
                                    readOnly={false}
                                    trashcan={true}
                                    media={'media/'}
                                    move={{
                                        scrollbars: true,
                                        drag: true,
                                        wheel: true
                                    }}
                                    initialXml={isXml(currentAnswer.answer) ? currentAnswer.answer : ''}>
                                    <B.Category name="Texto" colour="20">
                                        <B.Block type="text" />
                                        <B.Block type="text_print" />
                                        <B.Block type="text_prompt" />
                                    </B.Category>
                                    <B.Category name="Variáveis" colour="330" custom="VARIABLE"></B.Category>
                                    <B.Category name="Lógica" colour="210">
                                        <B.Block type="controls_if" />
                                        <B.Block type="controls_ifelse" />
                                        <B.Block type="logic_compare" />
                                        <B.Block type="logic_operation" />
                                        <B.Block type="logic_boolean" />
                                        <B.Block type="logic_null" />
                                        <B.Block type="logic_ternary" />
                                    </B.Category>
                                    <B.Category name="Laços" colour="120">
                                        <B.Block type="controls_for" />
                                        <B.Block type="controls_whileUntil" />
                                        <B.Block type="controls_repeat_ext">
                                        <B.Value name="TIMES">
                                            <B.Shadow type="math_number">
                                            <B.Field name="NUM">10</B.Field>
                                            </B.Shadow>
                                        </B.Value>
                                        </B.Block>
                                    </B.Category>
                                    <B.Category name="Matemática" colour="230">
                                        <B.Block type="math_number" />
                                        <B.Block type="math_arithmetic" />
                                        <B.Block type="math_single" />
                                        <B.Block type="math_round" />
                                    </B.Category>
                                    <B.Category name="Funções" colour="290" custom="PROCEDURE"></B.Category>
                                </B.BlocklyComponent>
                            ) : (
                                <AceEditorWrapper
                                    mode={language}
                                    theme={theme}
                                    focus={false}
                                    readOnly={true}
                                    value={currentAnswer.answer || ""}
                                    fontSize={14}
                                    width="100%"
                                    showPrintMargin={false}
                                    name="ACE_EDITOR"
                                    showGutter={true}
                                    highlightActiveLine={true}
                                />
                            )}
                        </Card>
                    </Col>
                    
                    {/*gabarito
                      <Col className='col-6'>
                        <Card>
                            {loadingQuestions ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : language === 'blockly' ? (
                                <B.BlocklyComponent
                                    ref={this.simpleWorkspace}
                                    readOnly={true}
                                    trashcan={true}
                                    media={'media/'}
                                    move={{
                                        scrollbars: true,
                                        drag: true,
                                        wheel: true
                                    }}
                                    initialXml={isXml(currentAnswer.answer) ? currentAnswer.answer : ''}>
                                    <B.Category name="Texto" colour="20">
                                        <B.Block type="text" />
                                        <B.Block type="text_print" />
                                        <B.Block type="text_prompt" />
                                    </B.Category>
                                    <B.Category name="Variáveis" colour="330" custom="VARIABLE"></B.Category>
                                    <B.Category name="Lógica" colour="210">
                                        <B.Block type="controls_if" />
                                        <B.Block type="controls_ifelse" />
                                        <B.Block type="logic_compare" />
                                        <B.Block type="logic_operation" />
                                        <B.Block type="logic_boolean" />
                                        <B.Block type="logic_null" />
                                        <B.Block type="logic_ternary" />
                                    </B.Category>
                                    <B.Category name="Laços" colour="120">
                                        <B.Block type="controls_for" />
                                        <B.Block type="controls_whileUntil" />
                                        <B.Block type="controls_repeat_ext">
                                        <B.Value name="TIMES">
                                            <B.Shadow type="math_number">
                                            <B.Field name="NUM">10</B.Field>
                                            </B.Shadow>
                                        </B.Value>
                                        </B.Block>
                                    </B.Category>
                                    <B.Category name="Matemática" colour="230">
                                        <B.Block type="math_number" />
                                        <B.Block type="math_arithmetic" />
                                        <B.Block type="math_single" />
                                        <B.Block type="math_round" />
                                    </B.Category>
                                    <B.Category name="Funções" colour="290" custom="PROCEDURE"></B.Category>
                                </B.BlocklyComponent>
                            ) : (
                                <div id='codeEditor'>
                                    <AceEditorWrapper
                                        mode={language}
                                        theme={theme}
                                        focus={false}
                                        value={currentQuestion.solution}
                                        fontSize={14}
                                        width="100%"
                                        showPrintMargin={false}
                                        name="ACE_EDITOR"
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        readOnly={true}
                                    />
                                </div>
                            )}
                        </Card>
                    </Col>*/}
                    <Col className='col-6'>
                        <Card className="card-results">
                            <CardHead>
                                {loadingCurrentAnswer ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                                ) : (
                                    <CardTitle>
                                    Observações
                                    {currentQuestion.reviewed ? (
                                        
                                        <label
                                            style={{
                                            color: "green",
                                            fontSize: "16px",
                                            marginLeft: "15px",
                                            }}
                                            htmlFor="selectDifficulty"
                                        >
                                            (Corrigido!)
                                        </label>
                                    ) : (
                                        <label
                                            style={{
                                                color: "#c88d04",
                                                fontSize: "16px",
                                                marginLeft: "15px",
                                            }}
                                            htmlFor="selectDifficulty"
                                        >
                                            (Ainda nâo corrigido)
                                        </label>

                                        )}
                                    </CardTitle>
                                )}
                            </CardHead>
                        <CardBody className="p-0">
                            {loadingCurrentAnswer ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : (
                                <form
                                    className="form-group"
                                    style={{ marginRight: "5px", marginLeft: "5px" }}
                                >
                                <Row>
                                    <Col className='col-6' >
                                        <label htmlFor="selectDifficulty">Nota do Sistema:</label>
                                        <input
                                            readOnly
                                            style={{ textAlign: "center" }}
                                            className={"form-control"}
                                            type={"text"}
                                            maxLength={"5"}
                                            value={parseFloat(correction.hitPercentage).toFixed(2)}
                                        ></input>
                                    </Col>

                                    <Col className='col-6'>
                                        <label htmlFor="selectDifficulty">
                                            Nota do professor:
                                        </label>
                                        <input
                                            style={{ textAlign: "center" }}
                                            className='form-control'
                                            type={"text"}
                                            maxLength={"5"}
                                            value={currentQuestionFeedback.teacherGrade || ""}
                                            readOnly
                                        ></input>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: "10px" }}>
                                    <Col className='col-6'>
                                        <label htmlFor="selectDifficulty">
                                            Tempo gasto na questão:
                                        </label>
                                        <input
                                            readOnly
                                            style={{ textAlign: "center" }}
                                            className={"form-control"}
                                            type={"text"}
                                            value={` ${parseInt(currentAnswer.timeConsuming / 1000 / 60 )} min 
                                                     ${parseInt((currentAnswer.timeConsuming / 1000) % 60)} seg`}
                                        ></input>
                                    </Col>
                                    
                                    <Col className='col-6'>
                                        <label htmlFor="selectDifficulty">
                                            Nº de variação de caracteres:
                                        </label>
                                        <input
                                            readOnly
                                            style={{ textAlign: "center" }}
                                            className={"form-control"}
                                            type={"text"}
                                            value={parseFloat(currentAnswer.char_change_number)}
                                        ></input>
                                    </Col>
                                </Row>

                                <label
                                    className="form-label"
                                    style={{ marginLeft: "10px", marginTop: "5px" }}
                                >
                                    Comentário da questão:
                            </label>
                                <textarea
                                    className="form-control"
                                    name="example-textarea-input"
                                    rows="6"
                                    placeholder="Nenhum comentário"
                                    onChange={(e) => this.commentQuestion(e)}
                                    value={currentQuestionFeedback.comments}
                                    readOnly
                                ></textarea>

                                <div
                                    className="custom-controls-stacked"
                                    style={{ marginTop: "20px" }}
                                >
                                    <Row>
                                    <Col className='col-6'>
                                        <label className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                name="compilation_error"
                                                checked={currentQuestionFeedback.compilation_error}
                                                readOnly
                                            />
                                            <span className="custom-control-label">
                                                Erro de compilação
                                            </span>
                                        </label>
                                        <label className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                name="runtime_error"
                                                checked={currentQuestionFeedback.runtime_error}
                                                readOnly
                                            />
                                            <span className="custom-control-label">
                                                Erro de execução
                                            </span>
                                        </label>
                                        <label className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                name="presentation_error"
                                                checked={currentQuestionFeedback.presentation_error}
                                                readOnly
                                            />
                                            <span className="custom-control-label">
                                                Erro de apresentação
                                            </span>
                                        </label>
                                    </Col>
                                    <Col className='col-6'>
                                        <label className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                name="wrong_answer"
                                                checked={currentQuestionFeedback.wrong_answer}
                                                readOnly
                                            />
                                            <span className="custom-control-label">
                                                Resposta errada
                                            </span>
                                        </label>
                                        <label className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                name="invalid_algorithm"
                                                checked={currentQuestionFeedback.invalid_algorithm}
                                                readOnly
                                            />
                                            <span className="custom-control-label">
                                                Algoritimo inválido
                                            </span>
                                        </label>
                                    </Col>
                                    </Row>
                                </div>
                                </form>
                            )}
                        </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
            }
            <Row>
                {currentQuestion.type === 'PROGRAMMING' &&
                    <Col className='col-12'>
                    <Card className="card-results">
                        <CardHead>
                            {loadingQuestions ? (
                                <div className="loader" style={{ margin: "0px auto" }}></div>
                            ) : (
                                <CardTitle>Resultados</CardTitle>
                            )}
                        </CardHead>
                        {isCorrecting ? (
                            <div className="loader" style={{ margin: "100px auto" }}></div>
                        ) : correction.descriptionErro ? (
                            <Card>
                                {loadingQuestions ? (
                                    <div className="loader" style={{ margin: "0px auto" }}></div>
                                ) : (
                                    <CardBody className=" p-0 ">
                                        <div className="alert alert-icon alert-danger" role="alert">
                                            <HTMLFormat>{correction.descriptionErro}</HTMLFormat>
                                        </div>
                                    </CardBody>
                                )}
                            </Card>
                        ) : (
                            <>
                                { correction.results && correction.results.map((teste, i) => (
                                <Card
                                    key={i}
                                    className={`card-status-${teste.isMatch ? "success" : "danger"
                                    }`}
                                >
                                    <CardHead>
                                    <CardTitle>
                                        {`${i + 1}° Teste `}
                                        {teste.isMatch ? (
                                        <i
                                            className="fa fa-smile-o"
                                            style={{ color: "green" }}
                                        />
                                        ) : (
                                            <i
                                            className="fa fa-frown-o"
                                            style={{ color: "red" }}
                                            />
                                        )}
                                    </CardTitle>
                                    <CardOptions>
                                        <i
                                        title="Ver descrição"
                                        style={{
                                            color: "blue",
                                            cursor: "pointer",
                                            fontSize: "25px",
                                        }}
                                        className={`fe fe-chevron-down`}
                                        data-toggle="collapse"
                                        data-target={"#collapse" + i}
                                        aria-expanded={false}
                                        />
                                    </CardOptions>
                                    </CardHead>
                                    <div className="collapse" id={"collapse" + i}>
                                    <CardBody className="p-0 overflow-auto">
                                        {teste.descriptionErro ? (
                                        <HTMLFormat>{`${teste.descriptionErro}`}</HTMLFormat>
                                        ) : (
                                            <table
                                            className="table"
                                            wrap="off"

                                            >
                                            <tbody>
                                                <tr>
                                                <td>
                                                    <b>Entrada(s) para teste</b>
                                                </td>
                                                <td>
                                                    <b>Saída do seu programa</b>
                                                </td>
                                                <td>
                                                    <b>Saída esperada</b>
                                                </td>
                                                </tr>
                                                <tr>
                                                <td>
                                                    <HTMLFormat>{teste.inputs}</HTMLFormat>
                                                </td>
                                                <td>
                                                    <HTMLFormat>{teste.saidaResposta}</HTMLFormat>
                                                </td>
                                                <td>
                                                    <HTMLFormat>{teste.output}</HTMLFormat>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        )}
                                    </CardBody>
                                    </div>
                                </Card>
                                ))}
                            </>
                            )}
                    </Card>
                    </Col>
                }
                {/*antigo
                <Col xs={12} md={6}>
                    <Card className="card-results">
                    <CardHead>
                        {loadingQuestions ? (
                        <div className="loader" style={{ margin: "0px auto" }}></div>
                        ) : (
                            <CardTitle>
                            Feed Back
                            {corrected ? (
                                <>
                                <label
                                    style={{
                                    color: "green",
                                    fontSize: "16px",
                                    marginLeft: "15px",
                                    }}
                                    htmlFor="selectDifficulty"
                                >
                                    (Nota editada)
                            </label>
                                </>
                            ) : (
                                <>
                                    <label
                                    style={{
                                        color: "#c88d04",
                                        fontSize: "16px",
                                        marginLeft: "15px",
                                    }}
                                    htmlFor="selectDifficulty"
                                    >
                                    (Nota não editada)
                            </label>

                                </>
                                )}
                            </CardTitle>
                        )}
                    </CardHead>
                    <CardBody className=" p-0 ">
                        {loadingQuestions ? (
                        <div className="loader" style={{ margin: "0px auto" }}></div>
                        ) : (
                            <form
                            className="form-group"
                            style={{ marginRight: "5px", marginLeft: "5px" }}
                            >
                            <Row>
                                <Col xs={10} md={4}>
                                <label htmlFor="selectDifficulty">Nota do Sistema:</label>
                                <input
                                    readOnly
                                    style={{ textAlign: "center" }}
                                    className={"form-control"}
                                    type={"text"}
                                    maxLength={"5"}
                                    value={parseFloat(hitPercentage).toFixed(2)}
                                ></input>
                                </Col>

                                <Col xs={10} md={4}>
                                <label htmlFor="selectDifficulty">
                                    Nota do professor:
                                </label>
                                <input
                                    style={{ textAlign: "center" }}
                                    className={`form-control ${parseFloat(teacherNote) > 10 ||
                                    parseFloat(teacherNote) < 0 ||
                                    isNaN(parseFloat(teacherNote))
                                    ? "is-invalid"
                                    : "is-valid"
                                    }`}
                                    onChange={(e) => this.funcTeacherNote(e)}
                                    type={"text"}
                                    maxLength={"5"}
                                    value={teacherNote || ""}
                                ></input>
                                </Col>

                                <Col xs={10} md={4}>
                                <label htmlFor="rascunho">&nbsp;</label>
                                <button
                                    style={{ width: "100%" }}
                                    className={"btn btn-azure"}
                                    onClick={(e) => this.SaveData(e)}
                                >
                                    <i className="fa fa-floppy-o" />
                                &nbsp;&nbsp; Salvar Dados
                            </button>
                                </Col>
                            </Row>

                            <Row style={{ marginTop: "10px" }}>
                                <Col xs={10} md={6}>
                                <label htmlFor="selectDifficulty">
                                    Tempo gasto na questão:
                                </label>
                                <input
                                    readOnly
                                    style={{ paddingRight: "14px" }}
                                    className={"form-control"}
                                    type={"text"}
                                    maxLength={"5"}
                                    value={`
                                ${parseInt(
                                    timeConsuming / 1000 / 60
                                    )} min ${parseInt(
                                    (timeConsuming / 1000) % 60
                                    )} seg`}
                                ></input>
                                </Col>

                                {!!char_change_number && <Col xs={10} md={6}>
                                <label htmlFor="selectDifficulty">
                                    Nº de variação de caracteres:
                            </label>
                                <input
                                    readOnly
                                    style={{ textAlign: "center" }}
                                    className={"form-control"}
                                    type={"text"}
                                    maxLength={"5"}
                                    value={parseFloat(char_change_number)}
                                ></input>
                                </Col>}
                            </Row>

                            <label
                                className="form-label"
                                style={{ marginLeft: "10px", marginTop: "5px" }}
                            >
                                Comentário da questão:
                        </label>
                            <textarea
                                className="form-control"
                                name="example-textarea-input"
                                rows="6"
                                placeholder="Digite.."
                                onChange={(e) => this.commentQuestion(e)}
                                value={comments}
                            ></textarea>

                            <div
                                className="custom-controls-stacked"
                                style={{ marginTop: "20px" }}
                            >
                                <Row>
                                <Col xs={12} md={6}>
                                    <label className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="compilation_error"
                                        checked={compilation_error}
                                        onChange={() => this.checkBox1()}
                                    />
                                    <span className="custom-control-label">
                                        Erro em tempo de compilação
                                </span>
                                    </label>
                                    <label className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="runtime_error"
                                        checked={runtime_error}
                                        onChange={() => this.checkBox2()}
                                    />
                                    <span className="custom-control-label">
                                        Erro em tempo de execução
                                </span>
                                    </label>
                                    <label className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="presentation_error"
                                        checked={presentation_error}
                                        onChange={() => this.checkBox3()}
                                    />
                                    <span className="custom-control-label">
                                        Erro de apresentação
                                </span>
                                    </label>
                                </Col>
                                <Col xs={12} md={6}>
                                    <label className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="wrong_answer"
                                        checked={wrong_answer}
                                        onChange={() => this.checkBox4()}
                                    />
                                    <span className="custom-control-label">
                                        Resposta errada
                                </span>
                                    </label>
                                    <label className="custom-control custom-checkbox">
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        name="invalid_algorithm"
                                        checked={invalid_algorithm}
                                        onChange={() => this.checkBox5()}
                                    />
                                    <span className="custom-control-label">
                                        Algoritimo inválido
                                </span>
                                    </label>
                                </Col>
                                </Row>
                            </div>
                            </form>
                        )}
                    </CardBody>
                    </Card>
                </Col>*/}
            </Row>
            <Row>
                <Col xs={12}>
                    {
                        questions.map((question, index) =>
                            <button
                                key={question.id}
                                onClick={() => setCurrentQuestionIdx(index)}
                                //onClick={()=>this.handleQuestion(`/professor/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}/submissoes`,question.id)}
                                className={`btn ${String(index) === idQuestion ? 'btn-primary disabled' : 'btn-outline-primary'} mr-5 mb-5`}
                            >
                                {question.title}
                            </button>
                        )
                    }
                </Col>
            </Row>
        </TemplateSistema>
    );
}

export default FeedbackProva;
