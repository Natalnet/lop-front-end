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
    const idTest = useMemo(() => props.match.params.idTest, [props]);
    const idQuestion = useMemo(() => props.match.params.idQuestion, [props]);

    const { getClass, isLoadingClass, classRoon } = useClass();


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
                                                          reviewed : false,
                                                          language : ''
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
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(idQuestion);

    const [theme, setTheme] = useState(themesAceEditor[0]);

    useEffect( () => {
        if (idClass) {
            getClass(idClass);
        }
    }, [idClass]);


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
        }
        
        fetchQuestions();
    }, [idClass,idTest]);


    /*atualiza endereço do navegador */
    useEffect ( () => {
        props.history.push(`/aluno/turma/${idClass}/prova/${idTest}/feedback/${currentQuestionIdx}`);
    },[currentQuestionIdx]);

    useEffect ( () => {

        if(loadingQuestions) //ignora se ainda esta carregando
            return;
 
        setLoadingCurrentAnswer(true);
        //if (loading) this.setState({ loadingquestion: true });
        const question = questions[idQuestion];
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
            setCurrentAnswer({
                answer : question.lastSubmission.answer !== '' ? question.lastSubmission.answer : '',
                hitPercentage: question.lastSubmission.hitPercentage ? ( question.lastSubmission.hitPercentage / 10).toFixed(2) : 0,
                timeConsuming: question.lastSubmission.timeConsuming ? question.lastSubmission.timeConsuming : 0,
                char_change_number: question.lastSubmission.char_change_number ? question.lastSubmission.char_change_number : 0,
                reviewed : question.feedBackTest ? question.feedBackTest.isEditedByTeacher : false,
                language : question.lastSubmission.language ? question.lastSubmission.language : classRoon.languages[0]
            });
        }
        else {
            setCurrentAnswer({
                answer: undefined,
                hitPercentage: ( question.lastSubmission.hitPercentage / 10).toFixed(2),
                timeConsuming: 0,
                char_change_number: 0,
                reviewed : false,
                language : classRoon.languages[0]
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
        

    },[questions, idQuestion, loadingQuestions]);
   
    useEffect( () => {
        testAnswer(null);
    },[currentAnswer]);


    
    /*apenas testa a resposta sem gravar no banco*/
    async function testAnswer(e) {

        if(e)
            e.preventDefault();
        //const { answer, language, results } = state;
        
        
        
        const request = {
            codigo: currentAnswer.language === "blockly" ? getBlocklyCode(simpleWorkspace.current.workspace) : currentAnswer.answer,
            linguagem: currentAnswer.language === "blockly" ? 'python' : currentAnswer.language,
            results: currentQuestion.results,
        };

        setCorrecting(true);
        try {
            if(currentAnswer.answer){
                
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
                        {loadingCurrentAnswer ? (
                            <div className="loader" style={{ margin: "0px auto" }}></div>
                        ) : (
                            <select className="form-control" readOnly>
                                <option> {SupportedLanguages.niceNames[SupportedLanguages.list.indexOf(currentAnswer.language)] }</option>
                            </select>
                        )}
                    </Col>
                    <Col className='col-2'>
                        <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
                        <select
                            defaultValue="monokai"
                            className="form-control"
                            onChange={(e) => {setTheme(e.target.value); }}
                        >
                            {themesAceEditor.map((theme) => (
                                <option key={theme} value={theme}>
                                    {theme}
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
                            ) : currentAnswer.language === 'blockly' ? (
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
                                    mode={currentAnswer.language}
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
