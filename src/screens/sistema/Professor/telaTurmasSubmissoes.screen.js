import React, { Component } from "react";
import { Link } from "react-router-dom";

import socket from 'socket.io-client'
import TemplateSistema from "components/templates/sistema.template";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import NavPagination from "components/ui/navs/navPagination";
import {Redirect} from 'react-router-dom'
import api from '../../../services/api'
import formataData from "../../../util/funçoesAuxiliares/formataData";
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
            turma:'',
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
        try{
            const response = await api.get(`/class/${id}`)
            console.log(response);
            this.setState({
                turma:response.data,
                loadingInfoTurma:false,
            })
        }
        catch(err){
            this.setState({loadingInfoTurma:false})
            console.log(err);
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
            console.log('submissoes:');
            console.log(response.data.docs);
            this.setState({
                submissoes : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingSubmissoes:false
            })
        }catch(err){
            this.setState({loadingSubmissoes:false})
            console.log(err);
        }
    };
    getSubmissoesRealTime(){
        const io = socket("http://localhost:3001")
        const id = this.props.match.params.id
        io.emit('connectRoonSubmissionClass',id)//conectando à sala
        io.on('SubmissionClass',response=>{
            this.getSubmissoes(false)
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
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getSubmissoes())
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
        this.getSubmissoes()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getSubmissoes())
        
    }


    render() {
        const {submissoes,showModalInfo,fieldFilter,loadingSubmissoes,contentInputSeach,numPageAtual,totalPages,submissao,loadingInfoTurma,turma} = this.state
        return (
        <TemplateSistema active='submissoes' {...this.props} submenu={'telaTurmas'}>
            <div>
                {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
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

                 <table style={lista} className="table table-hover table-responsive">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Questão</th>
                            <th>Percentual de acerto</th>
                            <th>Tempo gasto</th>
                            <th>N° da Submissão</th>
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
                                    <td style={{color:`${submission.hitPercentage===100?'#0f0':'#f00'}`}}><b>{submission.hitPercentage}%</b></td>
                                    <td>{parseInt(submission.timeConsuming/1000/60)}min{parseInt((submission.timeConsuming/1000)%60)}seg</td>
                                    <td>{submission.version+1}°</td>
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
                <div className='row'>
                    <div className='col-12 text-center'>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </div>
                </div>
            </div>
            <SwalModal
                show={showModalInfo}
                title={submissao && submissao.question.description}
                handleModal={this.handleCloseshowModalInfo.bind(this)}
                width={'100%'}
            >
                <div className='row'>
                    <div className='col-12 col-md-6'>
                    <AceEditor
                      mode={submissao.language==='cpp'?'c_cpp':submissao.language}
                      readOnly={true}
                      width={'100%'}
                      showGutter={false}
                      focus={false}
                      theme='monokai'
                      value={submissao.answer || ''}
                      fontSize={14}
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