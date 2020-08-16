import React,{Fragment} from "react"
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ProgressBar from "components/ui/ProgressBar/progressBar.component";

export default props =>{
    const {prova,participant,user} = props
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
    return (
        <Row mb={15}>
            <Col xs={12}>
            <Card>
                <CardHead>
                <Col xs={4} pl={0}>
                    <h4 style={{ margin: "0px" }}>
                    <b>{prova && prova.title}</b>
                    </h4>
                </Col>
                <ProgressBar 
                    numQuestions={prova && prova.questionsCount}
                    numQuestionsCompleted={prova && prova.questionsCompletedSumissionsCount}
                    dateBegin={prova && prova.classHasTest.createdAt}
                    width={100}
                />
                </CardHead>
                <CardBody>
                <Row>
                    {prova &&
                    prova.questions.map((question, j) => (
                        <Fragment key={j}>
                        <Col xs={12} md={6}>
                            <Card>
                            <CardHead>
                                <CardTitle>
                                <b>
                                    {question.title}&nbsp;
                                    {question.isCorrect > 0 ? (
                                    <i
                                        className="fa fa-check"
                                        style={{ color: "#0f0" }}
                                    />
                                    ) : null}
                                </b>
                                </CardTitle>
                                <CardOptions>
                                <i
                                    title="Ver descrição"
                                    style={{
                                    color: "blue",
                                    cursor: "pointer",
                                    fontSize: "25px"
                                    }}
                                    className={`fe fe-chevron-down`}
                                    data-toggle="collapse"
                                    data-target={
                                    "#collapse2" + j + (prova && prova.id)
                                    }
                                    aria-expanded={false}
                                />
                                </CardOptions>
                            </CardHead>
                            <div
                                className="collapse"
                                id={"collapse2" + j + (prova && prova.id)}
                            >
                                <CardBody>
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
                                </CardBody>
                            </div>
                            <CardFooter>
                                {(profile==="professor" && participant)?
                                        <span>Submissões do aluno: {question.submissionsCount}</span>
                                    :
                                        <span>Suas submissões: {question.submissionsCount}</span>
                                }
                                {/* Suas submissões: {question.submissionsCount} */}
                                {(profile==="aluno")?
                                <Link to={`/aluno/turma/${props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}>
                                    <button
                                        className="btn btn-success mr-2"
                                        style={{ float: "right" }}
                                    >
                                        Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                </Link>
                                :
                                (profile==="professor") && participant? (
                                    <Link to={`/professor/turma/${props.match.params.id}/participantes/${user.id}/provas/${prova && prova.id}/exercicio/${question.id}`} >
                                        <button
                                            className="btn btn-success mr-2"
                                            style={{ float: "right" }}
                                        >
                                            Ver submissões{" "}
                                            <i className="fa fa-wpexplorer" />
                                        </button>
                                    </Link>
                                )
                                :
                                (profile==="professor")?(
                                    <Link to={`/professor/turma/${props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}>
                                    <button
                                        className="btn btn-success mr-2"
                                        style={{ float: "right" }}
                                    >
                                        Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                </Link>
                                )
                                :
                                    null
                                }
                            </CardFooter>
                            </Card>
                        </Col>
                        </Fragment>
                    ))}
                </Row>
                </CardBody>
            </Card>
            </Col>
        </Row>

    )
}