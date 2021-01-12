import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { BlockMath } from "react-katex";
import Swal from "sweetalert2";
import api, { baseUrlBackend } from "../../services/api";
import apiCompiler from "../../services/apiCompiler";
import AceEditorWrapper, { themesAceEditor } from "../templates/aceEditorWrapper.template"
import HTMLFormat from "../ui/htmlFormat";
import { Card, CardBody, CardHead, CardTitle, CardOptions } from '../ui/card';
import Radio from '@material-ui/core/Radio';
import { Row, Col } from '../ui/grid';
import * as B from "../ui/blockly";
import { getBlocklyCode, getBlocklyXML, findLocalIp, isXml } from '../../util/auxiliaryFunctions.util';
import SupportedLanguages from "../../config/SupportedLanguages";
import socket from "socket.io-client";
import useAccess from '../../hooks/useAccess';
import useQuestion from '../../hooks/useQuestion';
import useSubmission from '../../hooks/useSubmission';
import useClass from '../../hooks/useClass';
import useDifficulty from '../../hooks/useDifficulty';
import useList from '../../hooks/useList';
import useTest from '../../hooks/useTest';
import { IoMdEye } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { Load } from '../ui/load';
const QuestionSubcscreen = props => {

    const idQuestion = useMemo(() => props.match.params.idQuestion, [props]);
    const idClass = useMemo(() => props.match.params.idClass, [props]);
    const idList = useMemo(() => props.match.params.idList, [props]);
    const idTest = useMemo(() => props.match.params.idTest, [props]);

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);

    const { saveAccess } = useAccess();
    const { getClass, isLoadingClass, classRoon } = useClass();
    const { getIconTypeQuestion, getQuestion, isLoadingQuestion, question } = useQuestion();
    const { saveSubmissionByObjectiveQuestion, saveSubmissionByDiscursiveQuestion, isSavingSubmission } = useSubmission();
    const { saveDifficulty, isSavingDifficulty } = useDifficulty();
    const { getList, list, isLoadingList } = useList();
    const { getTest, test, isLoadingTest } = useTest();

    //questions propertys
    const [solution, setSolution] = useState('');
    const [char_change_number, setCharChangeNumber] = useState(0);
    const [oldTimeConsuming, setOldTimeConsuming] = useState(0);

    //class propertys
    const [language, setLanguage] = useState(SupportedLanguages.list[0]);
    const [languages, setLanguages] = useState(SupportedLanguages.list);

    const [loadingReponse, setLoadingReponse] = useState(false);
    const [response, setResponse] = useState([]);
    const [descriptionErro, setDescriptionErro] = useState(null);
    const [startTime, setStartTime] = useState(new Date());
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [statusTest, setStatusTest] = useState('ABERTA');
    const [themeAceEditor, setThemeAceEditor] = useState(themesAceEditor[0]);

    const simpleWorkspace = useRef(null);
    const editorEnunciateRef = useRef(null);
    const editorRef = useRef([]);
    
    const latestSolution = useRef(solution);
    const latestChar_change_number = useRef(char_change_number);
    const latestLanguage = useRef(language);
    const typeQuestion = useRef('');

    const isTeacher = useCallback(() => {
        return profile === 'professor'
    }, [profile])

    const testCases = useMemo(() =>
        isTeacher() || (test && test.classHasTest.showAllTestCases) ?
            response
            :
            response.filter((t, i) => i === 0)
        , [test, response, isTeacher])

    useEffect(() => {
        latestSolution.current = solution;
        latestChar_change_number.current = char_change_number;
        latestLanguage.current = language;
        typeQuestion.current = question ? question.type : '';
    }, [solution, char_change_number, language, question]);

    useEffect(() => {
        saveAccess(idQuestion);
        getQuestion(idQuestion, {
            idClass,
            idList,
            idTest,
        })
        if (idClass) {
            getClass(idClass);
        }
        if (idList) {
            getList(idList, {
                idClass
            })
        }
        if (idTest) {
            getTest(idTest, {
                idClass
            })
        }
        setStartTime(new Date());
        const idInterval = setInterval(() => {
            saveDraft(false);
        }, 60 * 1000);//60 segundos
        return () => clearInterval(idInterval);
    }, []);


    useEffect(() => {
        let io;
        if (idTest) {
            io = socket.connect(baseUrlBackend);
            io.emit("connectRoonClass", idClass);
            io.on("changeStatusTest", (reponse) => {
                console.log('realtime:', reponse)
                setStatusTest(reponse.status)
            });
        }
        return () => io && io.disconnect();
    }, [])

    useEffect(() => {
        if (question) {
            setSolution(question.questionDraft ? question.questionDraft.answer : '');
            setCharChangeNumber(question.questionDraft ? question.questionDraft.char_change_number : 0);
            setOldTimeConsuming(question.lastSubmission ? question.lastSubmission.timeConsuming : 0)

            document.title = question.title;
        }
    }, [question]);

    useEffect(() => {
        if (classRoon) {
            setLanguage(classRoon.languages[0]);
            setLanguages(classRoon.languages);
        }
    }, [classRoon])

    const saveDraft = useCallback(async (showMsg = true) => {
        if (typeQuestion.current === 'PROGRAMAÇÃO' || typeQuestion.current === 'DISCURSIVA') {
            const request = {
                answer: (latestLanguage.current) === "blockly" ? getBlocklyXML(simpleWorkspace.current.workspace) : latestSolution.current,
                char_change_number: latestChar_change_number.current,
                idQuestion,
                idClass,
                idList,
                idTest,
            };
            try {
                setIsSavingDraft(true)
                await api.post(`/draft/store`, request);
                if (showMsg) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Rascunho salvo com sucesso!",
                    });
                }
            } catch (err) {
                console.log(err);
            }
            setIsSavingDraft(false)
        }
    }, [idQuestion, idClass, idList, idTest]);


    const saveSubmission = useCallback(async (
        { codigo, linguagem },
        hitPercentage,
        timeConsuming,
        char_change_number
    ) => {
        try {
            const ip = await findLocalIp(false);
            //console.log('idquestion: ',idQuestion)
            const request = {
                answer: language === "blockly" ? getBlocklyXML(simpleWorkspace.current.workspace) : codigo,
                language: language === "blockly" ? "blockly" : linguagem,
                hitPercentage,
                timeConsuming,
                ip: ip[0],
                environment: "desktop",
                char_change_number,
                idQuestion,
                idClass,
                idList,
                idTest,
            };
            await api.post(`/submission/store`, request);
        } catch (err) {
            console.log(err);
            throw err;
        }
        setStartTime(new Date())
    }, [language, idQuestion, idClass, idList, idTest]);

    const handleSubmitProgrammingQuestion = useCallback(async () => {
        if (statusTest === "FECHADA") {
            Swal.fire({
                type: "error",
                title: "O professor recolheu a prova! :'(",
            });
            return null;
        }
        const timeConsuming = (new Date() - startTime) + oldTimeConsuming;
        const request = {
            codigo: language === "blockly" ? getBlocklyCode(simpleWorkspace.current.workspace) : solution,
            linguagem: language === "blockly" ? 'python' : language,
            results: question.results,
        };
        setLoadingReponse(true);

        try {
            saveDraft(false);
            const response = await apiCompiler.post("/apiCompiler", request);
            await saveSubmission(
                request,
                response.data.percentualAcerto,
                timeConsuming,
                char_change_number
            );
            setLoadingReponse(false)
            setResponse(response.data.results);
            setDescriptionErro(response.data.descriptionErro);
        } catch (err) {
            setLoadingReponse(false)
            console.log(Object.getOwnPropertyDescriptors(err));
            Swal.fire({
                type: "error",
                title: "ops... Algum erro aconteceu na operação :(",
            });
            console.log(err);
        }

    }, [language, question, char_change_number, startTime, oldTimeConsuming, simpleWorkspace, solution, statusTest, saveDraft, saveSubmission])

    const handleSubmitObjectiveQuestion = useCallback(async () => {
        if (statusTest === "FECHADA") {
            Swal.fire({
                type: "error",
                title: "O professor recolheu a prova! :'(",
            });
            return null;
        }
        const timeConsuming = (new Date() - startTime) + oldTimeConsuming;
        const ip = await findLocalIp(false);
        const isSaved = await saveSubmissionByObjectiveQuestion({
            answer: latestSolution.current,
            timeConsuming,
            ip: ip[0],
            environment: "desktop",
            idQuestion,
            idList,
            idTest,
            idClass
        });
        if (isSaved) {
            getQuestion(idQuestion, {
                idClass,
                idList,
                idTest,
            })
        }
    }, [idQuestion, idClass, idList, idTest, statusTest, startTime, oldTimeConsuming, saveSubmissionByObjectiveQuestion, getQuestion]);

    const handleSubmitDiscursiveQuestion = useCallback(async () => {
        if (statusTest === "FECHADA") {
            Swal.fire({
                type: "error",
                title: "O professor recolheu a prova! :'(",
            });
            return null;
        }
        saveDraft(false);
        const timeConsuming = (new Date() - startTime) + oldTimeConsuming;
        const ip = await findLocalIp(false);
        const isSaved = await saveSubmissionByDiscursiveQuestion({
            answer: latestSolution.current,
            timeConsuming,
            ip: ip[0],
            char_change_number,
            environment: "desktop",
            idQuestion,
            idList,
            idTest,
            idClass
        });
        if (isSaved) {
            getQuestion(idQuestion, {
                idClass,
                idList,
                idTest,
            })
        }
    }, [idQuestion, idClass, idList, idTest, statusTest, startTime, char_change_number, oldTimeConsuming, saveSubmissionByDiscursiveQuestion, getQuestion]);


    const handleDifficulty = useCallback(async (e) => {
        saveDifficulty({
            idQuestion,
            difficulty: e.target ? e.target.value : ''
        })
    }, [saveDifficulty, idQuestion])

    if ((isLoadingQuestion || !question)) {
        return <Load />;
    }

    if (idClass && (isLoadingClass || !classRoon)) {
        return <Load />;
    }

    if (idList && (isLoadingList || !list)) {
        return <Load />;
    }

    if (idTest && (isLoadingTest || !test)) {
        return <Load />;
    }

    return (
        <>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <h5 className='m-0'>
                        {idClass ?
                            <>
                                <i className="fa fa-users mr-2" aria-hidden="true" />
                                {classRoon.name} - {classRoon.year}.{classRoon.semester}
                            </>
                            :
                            <Link to={`/${profile}/exercicios`}>Exercícios</Link>
                        }
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        {
                            idList && (
                                <>
                                    <Link to={`/${profile}/turma/${idClass}/listas`}>
                                        Listas
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                    <Link
                                        to={`/${profile}/turma/${idClass}/lista/${idList}`}
                                    >
                                        {list.title}
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                </>
                            )
                        }
                        {
                            idTest && (
                                <>
                                    <Link to={`/${profile}/turma/${idClass}/provas`}>
                                        Provas
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                    <Link
                                        to={`/${profile}/turma/${idClass}/prova/${idTest}`}
                                    >
                                        {test.title}
                                    </Link>
                                    <i className="fa fa-angle-left ml-2 mr-2" />
                                </>
                            )
                        }
                        {question.title}
                    </h5>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col className='col-12'>
                    <Card
                        style={{
                            borderLeft: '3px solid #467fcf'
                        }}
                    >
                        <CardHead>
                            <CardTitle>
                                <p
                                    className='d-flex m-0 font-weight-bold'
                                >
                                    {
                                        getIconTypeQuestion(question.type)
                                    }
                                    {question.title}
                                </p>
                            </CardTitle>
                        </CardHead>
                        <CardBody className="overflow-auto">
                            <Row>
                                <Col className={`col-12 col-md-${question.type === 'PROGRAMAÇÃO' ? '7' : '12'}`}>
                                    <div ref={(el) => editorEnunciateRef.current = el} className='w-100'>
                                        <SunEditor
                                            lang="pt_br"
                                            height="auto"
                                            disable={true}
                                            showToolbar={false}
                                            // onChange={this.handleDescriptionChange.bind(this)}
                                            setContents={question.description}
                                            setDefaultStyle="font-size: 15px; text-align: justify"
                                            onLoad={() => {
                                                editorEnunciateRef.current.classList.add('sun-editor-wrap')
                                            }}
                                            setOptions={{
                                                toolbarContainer: '#toolbar_container',
                                                resizingBar: false,
                                                katex: katex,
                                            }}
                                        />
                                    </div>
                                    {question.katexDescription && (
                                        <BlockMath>{question.katexDescription}</BlockMath>
                                    )}
                                </Col>
                                {question.type === 'PROGRAMAÇÃO' && (
                                    <Col className='col-12 col-md-5'>
                                        <table
                                            className="table table-exemplo"
                                            style={{
                                                border: "1px solid rgba(0, 40, 100, 0.12)"
                                            }}
                                        >
                                            <tbody >
                                                <tr>
                                                    <td className="pt-0">
                                                        <b>Exemplo de entrada</b>
                                                    </td>
                                                    <td className="pt-0">
                                                        <b>Exemplo de saída</b>
                                                    </td>
                                                </tr>
                                                {question.results
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
                                )
                                }

                                <Col className='col-12'>
                                    <div className="d-flex flex-column">
                                        <ul className="d-flex align-items-center mt-0 p-0">
                                            <li
                                                className="d-flex mr-4 align-items-center"
                                                title={`N° DE ACESSOS`}
                                            >
                                                {/* <i className="fa fa-users mr-1" /> */}
                                                <IoMdEye className="mr-1" />
                                                {question.accessCount}
                                            </li>
                                            <li
                                                className="d-flex  mr-4 align-items-center"
                                                title={`N° DE SUBMISSÕES CORRETAS`}
                                            >
                                                <i className="fa fa-gears mr-1 text-success" />
                                                {question.submissionsCorrectsCount}
                                            </li>
                                            <li
                                                className="d-flex  mr-4 align-items-center"
                                                title={`N° DE SUBMISSÕES`}
                                            >
                                                <i className="fa fa-gears mr-1" />
                                                {question.submissionsCount}
                                            </li>
                                        </ul>
                                        {question.author && <p
                                            className="font-italic mb-0"
                                        >
                                            <b>Autor(a):</b> {question.author.email}
                                        </p>}
                                    </div>
                                </Col>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {question.type === 'PROGRAMAÇÃO' && (
                <>
                    <Row className='mb-4'>
                        <Col className='col-12 col-md-2'>
                            <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
                            <select className="form-control" onChange={e => setLanguage(e.target.value)}>
                                {languages.map(lang => {
                                    const languageIdx = SupportedLanguages.list.indexOf(lang);
                                    return (
                                        <option key={lang} value={lang}>
                                            {SupportedLanguages.niceNames[languageIdx]}
                                        </option>
                                    )
                                })
                                }
                            </select>
                        </Col>
                        <Col className='col-12 col-md-2'>
                            <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
                            <select defaultValue={themeAceEditor} className="form-control" onChange={(e) => setThemeAceEditor(e.target.value)}>
                                {
                                    themesAceEditor.map(thene => (
                                        <option key={thene} value={thene}>{thene}</option>
                                    ))
                                }
                            </select>
                        </Col>
                        <Col className='col-12 col-md-3'>
                            <label htmlFor="selectDifficul">&nbsp;</label>
                            <button
                                className={`w-100 btn btn-primary ${loadingReponse && 'btn-loading'}`}
                                onClick={() => {
                                    if (question.type === 'PROGRAMAÇÃO') {
                                        handleSubmitProgrammingQuestion();
                                    }
                                    else {

                                    }
                                }}>
                                <i className="fa fa-play" /> <i className="fa fa-gears mr-2" />Submeter
                        </button>
                        </Col>
                        <Col className='col-5 col-md-3'>
                            <label htmlFor="rascunho">&nbsp;</label>
                            <button
                                style={{ width: "100%" }}
                                className={`btn btn-azure ${isSavingDraft &&
                                    "btn-loading"}`}
                                onClick={saveDraft}
                            >
                                <i className="fa fa-floppy-o" />
                            &nbsp;&nbsp; Salvar rascunho
                        </button>
                        </Col>

                        <Col className='col-5 col-md-2'>
                            <label htmlFor="selectDifficulty">Dificuldade: </label>
                            <select
                                defaultValue={question.userDifficulty || ''}
                                className="form-control"
                                id="selectDifficulty"
                                disabled={isSavingDifficulty ? "disabled" : ""}
                                onChange={e => handleDifficulty(e)}
                            >
                                <option value={""}></option>
                                <option value='1' >Muito fácil</option>
                                <option value='2' >Fácil</option>
                                <option value='3' >Médio</option>
                                <option value='4' >Difícil</option>
                                <option value='5' >Muito difícil</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='col-12'>
                            <Card>
                                {language === 'blockly' ?
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
                                        initialXml={isXml(solution) ? solution : ''}>
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
                                    :
                                    <AceEditorWrapper
                                        mode={language}
                                        theme={themeAceEditor}
                                        focus={false}
                                        onChange={newValue => {
                                            setSolution(newValue);
                                            setCharChangeNumber(oldCharChangeNumber => oldCharChangeNumber + 1);
                                        }}
                                        value={solution}
                                        fontSize={14}
                                        width="100%"
                                        name="ACE_EDITOR"
                                        showPrintMargin={false}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        setOptions={{
                                            enableSnippets: true,
                                            showLineNumbers: true,
                                            tabSize: 2,
                                        }}

                                    />
                                }
                            </Card>
                        </Col>
                        <Col className='col-12'>
                            <Card className="card-results">
                                <CardHead>
                                    <CardTitle>Resultados</CardTitle>
                                </CardHead>
                                {loadingReponse ? (
                                    <div className="loader" style={{ margin: "100px auto" }}></div>
                                ) : (
                                        descriptionErro ?
                                            <Card>
                                                <CardBody className=" p-0 ">
                                                    <div className="alert alert-icon alert-danger" role="alert">
                                                        <HTMLFormat>
                                                            {descriptionErro}
                                                        </HTMLFormat>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                            :
                                            <>
                                                {testCases.map((teste, i) =>
                                                    <Card key={i} className={`card-status-${teste.isMatch ? 'success' : 'danger'}`}>
                                                        <CardHead>
                                                            <CardTitle>
                                                                {`${i + 1}° Teste `}
                                                                {teste.isMatch ?
                                                                    <i className="fa fa-smile-o" style={{ color: 'green' }} />
                                                                    :
                                                                    <i className="fa fa-frown-o" style={{ color: 'red' }} />
                                                                }
                                                            </CardTitle>
                                                            <CardOptions>
                                                                <i
                                                                    title='Ver descrição'
                                                                    style={{ color: 'blue', cursor: 'pointer', fontSize: '25px' }}
                                                                    className={`fe fe-chevron-down`}
                                                                    data-toggle="collapse" data-target={'#collapse' + i}
                                                                    aria-expanded={false}
                                                                />
                                                            </CardOptions>
                                                        </CardHead>
                                                        <div className="collapse" id={'collapse' + i}>
                                                            <CardBody className="p-0 overflow-auto">
                                                                {
                                                                    teste.descriptionErro
                                                                        ?
                                                                        <HTMLFormat>
                                                                            {`${teste.descriptionErro}`}
                                                                        </HTMLFormat>
                                                                        :
                                                                        <table className="table" wrap="off">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td><b>Entrada(s) para teste</b></td>
                                                                                    <td><b>Saída do seu programa</b></td>
                                                                                    <td><b>Saída esperada</b></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <HTMLFormat>
                                                                                            {teste.inputs}
                                                                                        </HTMLFormat>
                                                                                    </td>
                                                                                    <td>
                                                                                        <HTMLFormat>
                                                                                            {teste.saidaResposta}
                                                                                        </HTMLFormat>
                                                                                    </td>
                                                                                    <td>
                                                                                        <HTMLFormat>
                                                                                            {teste.output}
                                                                                        </HTMLFormat>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                }
                                                            </CardBody>
                                                        </div>
                                                    </Card>
                                                )}
                                            </>
                                    )
                                }
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            {
                question.type === 'OBJETIVA' && (
                    <>
                        <Card>
                            <CardBody>
                                <Row>
                                    <>
                                        {
                                            question.alternatives.map((alternative, i) => (
                                                <React.Fragment key={alternative.code}>
                                                    <Col className="col-1">
                                                        <div
                                                            className='w-100 d-flex justify-content-center'
                                                        >
                                                            {
                                                                question.lastSubmission ?
                                                                    <>
                                                                        <span class='mr-2 d-flex align-items-center'>
                                                                            <FaCheck
                                                                                size={15}
                                                                                color={`rgb(94, 186, 0, ${alternative.isCorrect ? '100' : '0'})`}
                                                                            />
                                                                        </span>
                                                                        <Radio
                                                                            value={alternative.code}
                                                                            checked={alternative.code === question.lastSubmission.answer}
                                                                            inputProps={{ 'aria-label': i }}
                                                                            disabled
                                                                            color="primary"
                                                                        />
                                                                    </>
                                                                    :
                                                                    <Radio
                                                                        value={alternative.code}
                                                                        checked={alternative.code === solution}
                                                                        onChange={e => setSolution(e.target.value)}
                                                                        inputProps={{ 'aria-label': i }}
                                                                        disabled={isSavingSubmission}
                                                                        color="primary"
                                                                    />
                                                            }

                                                        </div>
                                                    </Col>

                                                    <Col className='col-11 mt-2'>
                                                        <div className='w-100 d-flex'>
                                                            <span className='mr-4 '>
                                                                {`${String.fromCharCode(65 + i)})`}
                                                            </span>
                                                            <div className='w-100 ' ref={(el) => editorRef.current[i] = el}>
                                                                <SunEditor
                                                                    lang="pt_br"
                                                                    height="auto"
                                                                    disable={true}
                                                                    showToolbar={false}
                                                                    setContents={alternative.description}
                                                                    setDefaultStyle="font-size: 15px; text-align: justify"
                                                                    onLoad={() => {
                                                                        editorRef.current[i].classList.add('sun-editor-wrap')
                                                                    }}
                                                                    setOptions={{
                                                                        toolbarContainer: '#toolbar_container',
                                                                        resizingBar: false,
                                                                        katex: katex,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Col>


                                                </React.Fragment>
                                            ))
                                        }


                                    </>
                                </Row>

                            </CardBody>
                        </Card>
                        {
                            question.lastSubmission && (
                                <Row>
                                    <Col className='col-12'>
                                        {
                                            question.lastSubmission.hitPercentage === 100 ?
                                                <div className="alert alert-success d-flex align-items-center" role="alert">
                                                    <i className="fa fa-smile-o mr-2" /> <p className='m-0'>Opção correta</p>
                                                </div>
                                                :
                                                <div className="alert alert-danger  d-flex align-items-center" role="alert">
                                                    <i className="fa fa-frown-o mr-2" /> <p className='m-0'>Opção errada</p>
                                                </div>
                                        }
                                    </Col>
                                </Row>
                            )
                        }
                        <Row>
                            {!question.lastSubmission && (
                                <Col className='col-12 col-md-3'>
                                    <label htmlFor="selectDifficul">&nbsp;</label>
                                    <button
                                        className={`w-100 btn btn-primary ${isSavingSubmission && 'btn-loading'}`}
                                        onClick={handleSubmitObjectiveQuestion}
                                    >
                                        <i className="fa fa-play" /> <i className="fa fa-gears mr-2" />Submeter
                                    </button>
                                </Col>
                            )
                            }
                            <Col className='col-5 col-md-2'>
                                <label htmlFor="selectDifficulty">Dificuldade: </label>
                                <select
                                    defaultValue={question.userDifficulty || ''}
                                    className="form-control"
                                    id="selectDifficulty"
                                    disabled={isSavingDifficulty ? "disabled" : ""}
                                    onChange={e => handleDifficulty(e)}
                                >
                                    <option value={""}></option>
                                    <option value='1' >Muito fácil</option>
                                    <option value='2' >Fácil</option>
                                    <option value='3' >Médio</option>
                                    <option value='4' >Difícil</option>
                                    <option value='5' >Muito difícil</option>
                                </select>
                            </Col>
                        </Row>
                    </>

                )
            }
            {
                question.type === 'DISCURSIVA' && (
                    <>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col className='col-12'>
                                        <label>Sua resposta: </label>
                                        <textarea
                                            onChange={(e) => {
                                                setSolution(e.target.value);
                                                setCharChangeNumber(oldCharChangeNumber => oldCharChangeNumber + 1);
                                            }}
                                            readOnly={!!question.lastSubmission}
                                            className='form-control'
                                            placeholder="Sua resposta..."
                                            value={solution}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        {
                            question.lastSubmission && (
                                <Row>
                                    <Col className='col-12'>
                                        {
                                            question.lastSubmission.hitPercentage === null ?
                                                <div className="alert alert-info d-flex align-items-center" role="alert">
                                                    <p className='m-0'>Aguarde a avaliação do professor!</p>
                                                </div>
                                                :
                                                <div className="alert alert-info  d-flex align-items-center" role="alert">
                                                    <p className='m-0'>Nota do professor: <b>{question.lastSubmission.hitPercentage}%</b></p>
                                                </div>
                                        }
                                    </Col>
                                </Row>
                            )
                        }
                        <Row>
                            {
                                !question.lastSubmission && (
                                    <>
                                        <Col className='col-12 col-md-3'>
                                            <label htmlFor="selectDifficul">&nbsp;</label>
                                            <button
                                                className={`w-100 btn btn-primary ${loadingReponse && 'btn-loading'}`}
                                                onClick={handleSubmitDiscursiveQuestion}>
                                                <i className="fa fa-play" /> <i className="fa fa-gears mr-2" />Submeter
                                        </button>
                                        </Col>
                                        <Col className='col-5 col-md-3'>
                                            <label htmlFor="rascunho">&nbsp;</label>
                                            <button
                                                style={{ width: "100%" }}
                                                className={`btn btn-azure ${isSavingDraft &&
                                                    "btn-loading"}`}
                                                onClick={saveDraft}
                                            >
                                                <i className="fa fa-floppy-o" />
                                                &nbsp;&nbsp; Salvar rascunho
                                            </button>
                                        </Col>
                                    </>
                                )}
                            <Col className='col-5 col-md-2'>
                                <label htmlFor="selectDifficulty">Dificuldade: </label>
                                <select
                                    defaultValue={question.userDifficulty || ''}
                                    className="form-control"
                                    id="selectDifficulty"
                                    disabled={isSavingDifficulty ? "disabled" : ""}
                                    onChange={e => handleDifficulty(e)}
                                >
                                    <option value={""}></option>
                                    <option value='1' >Muito fácil</option>
                                    <option value='2' >Fácil</option>
                                    <option value='3' >Médio</option>
                                    <option value='4' >Difícil</option>
                                    <option value='5' >Muito difícil</option>
                                </select>
                            </Col>
                        </Row>

                    </>

                )
            }
        </>
    )
}

export default QuestionSubcscreen;
