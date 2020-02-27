import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ParticioantesScreenfrom from "components/screens/participantes.componentes.screen"
export default class Pagina extends Component {
    constructor(props){
        super(props)
        this.state = {
            participantes: [],
            showModal:false,
            loadingParticipantes:false,
            myClasses : JSON.parse(sessionStorage.getItem('myClasses')) || '',
            turma:"",            
            loadingInfoTurma:true,
            docsPerPage:15,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)
    }
    
    async componentDidMount() {
        await this.getInfoTurma()
        this.getParticipantes()
       
        const {turma} = this.state
        document.title = `${turma && turma.name} - participantes`;
        
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        const {myClasses} = this.state
        if(myClasses && typeof myClasses==="object"){
            const index = myClasses.map(c=>c.id).indexOf(id)
            if(index!==-1){
                this.setState({
                    turma:myClasses[index]
                })
            }
            this.setState({loadingInfoTurma:false})
            return null
        }
        try{
            const response = await api.get(`/class/${id}`)
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
        const {numPageAtual,docsPerPage} = this.state
        const idClass = this.props.match.params.id
        let query = `?idClass=${idClass}`
        query +=`&classes=yes`
        query +=`&docsPerPage=${docsPerPage}`
        try{
            this.setState({loadingParticipantes:true})
            const response = await api.get(`/user/page/${numPageAtual}${query}`)            
            console.log('participantes');
            console.log(response);
            this.setState({
                participantes:[...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                numPageAtual : response.data.currentPage,
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
        const {turma,loadingInfoTurma} = this.state

        return (
        <TemplateSistema {...this.props} active={'participantes'} submenu={'telaTurmas'}>
            <Row mb={15}>
                <Col xs={12}>
                    {loadingInfoTurma?
                        <div className="loader"  style={{margin:'0px auto'}}></div>
                        :
                        <h5 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> 
                            {turma && turma.name} - {turma && turma.year}.{turma && turma.semester} 
                            <i className="fa fa-angle-left ml-2 mr-2"/> Participantes
                        </h5>                        }
                </Col>
            </Row>
            <ParticioantesScreenfrom
                {...this.props}
                {...this.state}
                handlePage={this.handlePage.bind(this)}
            />
        </TemplateSistema>
        )
    }
}