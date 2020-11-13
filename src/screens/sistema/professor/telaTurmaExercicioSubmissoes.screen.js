import React, { Component, Fragment } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import TemplateSistema from "../../../components/templates/sistema.template";
import api from "../../../services/api";
import Row from "../../../components/ui/grid/row.component";
import Col from "../../../components/ui/grid/col.component";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import CardFooter from "../../../components/ui/card/cardFooter.component";
import { Load } from "../../../components/ui/load";
import moment from "moment";
import { BlockMath } from "react-katex";
//import HTMLFormat from "../../../components/ui/htmlFormat";
import AceEditorWrapper from "../../../components/templates/aceEditorWrapper.template";
import * as B from "../../../components/ui/blockly";
import { isXml } from '../../../util/auxiliaryFunctions.util';
export default class telaTurmaExercicioSubmissoes extends Component {
    constructor(props) {
      super(props);
      this.state = {
        users: [],
        loadingInfoTurma: true,
        turma: "",
        lista: null,
        question: null,
        loadingPage: true,
        loadUserSubmissionsByList: false
      };
    }
    async componentDidMount(){
        await this.getInfoTurma();
        await this.getList()
        await this.getUsersWithLastSubmissionByQuestionByListByClass();
        const { turma, lista } = this.state;
        document.title = `${turma && turma.name} - ${lista && lista.title}`;
    }

    async getInfoTurma() {
        const id = this.props.match.params.id;
        const { myClasses } = this.state;
        if (myClasses && typeof myClasses === "object") {
          const index = myClasses.map((c) => c.id).indexOf(id);
          if (index !== -1) {
            this.setState({
              turma: myClasses[index],
            });
          }
          this.setState({ loadingInfoTurma: false });
          return null;
        }
        try {
          const response = await api.get(`/class/${id}`);
          this.setState({
            turma: response.data,
            loadingInfoTurma: false,
            
          });
        } catch (err) {
          this.setState({ loadingInfoTurma: false });
          console.log(err);
        }
    }

    async getList(idExercicio = this.props.match.params.idExercicio ){
        this.setState({loadUserSubmissionsByList: true})
        const {id, idLista} = this.props.match.params;
        const query = `idClass=${id}`
        try{
            const response = await api.get(`/listQuestion/${idLista}?${query}`);
            //console.log('response: ',response.data)
            this.setState({
                lista:  response.data,
                question: response.data.questions.find(q=>q.id===idExercicio),
                loadUserSubmissionsByList:false,
            })
        }
        catch(err){
            console.log(err)
        }
    }
    async getUsersWithLastSubmissionByQuestionByListByClass(idExercicio =this.props.match.params.idExercicio ){
        this.setState({loadUserSubmissionsByList: true})
        //console.log('id/question: ',idExercicio)
        const {id, idLista} = this.props.match.params;
        try{
            const response = await api.get(`user/list/${idLista}/class/${id}/question/${idExercicio}`)
            //console.log('response: ',response.data)
            this.setState({
                users: response.data,
                loadUserSubmissionsByList:false,
                loadingPage: false
            })
        }
        catch(err){
            console.log(err)
        }
    }

    async handleQuestion(url,idQuestion){
        window.location.replace(url)
    }
    
