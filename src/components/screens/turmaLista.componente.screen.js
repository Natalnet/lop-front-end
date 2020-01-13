import React,{Fragment} from "react"
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
    const {lista,participant} = props
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
    return (
        <Row mb={15}>
            <Col xs={12}>
            <Card>
                <CardHead style={{ margin: "0px" }}>
                <Col xs={4} pl={0}>
                    <h4 style={{ margin: "0px" }}>
                    <b>{lista && lista.title}</b>
                    </h4>
                </Col>
                <ProgressBar 
                    numQuestions={lista && lista.questionsCount}
                    numQuestionsCompleted={lista && lista.questionsCompletedSumissionsCount}
                    dateBegin={lista && lista.classHasListQuestion.createdAt}
                    dateEnd={lista && lista.classHasListQuestion.submissionDeadline}
                    width={100}
                />
                </CardHead>
                <CardBody>
                <Row>
                    {lista &&
                    lista.questions.map((question, j) => (
                        <Fragment key={j}>
                        <Col xs={12} md={6}>
                            <Card>
                            <CardHead>
                                <CardTitle>
                                <b>
                                    {question.title}&nbsp;
                                    {question.isCorrect ? (
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
                                    "#collapse2" + j + (lista && lista.id)
                                    }
                                    aria-expanded={false}
                                />
                                </CardOptions>
                            </CardHead>
                            <div
                                className="collapse"
                                id={"collapse2" + j + (lista && lista.id)}
                            >
                                <CardBody>{question.description}</CardBody>
                            </div>
                            <CardFooter>
                                Suas submissões: {question.submissionsCount}
                                {(profile==="aluno")?(
                                    <Link to={`/aluno/turma/${props.match.params.id}/lista/${lista.id}/exercicio/${question.id}`}>
                                    <button
                                        className="btn btn-success mr-2"
                                        style={{ float: "right" }}
                                    >
                                        Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                    </Link>
                                )
                                :
                                (profile==="professor" && participant)?(
                                    <Link to={`/professor/turma/${props.match.params.id}/participantes/${props.match.params.idUser}/listas/${lista && lista.id}/exercicio/${question.id}`}>
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
                                    <Link to={`/professor/turma/${props.match.params.id}/lista/${lista.id}/exercicio/${question.id}`}>
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