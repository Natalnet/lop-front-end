import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import NavPagination from "components/ui/navs/navPagination";
import Table from 'components/ui/tables/tableType1.component'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
export default class Pagina extends Component {
    constructor(props){
        super(props)
        this.state = {
            participantes: [],
            showModal:false,
            loadingParticipantes:false,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            loadingInfoTurma:true,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)
    }
    componentWillMount(){
        const idClass = this.props.match.params.id
        const turmas = JSON.parse(sessionStorage.getItem('user.classes'))
        const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
        if(turmas && !turmas.includes(idClass))
            this.props.history.push(`/${profile}`)
    }
    async componentDidMount() {
        this.getParticipantes()
        await this.getInfoTurma()
        const {turma} = this.state
        document.title = `${turma && turma.name} - participantes`;
        
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

    async getParticipantes(){
        const id = this.props.match.params.id
        const {numPageAtual} = this.state

        try{
            this.setState({loadingParticipantes:true})
            const response = await api.get(`/class/${id}/participants/page/${numPageAtual}`)
            console.log('participantes');
            console.log(response);
            this.setState({
                participantes:[...response.data.docs],
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
        const {turma,participantes,loadingInfoTurma,loadingParticipantes,numPageAtual,totalPages} = this.state
        return (
        <TemplateSistema {...this.props} active={'participantes'} submenu={'telaTurmas'}>
                <Row mb={15}>
                    <Col xs={12}>
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma && turma.name} - {turma && turma.year}.{turma && turma.semester}</h3>
                        }
                    </Col>
                </Row>
                <Row mb={15}>
                    <Col xs={12}>
                     <Table>
                        <thead> 
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Matrícula</th>
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
                    </Table>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} textCenter>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </Col>
                </Row>
        </TemplateSistema>
        )
    }
}