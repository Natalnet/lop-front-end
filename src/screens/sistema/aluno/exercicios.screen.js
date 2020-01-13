import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import {formatDate} from "../../../util/auxiliaryFunctions.util";
import SwalModal from "components/ui/modal/swalModal.component";
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import ExerciciosPaginadosScreen from "components/screens/exerciciosPaginados.componenete.screen"

export default class ExerciciosScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            contentInputSeach:'',
            exercicios: [],
            radioAsc:false,
            radioDesc:true,
            valueRadioSort:"DESC",
            sortBy:"createdAt",
            showModalInfo:false,
            question:"",
            showModal:false,
            loadingExercicios:false,
            loadingTags:false,
            tags:[],
            showFilter:false,
            tagsSelecionadas:[],
            fildFilter:'title',
            docsPerPage:15,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)

    }
    async componentDidMount() {
        document.title = "Exercícios";
        await this.getTags();
        this.getExercicios();
    }
    async getExercicios(){
        const {numPageAtual,contentInputSeach,fildFilter,docsPerPage,valueRadioSort,sortBy,tags,tagsSelecionadas} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query +=`&docsPerPage=${docsPerPage}`
        query += `&field=${fildFilter}`
        query += `&sortBy=${sortBy}`
        query += `&sort=${valueRadioSort}`
        query += `&tags=${tagsSelecionadas.length===0?JSON.stringify(tags.map(tag=>tag.label)):JSON.stringify(tagsSelecionadas.map(tag=>tag.label))}`
        console.log(query)
        try{
            this.setState({loadingExercicios:true})
            const response = await api.get(`/question/page/${numPageAtual}?${query}`)
            console.log('exercicios',response.data)
            this.setState({
                exercicios : [...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loadingExercicios:false
            })
        }catch(err){
            this.setState({loadingExercicios:false})
            console.log(err);
        }
    };
    async getTags(){
        try{
          this.setState({loadingTags:true})
          const response = await api.get('/tag')
          const tags = response.data.map(tag=>{
            return {
              value: tag.id,
              label: tag.name
            }
          })
          this.setState({
            tags,
            loadingTags:false
          })
        }
        catch(err){
          console.log(err);
          this.setState({loadingTags:false})
        }
    }
    handleRadio(e){

        console.log('radio:',e.target.value)
        this.setState({
            radioAsc:e.target.value==="ASC"?true:false,
            radioDesc:e.target.value==="DESC"?true:false,
            valueRadioSort:e.target.value
        })
    }
    handleDocsPerPage(e){
        console.log("documentos por página:",e.target.value)
        this.setState({
            docsPerPage:e.target.value
        })
    }
    handleSort(e){
        console.log("select sort: ",e.target.value)
        this.setState({
            sortBy:e.target.value
        })
    }
    async handleTagsChangeTags(tags){
        console.log(tags);
        this.setState({
            tagsSelecionadas:tags || []
        })
    }
    handleShowfilter(){
        const {showFilter} = this.state
        this.setState({showFilter:!showFilter})
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
        },()=>this.getExercicios())
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        }/*,()=>this.getExercicios()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getExercicios()*/)
        
    }
    filterSeash(e){
        e.preventDefault()
        this.getExercicios()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getExercicios())
        
    }
    handleShowModalInfo(question){
        console.log(question);
        this.setState({
            question:question,
            showModalInfo:true,
        })
    }
    handleCloseshowModalInfo(e){
        this.setState({showModalInfo:false})
    }

    render() {
        const {showModalInfo,question} = this.state


        return (
        <TemplateSistema active='exercicios'>
            <Row mb={15}>
                <Col xs={12}>
                <h5 style={{margin:'0px'}}> 
                    Exercícios
                </h5> 
                </Col>
            </Row>
            <ExerciciosPaginadosScreen
                {...this.state}
                {...this.props}
                handleShowfilter = {this.handleShowfilter.bind(this)}
                filterSeash = {this.filterSeash.bind(this)}
                handleContentInputSeach = {this.handleContentInputSeach.bind(this)}
                handleSelectfildFilter = {this.handleSelectfildFilter.bind(this)}
                handleSort = {this.handleSort.bind(this)}
                handleRadio = {this.handleRadio.bind(this)}
                handleDocsPerPage = {this.handleDocsPerPage.bind(this)}
                handleTagsChangeTags = {this.handleTagsChangeTags.bind(this)}
                handleShowModalInfo = {this.handleShowModalInfo.bind(this)}
                handlePage = {this.handlePage.bind(this)}
            />
            <SwalModal
                show={showModalInfo}
                title="Exercício"
                handleModal={this.handleCloseshowModalInfo.bind(this)}
                width={'90%'}
            >
            <Card>
                <CardHead>
                    <CardTitle>
                        {question && question.title}
                    </CardTitle>
                </CardHead>
                <CardBody>
                    <Row>
                        <b>Descrição: </b>
                    </Row>
                    <Row>
                        {question && question.description}
                    </Row>
                    <Row>
                        <Col xs={12} textCenter>
                            <BlockMath>{(question && question.katexDescription) || ''}</BlockMath>
                        </Col>
                    </Row>
                
                </CardBody>
                <CardFooter>
                    <Row>
                        <Col xs={12} mb={15}>
                            <b>Autor:</b> {question && question.author.email} 
                        </Col>
                        <Col xs={12} mb={15}>
                            <b>Tags: </b> {question && question.tags.join(", ")}
                        </Col>
                        <Col xs={12}>
                            <b>Data de criação:</b> {question && formatDate(question.createdAt)} 
                        </Col>
                    </Row>
                </CardFooter>
            </Card>
            </SwalModal>
        </TemplateSistema>
        )
    }
}