    render(){
        const { users , turma, lista, loadingInfoTurma, question, loadingPage, loadUserSubmissionsByList} = this.state;
        return(
            <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
                <Row mb={15}>
                    <Col xs={12}>
                        {loadingInfoTurma ? (
                            <Load/>
                        ) : (
                        <h5 style={{ margin: "0px", display: "inline" }}>
                            <i className="fa fa-users mr-2" aria-hidden="true" />
                            {turma && turma.name} - {turma && turma.year}.
                            {turma && turma.semester}
                            <i className="fa fa-angle-left ml-2 mr-2" />
                            <Link
                                
                                to={`/professor/turma/${this.props.match.params.id}/listas`}
                                >
                                Listas
                            </Link>
                            <i className="fa fa-angle-left ml-2 mr-2" />
                            {lista ? (
                                <>
                            <Link
                                to={`/professor/turma/${this.props.match.params.id}/lista/${this.props.match.params.idLista}`}
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
                {loadingPage?
                    <Load/>
                :
                <>
                <Row>
                    <Col xs={12}>
                    {
                        lista && lista.questions.map(question=>
                            <button 
                                key={question.id}
                                onClick={()=>this.handleQuestion(`/professor/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}/submissoes`,question.id)}
                                className={`btn ${question.id===this.props.match.params.idExercicio?'btn-primary disabled':'btn-outline-primary'} mr-5 mb-5`}
                            >
                                {question.title}
                            </button>
                        )
                    }
                    </Col>
                </Row>
                {
                loadUserSubmissionsByList?
                    <Load/>
                :
                <>
                <Row mb={20}>
                    <Col xs={12}>
                        <Card className="card-status-primary">
                            <CardHead>
                                <CardTitle>
                                <b><i className="fa fa-code mr-2"/> {question.title}</b>
                                </CardTitle>
                            </CardHead>
                            <CardBody className="overflow-auto">
                                <Row>
                                    <Col xs={12}>
                                        {/* <HTMLFormat>
                                            {question.description}
                                        </HTMLFormat> */}
                                        <SunEditor 
                                            lang="pt_br"
                                            height="auto"
                                            disable={true}
                                            showToolbar={false}
                                            // onChange={this.handleDescriptionChange.bind(this)}
                                            setContents={question.description}
                                            setDefaultStyle="font-size: 15px; text-align: justify"
                                            setOptions={{
                                                toolbarContainer : '#toolbar_container',
                                                resizingBar : false,
                                                katex: katex,
                                            }}
                                        />
                                        {question.katexDescription ? (
                                            <BlockMath>{question.katexDescription}</BlockMath>
                                        ) : (
                                            ""
                                        )}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                {
                    users.map((user, j) => 
                        <Fragment key={j}>
                            <Col xs={12} md={6}>
                                <Card>
                                    <CardHead>
                                        <CardTitle>
                                            <b>{user.name} - {user.enrollment}</b>
                                        </CardTitle>
                                    </CardHead>
                                    <CardBody>
                                        <Row>
                                            <Col xs={6}>
                                                <b>Score:
                                                <span
                                                    style={{
                                                        color: `${
                                                            parseFloat(user.lastSubmission.hitPercentage) === 100
                                                            ? "#5eba00"
                                                            : "#f00"
                                                        }`,
                                                    }}
                                                > {user.lastSubmission.hitPercentage}% 
                                                </span>
                                                </b> 
                                            </Col>
                                            <Col xs={6}>
                                                <b>N° de variação de caracteres:</b> {user.lastSubmission.char_change_number}
                                            </Col>
                                            
                                            <Col xs={6}>
                                                <b>Tempo gasto:</b> {parseInt(user.lastSubmission.timeConsuming / 1000 / 60)} min {parseInt((user.lastSubmission.timeConsuming / 1000) % 60)} seg
                                            </Col>
                                            <Col xs={6}>
                                                <b>Ambiente:</b> {user.lastSubmission.environment}
                                            </Col>
                                            <Col xs={6}>
                                                <b>Data:</b> {moment(user.lastSubmission.createdAt).local().format('DD/MM/YYYY - HH:mm')}
                                            </Col>
                                            <Col xs={6}>
                                                <b>Linguagem: </b> {user.lastSubmission.language}
                                            </Col>
                                            <Col xs={12}>
                                                <b>Ip: </b> {user.lastSubmission.ip}
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                    {
                                                                    user.lastSubmission.language === 'blockly' ?
                                                                        <B.BlocklyComponent
                                                                            //ref={this.simpleWorkspace}
                                                                            readOnly={true}
                                                                            trashcan={true}
                                                                            media={'media/'}
                                                                            move={{
                                                                                scrollbars: true,
                                                                                drag: true,
                                                                                wheel: true
                                                                            }}
                                                                            initialXml={isXml(user.lastSubmission.answer) ? user.lastSubmission.answer : ''}>
                                                                            <B.Category name="Text" colour="20">
                                                                                <B.Block type="text" />
                                                                                <B.Block type="text_print" />
                                                                                <B.Block type="text_prompt" />
                                                                            </B.Category>
                                                                            <B.Category name="Variables" colour="330" custom="VARIABLE"></B.Category>
                                                                            <B.Category name="Logic" colour="210">
                                                                                <B.Block type="controls_if" />
                                                                                <B.Block type="controls_ifelse" />
                                                                                <B.Block type="logic_compare" />
                                                                                <B.Block type="logic_operation" />
                                                                                <B.Block type="logic_boolean" />
                                                                                <B.Block type="logic_null" />
                                                                                <B.Block type="logic_ternary" />
                                                                            </B.Category>
                                                                            <B.Category name="Loops" colour="120">
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
                                                                            <B.Category name="Math" colour="230">
                                                                                <B.Block type="math_number" />
                                                                                <B.Block type="math_arithmetic" />
                                                                                <B.Block type="math_single" />
                                                                                <B.Block type="math_round" />
                                                                            </B.Category>
                                                                            <B.Category name="Functions" colour="290" custom="PROCEDURE"></B.Category>
                                                                        </B.BlocklyComponent>
                                                                        :
                                                                        <AceEditorWrapper
                                                                            mode={user.lastSubmission.language}
                                                                            theme="monokai"
                                                                            focus={false}
                                                                            value={user.lastSubmission.answer || ""}
                                                                            fontSize={14}                                                                       
                                                                            readOnly={true}
                                                                            width="100%"
                                                                            showPrintMargin={false}
                                                                            name="ACE_EDITOR"
                                                                            showGutter={true}
                                                                            highlightActiveLine={true}
                                                                        />
                                                                }
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Fragment>
                    )}
                    </Row>
                        
                    <Row>
                        <Col xs={12}>
                        {
                            lista && users && users.length > 2 && lista.questions.map(question=>
                                <button 
                                    key={question.id}
                                    onClick={()=>this.handleQuestion(`/professor/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}/submissoes`,question.id)}
                                    className={`btn ${question.id===this.props.match.params.idExercicio?'btn-primary disabled':'btn-outline-primary'} mr-5 mb-5`}
                                >
                                    {question.title}
                                </button> 
                            )
                        }
                        </Col>
                    </Row>
                </>
                }
                </>
                }
        </TemplateSistema>
        )
    }
}