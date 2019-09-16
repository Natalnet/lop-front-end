import React, { Component } from "react";

import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import NavPagination from "components/ui/navs/navPagination";

export default class Pagina extends Component {
    constructor(props){
        super(props)
        this.state = {
            participantes: [],
            showModal:false,
            loadingParticipantes:false,
            turma:'',
            loadingInfoTurma:true,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)
    }

    componentDidMount() {
        this.getInfoTurma()
        this.getParticipantes()
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

    async getParticipantes(){
        const id = this.props.match.params.id
        try{
            this.setState({loadingParticipantes:true})
            const response = await api.get(`/class/${id}/participants`)
            console.log(response);
            this.setState({
                participantes:response.data.docs,
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingParticipantes:false,
            })
            
        }
        catch(err){
            this.setState({loadingParticipantes:false,})
            console.log(err);
        }
    }
    handleShowModal(){
        this.setState({showModal:true})
    }
    handleCloseModal(){
        this.setState({showModal:false})
    }
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getParticipantes())
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        },()=>this.getParticipantes())
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        },()=>this.getParticipantes())
        
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getParticipantes())
    }
    render() {
        const {turma,participantes,showModal,fildFilter,loadingInfoTurma,loadingParticipantes,contentInputSeach,numPageAtual,totalPages} = this.state
        return (
        <TemplateSistema {...this.props} active={'participantes'} submenu={'telaTurmas'}>
            <div>
                {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
                 <table style={{backgroundColor:"white"}} className="table table-hover">
                    <thead> 
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Mátricula</th>
                            <th>Função</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingParticipantes
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
                            participantes.map((user, index) => (
                                <tr key={index}>
                                    <td className='text-center'>
                                        <div 
                                            className="avatar d-block" 
                                            style={
                                                {backgroundImage: `url(${user.urlImage || 'https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg'})`}
                                            }
                                        />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.enrollment}</td>
                                    <td>{user.profile}</td>
                                    <td>
                                        <button className="btn btn-primary mr-2">
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
        </TemplateSistema>
        )
    }
}