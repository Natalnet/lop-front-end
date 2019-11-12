import React, { Component } from "react";
import { Link } from "react-router-dom";

import socket from 'socket.io-client'
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import {Redirect} from 'react-router-dom'
import api from '../../../services/api'
import formataData from "../../../util/funçoesAuxiliares/formataData";
import arrayPaginate from "../../../util/funçoesAuxiliares/arrayPaginate";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import HTMLFormat from 'components/ui/htmlFormat'
import {BlockMath } from 'react-katex';
import TableIO from 'components/ui/tables/tableIO.component'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/c_cpp';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const lista = {
    backgroundColor:"white"
};
const titulo = {
    alignItems: 'center'
};
const botao = {
    width: "100%"
};

export default class HomesubmissoesScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            loadingInfoTurma:true,
            contentInputSeach:'',
            submissoes: [],
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            showModal:false,
            loadingSubmissoes:false,
            fieldFilter:'name',
            contentInputSeach:'',
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            submissao:'',

        }
        this.handlePage = this.handlePage.bind(this)

    }
    async componentDidMount() {
        this.getSubmissoes();
        this.getSubmissoesRealTime()
        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - Submissões`;
        
    }
     async getInfoTurma(){
        const id = this.props.match.params.id
        const {turma} = this.state
        if(!turma || (turma && turma.id!==id)){
            console.log('dentro do if');
            try{
                const response = await api.get(`/class/${id}`)
                const turmaData = {
                    id:response.data.id,
                    name:response.data.name,
                    year:response.data.year,
                    semester:response.data.semester,
                    languages:response.data.languages
                }
                this.setState({
                    turma:turmaData,
                    loadingInfoTurma:false,
                })
                sessionStorage.setItem('turma',JSON.stringify(turmaData))
            }
            catch(err){
                this.setState({loadingInfoTurma:false})
                console.log(err);
            }
        }
        else{
            this.setState({loadingInfoTurma:false})
        }
    }
    async getSubmissoes(loading=true){
        const id = this.props.match.params.id
        const {numPageAtual,contentInputSeach,fieldFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&field=${fieldFilter}`
        try{
            if(loading) this.setState({loadingSubmissoes:true})
            const response = await api.get(`/class/${id}/submissions/page/${numPageAtual}?${query}`)
            console.log('todas submissoes:');
            console.log(response.data);
            this.setState({
                todasSubmissoes: response.data,
                loadingSubmissoes:false
            })
            this.applyPagination(response.data)
        }catch(err){
            this.setState({loadingSubmissoes:false})
            console.log(err);
        }
    };
    getSubmissoesRealTime(){
        const io = socket("http://localhost:3001")
        const id = this.props.match.params.id
        io.emit('connectRoonSubmissionClass',id)//conectando à sala
        io.on('SubmissionClass',async response=>{
            await this.setState({
                todasSubmissoes:[response,...this.state.todasSubmissoes]
            })
            this.applyPagination(this.state.todasSubmissoes)
        })
    }
    handleShowModalInfo(submissao){
        //console.log(question);
        this.setState({
            submissao:submissao,
            showModalInfo:true,
        })
    }
    handleCloseshowModalInfo(e){
        this.setState({showModalInfo:false})
    }
    applyPagination(arr){
        const {numPageAtual } =this.state
        const arrayPagined = arrayPaginate(arr,numPageAtual,14)
        this.setState({
            submissoes : arrayPagined.docs,
            totalItens : arrayPagined.total,
            totalPages : arrayPagined.totalPages,
            loadingSubmissoes:false
        })
    }
    handlePage(e,numPage){
        e.preventDefault()
        const {todasSubmissoes} = this.state
        const submissoesPaginadas = arrayPaginate(todasSubmissoes,numPage,14)
        console.log('handlePage');
        console.log(submissoesPaginadas);
        this.setState({
            numPageAtual:numPage,
            submissoes : submissoesPaginadas.docs,
            totalItens : submissoesPaginadas.total,
            totalPages : submissoesPaginadas.totalPages,
            loadingSubmissoes:false
        })
    }
    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getSubmissoes()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getSubmissoes()*/)
        
    }
    filterSeash(){
        const {todasSubmissoes,fieldFilter, contentInputSeach,numPageAtual } =this.state
        const submissoes = todasSubmissoes.filter(sub=>{
            if(fieldFilter==='name')
                return sub.user.name.toLowerCase().includes(contentInputSeach.toLowerCase())
            else if(fieldFilter==='title')
                return sub.question.title.toLowerCase().includes(contentInputSeach.toLowerCase())
        })
        this.applyPagination(submissoes)
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:'',
        })
        this.applyPagination(this.state.todasSubmissoes)
    }


    render() {
        const {submissoes,showModalInfo,fieldFilter,loadingSubmissoes,contentInputSeach,numPageAtual,totalPages,submissao,loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema active='submissoes' {...this.props} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="mb-3 col-12">     
                        <InputGroup
                            placeholder={`Perquise pelo ${fieldFilter==='name'?'nome do aluno':fieldFilter==='title'?'nome da questão':'...'}`}
                            value={contentInputSeach}
                            handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                            filterSeash={this.filterSeash.bind(this)}
                            handleSelect={this.handleSelectFieldFilter.bind(this)}
                            options={ [{value:'name',content:'Aluno'},{value:'title',content:'Questão'}] }
                            clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                            loading={loadingSubmissoes}                            
                        />
                    </div>
                </div>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                     <table style={lista} className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Questão</th>
                                <th>Percentual de acerto</th>
                                <th>Tempo gasto</th>
                                <th>Submetido em</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingSubmissoes
                            ?
                                <tr>
                                    <td>
                                        <div className="loader" />
                                    </td>
                                    <td>                                        
                                        <div className="loader" />
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>                                        
                                    <td>
                                        <div className="loader"/>
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>

                                </tr>           
                            :
                                submissoes.map((submission, index) => (
                                    <tr key={submission.id}>
                                        <td className='text-center'>
                                            <div 
                                                className="avatar d-block" 
                                                style={
                                                    {backgroundImage: `url(${submission.user.urlImage || 'https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg'})`}
                                                }
                                            />
                                        </td>
                                        <td>{submission.user.name}</td>
                                        <td>{submission.question.title}</td>
                                        <td style={{color:`${parseFloat(submission.hitPercentage)===100?'#0f0':'#f00'}`}}><b>{parseFloat(submission.hitPercentage)}%</b></td>
                                        <td>{parseInt(submission.timeConsuming/1000/60)}min{parseInt((submission.timeConsuming/1000)%60)}seg</td>
                                        <td>{formataData(submission.dateSubmission)}</td>
                                        <td>
                                            <button className="btn btn-primary mr-2" onClick={()=>this.handleShowModalInfo(submission)}>
                                                <i className="fa fa-info"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12 text-center">
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </div>
                </div>
            
            <SwalModal
                show={showModalInfo}
                title={submissao && submissao.question.description}
                handleModal={this.handleCloseshowModalInfo.bind(this)}
                width={'100%'}
            >
                <div className='row'>
                    <div className='col-12 offset-md-2 col-md-8 text-center'>
                    <AceEditor
                      mode={submissao.language==='cpp'?'c_cpp':submissao.language}
                      readOnly={true}
                      width={'100%'}
                      focus={false}
                      theme='monokai'
                      showPrintMargin={false}
                      value={submissao.answer || ''}
                      fontSize={16}
                      name="ACE_EDITOR_RES"
                      editorProps={{$blockScrolling: true}}
                    />
                    </div>
                </div>
                
            
            </SwalModal>
        </TemplateSistema>
        )
    }
}