import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import moment from "moment";
import { BlockMath } from "react-katex";
import HTMLFormat from "components/ui/htmlFormat";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/javascript";
import "brace/theme/monokai";

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
        await this.getUserSubmissionsByList();
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
    async getUserSubmissionsByList(idExercicio =this.props.match.params.idExercicio ){
        this.setState({loadUserSubmissionsByList:true})
        const {id, idLista} = this.props.match.params;
        try{
            const response = await api.get(`/listQuestion/${idLista}/class/${id}/question/${idExercicio}`)
            console.log('question: ',response.data)
            this.setState({
                users: response.data.users,
                lista:  response.data.list,
                question: response.data.list.questions.find(q=>q.id===idExercicio),
                loadUserSubmissionsByList:false,
                loadingPage: false
            })
            
        }
        catch(err){
            console.log(err)
        }
    }
    async handleQuestion(url,idQuestion){
        this.props.history.push(url);
        this.getUserSubmissionsByList(idQuestion);

    }
    
    render(){
        
        const { users , turma, lista, loadingInfoTurma, question, loadingPage, loadUserSubmissionsByList} = this.state;
        return(
            <TemplateSistema {...this.props} active={"listas"} submenu={"telaTurmas"}>
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
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                :
                <>
                <Row>
                    <Col xs={12}>
                    {
                        lista && lista.questions.map(question=>
                            <button 
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
                    <div className="loader" style={{ margin: "0px auto" }}></div>
                :
                <>
                <Row mb={20}>
                    <Col xs={12}>
                        <Card className="card-primary card-status-primary">
                            <CardHead>
                                <CardTitle>
                                <b><i className="fa fa-code mr-2"/> {question.title}</b>
                                </CardTitle>
                            </CardHead>
                            <CardBody className="overflow-auto">
                                <Row>
                                    <Col xs={12}>
                                        <HTMLFormat>
                                            {question.description}
                                        </HTMLFormat>
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
                                    <AceEditor
                                        mode={
                                            user.lastSubmission.language === "cpp" ? "c_cpp" : user.lastSubmission.language
                                        }
                                        readOnly={true}
                                        width={"100%"}
                                        focus={false}
                                        theme="monokai"
                                        showPrintMargin={false}
                                        value={user.lastSubmission.answer || ""}
                                        fontSize={14}
                                        name="ACE_EDITOR_RES"
                                        editorProps={{ $blockScrolling: true }}
                                    />
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