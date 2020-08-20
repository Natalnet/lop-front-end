import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import { Load } from "components/ui/load";
import moment from "moment";
//import io from "socket.io-client";
import Swal from "sweetalert2";

export default props=> {
    const [loadingInfoTurma, setLoadingInfoTurma] = useState(false);
    const [, setLoadingPage] = useState(true);
    const [loadingPlagiarisms, setLoadingPlagiarisms] = useState(false);
    const [loadUserSubmissionsByList, setLoadUserSubmissionsByList] = useState(false);
    const [language,setLanguage] = useState("javascript")
    const [loadUrl, setLoadUrl] = useState(false);
    const [turma, setTurma] = useState("");
    const [lista, setLista] = useState(null);
    const [plagiarisms, setPlagiarisms] = useState([]);
    const history = useHistory();
    
    //const socket = useMemo(()=> io.connect(baseUrlBackend) ,[])

    document.title = useMemo(()=>
        `${turma && turma.name} - ${lista && lista.title}`
    ,[turma, lista]);


    useEffect(()=>{
        const  getInfoTurma = async ()=> {
            const id = props.match.params.id;
            try {
              const response = await api.get(`/class/${id}`);
              setTurma(response.data);
              setLoadingInfoTurma(false);
            } catch (err) {
                setLoadingInfoTurma(false);
                console.log(err);
            }
        }
        getInfoTurma();
    },[])

    // useEffect(()=>{
    //     const {id, idLista, idExercicio} = props.match.params;
    //     socket.emit('connectRoonClass', `${idLista}-${id}-${idExercicio}`);
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

    useEffect(()=>{
        getUserSubmissionsByList(props.match.params.idExercicio);
    },[])

    const question = useMemo(()=> 
        lista && lista.questions.find(q=>q.id === props.match.params.idExercicio)
    ,[lista]);

    const getUserSubmissionsByList = useCallback(async (idExercicio)=>{
        setLoadUserSubmissionsByList(true);
        const {id, idLista} = props.match.params;
        try{
            const response = await api.get(`/listQuestion/${idLista}/class/${id}/question/${idExercicio}`);
            //console.log('reponse:', response.data);
            setLista(response.data.list);
            setLoadingPage(false);
        }
        catch(err){
            console.log(err);
            setLoadingPage(false);
        }
        setLoadUserSubmissionsByList(false);
    },[]);

    const getUrlPlagiarism = useCallback(async ()=>{
        const {id, idLista} = props.match.params;
        const request = {
            idList: idLista ,
            idClass: id,
            language,
            idQuestion: question.id,
        }
        try{
            setLoadUrl(true);
            const response = await api.post('/plagiarism', request);
            Swal.fire({
                type: "success",
                title: response.data.msg,
            });
        }
        catch(err){
            console.log('err');
            Swal.fire({
                type: "error",
                title: "Ops, erro ao solicitar url! Por favor, tente novamente mais tarde!",
            });
        }
        setLoadUrl(false);

    },[lista, question, language])

    const handleQuestion = useCallback((url,idQuestion)=>{
        history.push(url);
        getUserSubmissionsByList(idQuestion);
    },[])



    useEffect(()=>{
        
        // const getPlagiarisms = async ()=>{
        //     const {id, idLista} = props.match.params;
        //     const query = `?idList=${idLista}&idClass=${id}&idQuestion=${question.id}`
        //     try{
        //         const response = await api.get(`/plagiarism${query}`);
        //         //console.log('plagiarism: ',response.data)
        //         setPlagiarisms(response.data);
        //     }
        //     catch(err){
                
        //     }
        //     setLoadUserSubmissionsByList(false);
        // }
        question && getPlagiarisms(question.id)
    },[question])

    const getPlagiarisms = useCallback(async(idQuestion)=>{
        const {id, idLista} = props.match.params;
        const query = `?idList=${idLista}&idClass=${id}&idQuestion=${idQuestion}`;
        setLoadingPlagiarisms(true);
        try{
            const response = await api.get(`/plagiarism${query}`);
            //console.log('plagiarism: ',response.data)
            setPlagiarisms(response.data);
        }
        catch(err){
            
        }
        setLoadingPlagiarisms(false);
    },[question])

    // useEffect(()=>{
    //     const getRealTimePlagiarisms = async ()=>{
    //         socket && socket.disconnect();
    //         socket.connect(baseUrlBackend);
    //         socket = io.connect(baseUrlBackend);
    //         const {id, idLista} = props.match.params;
    //         socket.emit('connectRoonClass', `${idLista}-${id}-${question.id}`);
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
        <TemplateSistema {...props} active={"listas"} submenu={"telaTurmas"}>
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
                            
                            to={`/professor/turma/${props.match.params.id}/listas`}
                            >
                            Plágios
                        </Link>
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        {lista ? (
                            <>
                                <Link
                                    to={`/professor/turma/${props.match.params.id}/lista/${props.match.params.idLista}`}
                                >
                                    {lista.title}
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
            {loadUserSubmissionsByList
            ?
                <Load/>
            :
            <>
            <Row mb={15}>
                <Col xs={12}>
                    {
                        lista && lista.questions.map(question=>
                            <button 
                                key={question.id}
                                onClick={()=>handleQuestion(`/professor/turma/${props.match.params.id}/lista/${lista.id}/exercicio/${question.id}/submissoes/plagio`,question.id)}
                                className={`btn ${question.id === props.match.params.idExercicio?'btn-primary disabled':'btn-outline-primary'} mr-5 mb-5`}
                            >
                                {question.title}
                            </button>
                        )
                    }
                </Col>
            </Row>
            <Row  mb={15}>
                <Col xs={3}>
                    <label htmlFor="lenguage">&nbsp; Linguagem a ser verificada o plágio: </label>
                    <select 
                        id="lenguage" 
                        className="form-control"
                        defaultValue={language}
                        onChange={ e=> setLanguage(e.target.value)}
                        disabled={loadUrl}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="cc">C/C++</option>
                    </select>
                    
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
            <Row  mb={15}>
                <Col xs={12} textRight>
                    <button 
                        className={`btn btn-secondary btn-outline-secondary ${loadingPlagiarisms && 'btn-loading'}`}                            
                        type="button" 
                        //id="button-addon3"
                        onClick={()=> getPlagiarisms(question.id)}
                    >
                        Atualizar tabela
                        <i className="fe fe-refresh-cw ml-3" />
                    </button>
                </Col>
            </Row>
            <Row  mb={15}>
                <Col xs={12}>
                {loadingPlagiarisms
                ?
                    <Load/>
                :
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>
                                    url
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