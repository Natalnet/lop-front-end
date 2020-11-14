import React,{Fragment} from "react"
import Card from "../ui/card/card.component";
import CardHead from "../ui/card/cardHead.component";
import CardOptions from "../ui/card/cardOptions.component";
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import ProgressBar from "../ui/ProgressBar/progressBar.component";
import { Link } from "react-router-dom";

export default props =>{
    const {listas,removerLista,user,participant} = props
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
    return (
        <Row mb={15}>
            {listas.map((lista, i) => {
                return (
                    <Fragment key={lista.id}>
                    <Col xs={12} >
                        <Card className="mb-2" >
                        <CardHead>
                            <Col xs={5}>
                            <h4 style={{ margin: "0px" }}>
                                <b>{lista.title}</b>
                            </h4>
                            </Col>
                            <ProgressBar 
                                numQuestions={lista.questionsCount}
                                numQuestionsCompleted={lista.questionsCompletedSumissionsCount}
                                dateBegin={lista.classHasListQuestion.createdAt}
                                dateEnd={lista.classHasListQuestion.submissionDeadline}
                            />
                            <CardOptions>
                                {(profile==="aluno")?(
                                    <Link
                                        to={`/aluno/turma/${props.match.params.id}/lista/${lista.id}`}
                                    >
                                        <button className="btn btn-success mr-2">
                                            Acessar <i className="fa fa-wpexplorer" />
                                        </button>
                                    </Link>
                                )
                                :
                                (profile==="professor") && participant?(
                                    <Link to={`/professor/turma/${props.match.params.id}/participantes/${user.id}/listas/${lista.id}/exercicios`}
                                        >
                                        <button className="btn btn-success">
                                            Acessar <i className="fa fa-wpexplorer" />
                                        </button>
                                    </Link>
                                )
                                :
                                (profile==="professor") ?(
                                    <>
                                    <Link to={`/professor/turma/${props.match.params.id}/lista/${lista.id}`} >
                                        <button className="btn btn-success mr-2">
                                            Acessar <i className="fa fa-wpexplorer" />
                                        </button>
                                    </Link>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removerLista(lista)}
                                    >
                                        <i className="fa fa-trash " />
                                    </button>
                                    </>
                                )
                                :
                                    null
                                }
                            </CardOptions>
                        </CardHead>
                        </Card>
                    </Col>
                    </Fragment>
                );
                })
            }
        </Row>
      )
}