import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import { Load } from "../../../components/ui/load";
import moment from "moment";
//import io from "socket.io-client";
import Swal from "sweetalert2";

import SupportedLanguages from "../../../config/SupportedLanguages"

export default props => {
    const [loadingInfoTurma, setLoadingInfoTurma] = useState(false);
    const [, setLoadingPage] = useState(true);
    const [loadingPlagiarisms, setLoadingPlagiarisms] = useState(false);
    const [loadUserSubmissionsByTest, setLoadUserSubmissionsByTest] = useState(false);
    const [mossLanguage, setMossLanguage] = useState(SupportedLanguages.mossNames[0]);
    const [language, setLanguage] = useState(SupportedLanguages.list[0]);
    const [loadUrl, setLoadUrl] = useState(false);
    const [turma, setTurma] = useState("");
    const [test, setTest] = useState(null);
    const [plagiarisms, setPlagiarisms] = useState([]);
    const history = useHistory();

    //const socket = useMemo(()=> io.connect(baseUrlBackend) ,[])

    document.title = useMemo(() =>
        `${turma && turma.name} - ${test && test.title}`
        , [turma, test]);


    useEffect(() => {
        const getInfoTurma = async () => {
            const id = props.match.params.id;
            try {
                const response = await api.get(`/class/${id}`);
                setTurma(response.data);
                setMossLanguage(() => {
                    const languageIdx = SupportedLanguages.list.indexOf(response.data.languages[0]);
                    return SupportedLanguages.mossNames[languageIdx];
                });
                setLanguage(response.data.languages[0]);
                //set
                //console.log("turma %j", turma)
                setLoadingInfoTurma(false);
            } catch (err) {
                setLoadingInfoTurma(false);
                console.log(err);
            }
        }
        getInfoTurma();
    }, [])

    // useEffect(()=>{
    //     const {id, idTest, idQuestion} = props.match.params;
    //     socket.emit('connectRoonClass', `${idTest}-${id}-${idQuestion}`);
    //     socket.on("urlPlagiarism", ({moss_url, err, createdAt}) =>{

    //         if(moss_url){
    //             setPlagiarisms(oldPlagirism =>[
    //                 {
    //                     moss_url,
    //                     createdAt
    //                 },
    //                 ...oldPlagirism
    //             ])
    //         }
    //     })
    //     return ()=> {
    //         console.log('----->unmounted<-----')
    //         socket && socket.disconnect();
    //     }
    // },[])

    useEffect(() => {
        getUserSubmissionsByTest(props.match.params.idQuestion);
    }, [])

    const question = useMemo(() =>
        test && test.questions.find(q => q.id === props.match.params.idQuestion)
        , [test]);

    const getUserSubmissionsByTest = useCallback(async (idQuestion) => {
        setLoadUserSubmissionsByTest(true);
        const { id, idTest } = props.match.params;
        try {
            const response = await api.get(`/test/${idTest}/class/${id}/question/${idQuestion}`);
            //console.log('reponse:', response.data);
            setTest(response.data.test);
            setLoadingPage(false);
        }
        catch (err) {
            console.log(err);
            setLoadingPage(false);
        }
        setLoadUserSubmissionsByTest(false);
    }, []);

    const getUrlPlagiarism = useCallback(async () => {
        const { id, idTest } = props.match.params;
        const request = {
            idTest: idTest,
            idClass: id,
            moss_language: mossLanguage,
            language,
            idQuestion: question.id,
        }
        try {
            setLoadUrl(true);
            const response = await api.post('/plagiarism/test', request);
            Swal.fire({
                type: "success",
                title: response.data.msg,
            });
        }
        catch (err) {
            console.log('err');
            Swal.fire({
                type: "error",
                title: "Ops, erro ao solicitar url! Por favor, tente novamente mais tarde!",
            });
        }
        setLoadUrl(false);

    }, [test, question, mossLanguage])

    const handleQuestion = useCallback((url, idQuestion) => {
        history.push(url);
        getUserSubmissionsByTest(idQuestion);
    }, [])

    const handleLanguage = useCallback(e => {
        setMossLanguage(e.target.value);
        const languageIdx = SupportedLanguages.mossNames.indexOf(e.target.value);
        setLanguage(SupportedLanguages.list[languageIdx]);
    });

    const showNiceName = useCallback(lang=>{
        const languageIdx = SupportedLanguages.list.indexOf(lang);
        return SupportedLanguages.niceNames[languageIdx];
    },[turma])

    useEffect(() => {

        // const getPlagiarisms = async ()=>{
        //     const {id, idTest} = props.match.params;
        //     const query = `?idTest=${idTest}&idClass=${id}&idQuestion=${question.id}`
        //     try{
        //         const response = await api.get(`/plagiarism/test${query}`);
        //         //console.log('plagiarism: ',response.data)
        //         setPlagiarisms(response.data);
        //     }
        //     catch(err){

        //     }
        //     setLoadUserSubmissionsByTest(false);
        // }
        question && getPlagiarisms(question.id)
    }, [question])

    const getPlagiarisms = useCallback(async (idQuestion) => {
        const { id, idTest } = props.match.params;
        const query = `?idTest=${idTest}&idClass=${id}&idQuestion=${idQuestion}`;
        setLoadingPlagiarisms(true);
        try {
            const response = await api.get(`/plagiarism/test${query}`);
            //console.log('plagiarism: ',response.data)
            setPlagiarisms(response.data);
        }
        catch (err) {

        }
        setLoadingPlagiarisms(false);
    }, [question])

    // useEffect(()=>{
    //     const getRealTimePlagiarisms = async ()=>{
    //         socket && socket.disconnect();
    //         socket.connect(baseUrlBackend);
    //         socket = io.connect(baseUrlBackend);
    //         const {id, idTest} = props.match.params;
    //         socket.emit('connectRoonClass', `${idTest}-${id}-${question.id}`);
    //         socket.on("urlPlagiarism", ({moss_url, err, createdAt}) =>{
    //             console.log('socket response->', moss_url)
    //             if(moss_url){
    //                 setPlagiarisms(oldPlagirism =>[
    //                     {
    //                         moss_url,
    //                         createdAt
    //                     },
    //                     ...oldPlagirism
    //                 ])
    //             }
    //         })
    //     }

    //     question && getRealTimePlagiarisms();
    // },[question])

    return (
        <TemplateSistema {...props} active={"provas"} submenu={"telaTurmas"}>
            <Row mb={15}>
                <Col xs={12}>
                    {loadingInfoTurma ? (
                        <div className="loader" style={{ margin: "0px auto" }}></div>
                    ) : (
                            <h5 style={{ margin: "0px", display: "inline" }}>
                                <i className="fa fa-users mr-2" aria-hidden="true" />
                                {turma && turma.name} - {turma && turma.year}.
                                {turma && turma.semester}
                                <i className="fa fa-angle-left ml-2 mr-2" />
                                <Link

                                    to={`/professor/turma/${props.match.params.id}/provas`}
                                >
                                    Provas
                        </Link>
                                <i className="fa fa-angle-left ml-2 mr-2" />
                                {test ? (
                                    <>
                                        <Link
                                            to={`/professor/turma/${props.match.params.id}/prova/${props.match.params.idTest}`}
                                        >
                                            {test.title}
                                        </Link>
                                        <i className="fa fa-angle-left ml-2 mr-2" />
                                        <span> {question && question.title}</span>
                                    </>
                                ) : (
                                        <div
                                            style={{
                                                width: "140px",
                                                backgroundColor: "#e5e5e5",
                                                height: "12px",
                                                display: "inline-block",
                                            }}
                                        />
                                    )}
                            </h5>
                        )}
                </Col>
            </Row>
            {loadUserSubmissionsByTest
                ?
                <Load />
                :
                <>
                    <Row mb={15}>
                        <Col xs={12}>
                            {
                                test && test.questions.map(question =>
                                    <button
                                        key={question.id}
                                        onClick={() => handleQuestion(`/professor/turma/${props.match.params.id}/prova/${test.id}/exercicio/${question.id}/submissoes/plagio`, question.id)}
                                        className={`btn ${question.id === props.match.params.idQuestion ? 'btn-primary disabled' : 'btn-outline-primary'} mr-5 mb-5`}
                                    >
                                        {question.title}
                                    </button>
                                )
                            }
                        </Col>
                    </Row>
                    <Row mb={15}>
                        <Col xs={3}>
                            {loadingInfoTurma ?
                                (
                                    <div className="loader" style={{ margin: "0px auto" }}></div>)
                                :
                                (
                                    <>
                                        <label htmlFor="lenguage">&nbsp; Linguagem a ser verificada o plágio: </label>
                                        <select
                                            id="lenguage"
                                            className="form-control"
                                            defaultValue={turma && turma.languages[0]}
                                            onChange={handleLanguage}
                                            disabled={loadUrl}>

                                            {turma && turma.languages.map((lang) => {
                                                const languageIdx = SupportedLanguages.list.indexOf(lang);
                                                return (
                                                    <option key={lang} value={SupportedLanguages.mossNames[languageIdx]}>{SupportedLanguages.niceNames[languageIdx]}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </>
                                )
                            }
                        </Col>
                        <Col xs={3}>
                            <label>&nbsp;{""} </label>
                            <button
                                onClick={getUrlPlagiarism}
                                className={`btn btn-primary btn-block ${loadUrl && 'btn-loading'}`}
                            >
                                Gerar link
                    </button>
                        </Col>
                    </Row>
                    <Row mb={15}>
                        <Col xs={12} textRight>
                            <button
                                className={`btn btn-secondary btn-outline-secondary ${loadingPlagiarisms && 'btn-loading'}`}
                                type="button"
                                //id="button-addon3"
                                onClick={() => getPlagiarisms(question.id)}
                            >
                                Atualizar tabela
                        <i className="fe fe-refresh-cw ml-3" />
                            </button>
                        </Col>
                    </Row>
                    <Row mb={15}>
                        <Col xs={12}>
                            {loadingPlagiarisms
                                ?
                                <Load />
                                :
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th>
                                                url
                                            </th>
                                            <th>
                                                Linguagem
                                            </th>
                                            <th>
                                                criado em
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            plagiarisms.map(plagiarism =>
                                                <tr key={plagiarism.moss_url}>
                                                    <td>
                                                        <a
                                                            href={plagiarism.moss_url}
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                        >
                                                            {plagiarism.moss_url}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        {showNiceName(plagiarism.language)}
                                                    </td>
                                                    <td>
                                                        {moment(plagiarism.createdAt).local().format('DD/MM/YYYY - HH:mm')}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            }
                        </Col>
                    </Row>
                </>
            }
        </TemplateSistema>
    )
}