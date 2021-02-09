import React,{Fragment} from "react"
import Card from "../ui/card/card.component";
import CardHead from "../ui/card/cardHead.component";
import CardOptions from "../ui/card/cardOptions.component";
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import ProgressBar from "../ui/ProgressBar/progressBar.component";
import { Link } from "react-router-dom";

export default (props) => {
  const { provas, acessar, user, removerProva, participant } = props;
  const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase();
  return (
    <Row mb={15}>
      {provas.map((prova, i) => {
        return (
          <Fragment key={prova.id}>
            <Col xs={12}>
              <Card key={prova.id} className="mb-2">
                <CardHead>
                  <Col xs={5}>
                    <h4 style={{ margin: "0px" }}>
                      <b>{prova.title}</b>
                    </h4>
                  </Col>
                  <ProgressBar
                    numQuestions={prova.questionsCount}
                    numQuestionsCompleted={
                      prova.questionsCompletedSumissionsCount
                    }
                    dateBegin={prova.classHasTest.createdAt}
                  />
                  <CardOptions>
                    {profile === "aluno" ? (
                      <>
                        {prova.classHasTest.correcao === "DISPONIVEL" ? (
                          <Link

                          ///aluno/turma/:idClass/prova/:idTest/feedback/
                            to={`/aluno/turma/${props.match.params.id}/prova/${prova.id}/feedback/${0}`}
                          >
                            <button className="btn btn-primary ml-2 mr-2">
                              Correções <i className="fe fe-file-text" />
                            </button>
                          </Link>
                        ) :
                          <button className="btn btn-primary ml-2 mr-2" disabled>
                            Correções <i className="fe fe-file-text" />
                          </button>
                        }
                        {prova.classHasTest.status === "ABERTA" ? (
                          <button
                            className="btn btn-success mr-2"
                            style={{ float: "right" }}
                            onClick={() => acessar(prova)}
                          >
                            Acessar <i className="fa fa-wpexplorer" />
                          </button>
                        ) : 
                          <button
                            className="btn btn-success mr-2" disabled
                            style={{ float: "right" }}
                          >
                            Acessar <i className="fa fa-wpexplorer" />
                          </button>
                        }
                      </>
                    ) : profile === "professor" && participant ? (
                      <Link
                        to={`/professor/turma/${props.match.params.id}/participantes/${user.id}/provas/${prova.id}/exercicios`}
                      >
                        <button className="btn btn-success">
                          Acessar <i className="fa fa-wpexplorer" />
                        </button>
                      </Link>
                    ) : profile === "professor" ? (
                      <>
                        <Link
                          to={`/professor/turma/${props.match.params.id}/correcaoprovas/${prova.id}`}
                          style={{ marginRight: "-7px" }}
                        >
                          <button className="btn btn-primary mr-2">
                            Corrigir <i className="fe fe-file-text" />
                          </button>
                        </Link>
                        <Link
                          to={`/professor/turma/${props.match.params.id}/prova/${prova.id}`}
                        >
                          <button className="btn btn-success mr-2">
                            Acessar <i className="fa fa-wpexplorer" />
                          </button>
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => removerProva(prova)}
                        >
                          <i className="fa fa-trash " />
                        </button>
                      </>
                    ) : null}
                  </CardOptions>
                </CardHead>
              </Card>
            </Col>
          </Fragment>
        );
      })}
    </Row>
  );
};
