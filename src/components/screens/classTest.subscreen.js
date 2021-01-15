import React, { Fragment, useMemo } from "react"
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Link } from "react-router-dom";
import Card from "../ui/card/card.component";
import CardHead from "../ui/card/cardHead.component";
import CardOptions from "../ui/card/cardOptions.component";
import CardTitle from "../ui/card/cardTitle.component";
import CardBody from "../ui/card/cardBody.component";
import CardFooter from "../ui/card/cardFooter.component";
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import ProgressBar from "../ui/ProgressBar/progressBar.component";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
// import useClass from '../../hooks/useClass';
// import useTest from '../../hooks/useTest';
import useQuestion from '../../hooks/useQuestion';
// import useUser from '../../hooks/useUser';

export default props => {
    const { prova, participant, user } = props;

    const profile = useMemo(() => sessionStorage.getItem("user.profile").toLowerCase(), []);

    const { getIconTypeQuestion } = useQuestion();

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
                                                        <p
                                                            className='d-flex m-0'
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                        >
                                                            {question.isCorrect && (
                                                                <span>
                                                                    <FaCheck size={15} color='#5eba00' className='mr-2' />
                                                                </span>
                                                            )}
                                                            {
                                                                getIconTypeQuestion(question.type)
                                                            }

                                                            {question.title}
                                                        </p>
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
                                                                toolbarContainer: '#toolbar_container',
                                                                resizingBar: false,
                                                                katex: katex,
                                                            }}
                                                        />
                                                    </CardBody>
                                                </div>
                                                <CardFooter>
                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between"
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                // width:"100%",
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems: "center",

                                                            }}
                                                        >
                                                            {(profile === "professor" && participant) ?
                                                                <span>Submissões do aluno: {question.submissionsCount}</span>
                                                                :
                                                                <span > Suas submissões: {question.submissionsCount}</span>
                                                            }
                                                        </div>
                                                        <div
                                                            style={{
                                                                // width:"100%",
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems: "center",

                                                            }}
                                                        >
                                                            {/* Suas submissões: {question.submissionsCount} */}
                                                            {(profile === "aluno") ?
                                                                <Link to={`/aluno/turma/${props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}>
                                                                    <button
                                                                        className="btn btn-success mr-2"
                                                                        style={{ float: "right" }}
                                                                    >
                                                                        Acessar <i className="fa fa-wpexplorer" />
                                                                    </button>
                                                                </Link>
                                                                :
                                                                (profile === "professor") && participant ? (
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
                                                                    (profile === "professor") ? (
                                                                        <>
                                                                            <Link to={`/professor/turma/${props.match.params.id}/prova/${prova && prova.id}/questao/${question.id}`}>
                                                                                <button
                                                                                    className="btn btn-success mr-2"
                                                                                    style={{ marginLeft: "auto" }}
                                                                                >
                                                                                    Acessar <i className="fa fa-wpexplorer" />
                                                                                </button>
                                                                            </Link>
                                                                            {question.type === 'PROGRAMAÇÃO' &&
                                                                                <>
                                                                                    <span style={{ cursor: 'pointer' }} className="card-dropdown h-100" data-toggle="dropdown" aria-expanded="false">
                                                                                        <BsThreeDotsVertical size={25} />
                                                                                    </span>
                                                                                    <div className="dropdown-menu dropdown-menu-demo">
                                                                                        <Link className="dropdown-item" to={`/professor/turma/${props.match.params.id}/prova/${prova && prova.id}/exercicio/${question.id}/submissoes`}>
                                                                                            Ver última submissão dos alunos
                                                                                        </Link>
                                                                                        <Link className="dropdown-item" to={`/professor/turma/${props.match.params.id}/prova/${prova && prova.id}/exercicio/${question.id}/submissoes/plagio`}>
                                                                                            Verificar Plágios
                                                                                        </Link>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    )
                                                                        :
                                                                        null
                                                            }
                                                        </div>
                                                    </div>
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