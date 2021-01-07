import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
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
import useQuestion from '../../hooks/useQuestion'
import { IoMdEye } from 'react-icons/io';

const QuestionSubcscreen = props => {
    const { title, type, alternatives, description, results, char_change_number, oldTimeConsuming, katexDescription, author, submissionsCount, submissionsCorrectsCount, accessCount } = props;
    const { language, solution, userDifficulty, loadDifficulty, idQuestion, idClass, idList, idTest } = props;
    const { changeLanguage, handleSolution, handleDifficulty } = props;

    const languages = useMemo(() =>
        props.languages || SupportedLanguages.list
        , [props])

    const { saveAccess } = useAccess();
    const { getIconTypeQuestion } = useQuestion();

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

    const testCases = useMemo(() =>
        props.showAllTestCases ? response : response.filter((t, i) => i === 0)
        , [response])

    const latestSolution = useRef(solution);
    const latestChar_change_number = useRef(char_change_number);
    const latestLanguage = useRef(language);

    useEffect(() => {
        latestSolution.current = solution;
        latestChar_change_number.current = char_change_number;
        latestLanguage.current = language;
    }, [solution, char_change_number, language]);

    useEffect(() => {
        saveAccess(idQuestion);
        setStartTime(new Date());
        if (type === 'PROGRAMAÇÃO') {
            const idInterval = setInterval(() => {
                saveDraft(false);
            }, 6000);
            return () => clearInterval(idInterval);
        }

    }, [])

    useEffect(() => {
        let io;
        if (idTest) {
            io = socket.connect(baseUrlBackend);
            io.emit("connectRoonClass", props.match.params.id);

            io.on("changeStatusTest", (reponse) => {
                console.log('realtime:', reponse)
                setStatusTest(reponse.status)
            });
        }
        return () => io && io.disconnect();
    }, [])

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
            results: results,
        };
        setLoadingReponse(true);
        //this.setState({ loadingReponse: true });
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

    }, [language, results, char_change_number, startTime, oldTimeConsuming, simpleWorkspace, solution, statusTest])

    const handleSubmitObjectiveQuestion = useCallback(async () => {

    }, []);

    const handleSubmitDiscursiveQuestion = useCallback(async () => {

    }, []);

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
    }, [language, idQuestion]);

    const saveDraft = useCallback(async (showMsg = true) => {
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

    }, []);

    return (
        <>
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
                                        getIconTypeQuestion(type)
                                    }
                                    {title}
                                </p>
                            </CardTitle>
                        </CardHead>
                        <CardBody className="overflow-auto">
                            <Row>
                                <Col className={`col-12 col-md-${type === 'PROGRAMAÇÃO' ? '7' : '12'}`}>
                                    <div ref={(el) => editorEnunciateRef.current = el} className='w-100'>
                                        <SunEditor
                                            lang="pt_br"
                                            height="auto"
                                            disable={true}
                                            showToolbar={false}
                                            // onChange={this.handleDescriptionChange.bind(this)}
                                            setContents={description}
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
                                    {katexDescription ? (
                                        <BlockMath>{katexDescription}</BlockMath>
                                    ) : (
                                            ""
                                        )}
                                </Col>
                                {type === 'PROGRAMAÇÃO' && (
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
                                                {results
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
                                                {accessCount}
                                            </li>
                                            <li
                                                className="d-flex  mr-4 align-items-center"
                                                title={`N° DE SUBMISSÕES CORRETAS`}
                                            >
                                                <i className="fa fa-gears mr-1 text-success" />
                                                {submissionsCorrectsCount}
                                            </li>
                                            <li
                                                className="d-flex  mr-4 align-items-center"
                                                title={`N° DE SUBMISSÕES`}
                                            >
                                                <i className="fa fa-gears mr-1" />
                                                {submissionsCount}
                                            </li>
                                        </ul>
                                        {author && <p
                                            className="font-italic mb-0"
                                        >
                                            <b>Autor(a):</b> {author.email}
                                        </p>}
                                    </div>
                                </Col>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {type === 'PROGRAMAÇÃO' && (
                <>
                    <Row className='mb-4'>
                        <Col className='col-12 col-md-2'>
                            <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
                            <select className="form-control" onChange={(e) => changeLanguage(e)}>
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
                                    if (type === 'PROGRAMAÇÃO') {
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
                                defaultValue={userDifficulty}
                                className="form-control"
                                id="selectDifficulty"
                                disabled={loadDifficulty ? "disabled" : ""}
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
                                        onChange={handleSolution}
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
                type === 'OBJETIVA' && (
                    <>
                        <Card>
                            <CardBody>
                                <Row>
                                    {
                                        alternatives && alternatives.map((alternative, i) => (
                                            <>
                                                <Col className="col-1">
                                                    <div
                                                        className='w-100 d-flex justify-content-center'
                                                    >
                                                        <Radio
                                                            value={i}
                                                            //checked={alternative.isCorrect}
                                                            onChange={() => undefined}
                                                            inputProps={{ 'aria-label': i }}
                                                            color="primary"
                                                        />
                                                    </div>
                                                </Col>

                                                <Col className='col-11 mt-2' key={alternative.description}>
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
                                                                // onChange={this.handleDescriptionChange.bind(this)}
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
                                            </>
                                        ))
                                    }

                                </Row>
                            </CardBody>
                        </Card>
                        <Row>
                            <Col className='col-12 col-md-3'>
                                <label htmlFor="selectDifficul">&nbsp;</label>
                                <button
                                    className={`w-100 btn btn-primary ${loadingReponse && 'btn-loading'}`}
                                    onClick={handleSubmitObjectiveQuestion}>
                                    <i className="fa fa-play" /> <i className="fa fa-gears mr-2" />Submeter
                                </button>
                            </Col>
                            <Col className='col-5 col-md-2'>
                                <label htmlFor="selectDifficulty">Dificuldade: </label>
                                <select
                                    defaultValue={userDifficulty}
                                    className="form-control"
                                    id="selectDifficulty"
                                    disabled={loadDifficulty ? "disabled" : ""}
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
                type === 'DISCURSIVA' && (
                    <>
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col className='col-12'>
                                        <label>Sua resposta: </label>
                                        <textarea
                                            onChange={(e) => null}
                                            className='form-control'
                                            placeholder="Sua resposta..."
                                            value={''}
                                        />
                                    </Col>

                                </Row>
                            </CardBody>
                        </Card>
                        <Row>
                            <Col className='col-12 col-md-3'>
                                <label htmlFor="selectDifficul">&nbsp;</label>
                                <button
                                    className={`w-100 btn btn-primary ${loadingReponse && 'btn-loading'}`}
                                    onClick={handleSubmitDiscursiveQuestion}>
                                    <i className="fa fa-play" /> <i className="fa fa-gears mr-2" />Submeter
                                </button>
                            </Col>
                            <Col className='col-5 col-md-2'>
                                <label htmlFor="selectDifficulty">Dificuldade: </label>
                                <select
                                    defaultValue={userDifficulty}
                                    className="form-control"
                                    id="selectDifficulty"
                                    disabled={loadDifficulty ? "disabled" : ""}
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
