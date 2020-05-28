import React from "react";
import { BlockMath } from "react-katex";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/github";
import "brace/theme/tomorrow";
import "brace/theme/kuroir";
import "brace/theme/twilight";
import "brace/theme/xcode";
import "brace/theme/textmate";
import "brace/theme/solarized_dark";
import "brace/theme/solarized_light";
import "brace/theme/terminal";
import HTMLFormat from "components/ui/htmlFormat";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardOptions from "components/ui/card/cardOptions.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default (props) => {
  const {
    title,
    description,
    results,
    katexDescription,
    solution,
    answer,
  } = props;
  const { loadingReponse } = props;
  const { language, theme, descriptionErro } = props;
  /*let {
    comments,
    compilation_error,
    runtime_error,
    presentation_error,
    wrong_answer,
    invalid_algorithm,
    hitPercentage,
    teacherNote,
  } = props;*/
  const {
    changeLanguage,
    changeTheme,
    handleAnswer,
    submeter,
    SaveData,
  } = props;
  const {
    checkBox1,
    checkBox2,
    checkBox3,
    checkBox4,
    checkBox5,
    commentQuestion,
    funcTeacherNote,
  } = props;
  const themes = [
    "monokai",
    "github",
    "tomorrow",
    "kuroir",
    "twilight",
    "xcode",
    "textmate",
    "solarized_dark",
    "solarized_light",
    "terminal",
  ];
  console.log("languages: ", props.languages);
  const languages = props.languages || ["javascript", "cpp"];
  console.log("showAllTestCases:", props.showAllTestCases);
  let tests = props.showAllTestCases
    ? results
    : results.filter((t, i) => i === 0);

  return (
    <>
      <Row mb={10}>
        <Col xs={12}>
          <Card className="card-primary card-status-primary">
            <CardHead>
              <CardTitle>
                <b>
                  <i className="fa fa-code mr-2" /> {title}
                </b>
              </CardTitle>
            </CardHead>
            <CardBody className="overflow-auto">
              <Row>
                {props.loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <Col xs={12} md={7}>
                    {description}
                    {katexDescription ? (
                      <BlockMath>{katexDescription}</BlockMath>
                    ) : (
                      ""
                    )}
                  </Col>
                )}
                {props.loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <Col xs={12} md={5}>
                    <table className="table table-exemplo">
                      <tbody>
                        <tr>
                          <td className="pt-0">
                            <b>Exemplo de entrada</b>
                          </td>
                          <td className="pt-0">
                            <b>Exemplo de saída</b>
                          </td>
                        </tr>
                        {results
                          .map((res, i) => (
                            <tr key={i}>
                              <td>
                                <HTMLFormat>{res.inputs}</HTMLFormat>
                              </td>
                              <td>
                                <HTMLFormat>{res.output}</HTMLFormat>
                              </td>
                            </tr>
                          ))
                          .filter((res, i) => i < 2)}
                      </tbody>
                    </table>
                  </Col>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row mb={10}>
        <Col xs={4} md={2}>
          <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
          <select className="form-control" onChange={(e) => changeLanguage(e)}>
            {languages.map((lang) => {
              const language =
                lang === "javascript"
                  ? "JavaScript"
                  : lang === "cpp"
                  ? "C++"
                  : "";
              return (
                <option key={lang} value={lang}>
                  {language}
                </option>
              );
            })}
          </select>
        </Col>
        <Col xs={4} md={2}>
          <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
          <select
            defaultValue="monokai"
            className="form-control"
            onChange={(e) => changeTheme(e)}
          >
            {themes.map((thene) => (
              <option key={thene} value={thene}>
                {thene}
              </option>
            ))}
          </select>
        </Col>
        <Col xs={4} md={2}>
          <label htmlFor="selectDifficul">&nbsp;</label>
          <button
            style={{ width: "100%" }}
            className={`btn btn-primary ${loadingReponse && "btn-loading"}`}
            onClick={(e) => submeter(e)}
          >
            <i className="fa fa-play" /> <i className="fa fa-gears" />{" "}
            &nbsp;&nbsp; Submeter
          </button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Card>
            {props.loadingQuestoes ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <AceEditor
                mode={language === "cpp" ? "c_cpp" : language}
                theme={theme}
                focus={false}
                onChange={handleAnswer}
                value={answer}
                fontSize={14}
                width="100%"
                showPrintMargin={false}
                name="ACE_EDITOR"
                showGutter={true}
                highlightActiveLine={true}
              />
            )}
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            {props.loadingQuestoes ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <AceEditor
                mode={language === "cpp" ? "c_cpp" : language}
                theme={theme}
                focus={false}
                value={solution}
                fontSize={14}
                width="100%"
                showPrintMargin={false}
                name="ACE_EDITOR"
                showGutter={true}
                highlightActiveLine={true}
                readOnly={true}
              />
            )}
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card className="card-results">
            <CardHead>
              <CardTitle>Resultados</CardTitle>
            </CardHead>
            {loadingReponse ? (
              <div className="loader" style={{ margin: "100px auto" }}></div>
            ) : descriptionErro ? (
              <Card>
                {props.loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <CardBody className=" p-0 ">
                    <div class="alert alert-icon alert-danger" role="alert">
                      <HTMLFormat>{descriptionErro}</HTMLFormat>
                    </div>
                  </CardBody>
                )}
              </Card>
            ) : (
              <>
                {tests.map((teste, i) => (
                  <Card
                    key={i}
                    className={`card-status-${
                      teste.isMatch ? "success" : "danger"
                    }`}
                  >
                    <CardHead>
                      <CardTitle>
                        {`${i + 1}° Teste `}
                        {teste.isMatch ? (
                          <i
                            className="fa fa-smile-o"
                            style={{ color: "green" }}
                          />
                        ) : (
                          <i
                            className="fa fa-frown-o"
                            style={{ color: "red" }}
                          />
                        )}
                      </CardTitle>
                      <CardOptions>
                        <i
                          title="Ver descrição"
                          style={{
                            color: "blue",
                            cursor: "pointer",
                            fontSize: "25px",
                          }}
                          className={`fe fe-chevron-down`}
                          data-toggle="collapse"
                          data-target={"#collapse" + i}
                          aria-expanded={false}
                        />
                      </CardOptions>
                    </CardHead>
                    <div className="collapse" id={"collapse" + i}>
                      <CardBody className="p-0 overflow-auto">
                        {teste.descriptionErro ? (
                          <HTMLFormat>{`${teste.descriptionErro}`}</HTMLFormat>
                        ) : (
                          <table className="table" wrap="off">
                            <tbody>
                              <tr>
                                <td>
                                  <b>Entrada(s) para teste</b>
                                </td>
                                <td>
                                  <b>Saída do seu programa</b>
                                </td>
                                <td>
                                  <b>Saída esperada</b>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <HTMLFormat>{teste.inputs}</HTMLFormat>
                                </td>
                                <td>
                                  <HTMLFormat>{teste.saidaResposta}</HTMLFormat>
                                </td>
                                <td>
                                  <HTMLFormat>{teste.output}</HTMLFormat>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </CardBody>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="card-results">
            <CardHead>
              <CardTitle>Feed Back</CardTitle>
            </CardHead>
            <CardBody className=" p-0 ">
              {props.loadingQuestoes ? (
                <div className="loader" style={{ margin: "0px auto" }}></div>
              ) : (
                <form
                  className="form-group"
                  style={{ marginRight: "5px", marginLeft: "5px" }}
                >
                  <Row>
                    <Col xs={10} md={4}>
                      <label htmlFor="selectDifficulty">
                        Nota do Sistema:{" "}
                      </label>
                      <input
                        style={{ textAlign: "center" }}
                        className={"form-control"}
                        type={"text"}
                        maxLength={"5"}
                        value={props.hitPercentage}
                      ></input>
                    </Col>

                    <Col xs={10} md={4}>
                      <label htmlFor="selectDifficulty">
                        Nota do professor:
                      </label>
                      <input
                        style={{ textAlign: "center" }}
                        className={`form-control ${
                          parseFloat(props.teacherNote) >= 10 ||
                          parseFloat(props.teacherNote) <= 0
                            ? "is_invalid"
                            : "is_valid"
                        }`}
                        onChange={(e) => funcTeacherNote(e)}
                        type={"text"}
                        maxLength={"5"}
                        value={props.teacherNote}
                      ></input>
                    </Col>

                    <Col xs={10} md={4}>
                      <label htmlFor="rascunho">&nbsp;</label>
                      <button
                        style={{ width: "100%" }}
                        className={"btn btn-azure"}
                        onClick={(e) => SaveData(e)}
                      >
                        <i className="fa fa-floppy-o" />
                        &nbsp;&nbsp; Salvar Dados
                      </button>
                    </Col>
                  </Row>
                  <label
                    className="form-label"
                    style={{ marginLeft: "10px", marginTop: "5px" }}
                  >
                    Comentário da questão:
                  </label>
                  <textarea
                    className="form-control"
                    name="example-textarea-input"
                    rows="6"
                    placeholder="Digite.."
                    onChange={(e) => commentQuestion(e)}
                    value={props.comments}
                  ></textarea>

                  <div
                    className="custom-controls-stacked"
                    style={{ marginTop: "20px" }}
                  >
                    <Row>
                      <Col xs={12} md={6}>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="compilation_error"
                            value={props.compilation_error}
                            onChange={() => checkBox1()}
                          />
                          <span className="custom-control-label">
                            Erro de compilação
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name={props.runtime_error}
                            onChange={() => checkBox2()}
                          />
                          <span className="custom-control-label">
                            Erro no tempo de Execução
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name={props.presentation_error}
                            onChange={() => checkBox3()}
                          />
                          <span className="custom-control-label">
                            Erro de configuração
                          </span>
                        </label>
                      </Col>
                      <Col xs={12} md={6}>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name={props.wrong_answer}
                            onChange={() => checkBox4()}
                          />
                          <span className="custom-control-label">
                            Resposta Errada
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name={props.invalid_algorithm}
                            onChange={() => checkBox5()}
                          />
                          <span className="custom-control-label">
                            Algoritimo inválido
                          </span>
                        </label>
                      </Col>
                    </Row>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
