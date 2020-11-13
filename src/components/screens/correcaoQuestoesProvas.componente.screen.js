import React from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { BlockMath } from "react-katex";

import HTMLFormat from "../ui/htmlFormat";
import Card from "../ui/card/card.component";
import CardHead from "../ui/card/cardHead.component";
import CardTitle from "../ui/card/cardTitle.component";
import CardBody from "../ui/card/cardBody.component";
import CardOptions from "../ui/card/cardOptions.component";
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";

import SupportedLanguages from "../../config/SupportedLanguages";
import AceEditorWrapper from "../templates/aceEditorWrapper.template"


export default (props) => {
  const {
    title,
    description,
    results,
    katexDescription,
    solution,
    answer,
    corrected,
  } = props;
  const { loadingReponse } = props;
  const { language, theme, descriptionErro } = props;
  const { changeLanguage, changeTheme, submeter, SaveData } = props;
  const {
    checkBox1,
    checkBox2,
    checkBox3,
    checkBox4,
    checkBox5,
    commentQuestion,
    funcTeacherNote,
    alteredCode,
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
  const languages = props.turma.languages || SupportedLanguages.list;


  return (
    <>
      <Row mb={10}>
        <Col xs={12}>
          <Card className="card-status-primary">
            <CardHead>
              <CardTitle>
                <b>
                  <i className="fa fa-code mr-2" /> {title}
                </b>
              </CardTitle>
            </CardHead>
            <CardBody className="overflow-auto">
              <Row>
                {props.loadingQuestoes || !description ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <Col xs={12} md={7}>
                    {/* <HTMLFormat>{description}</HTMLFormat> */}
                    <SunEditor 
                        lang="pt_br"
                        height="auto"
                        disable={true}
                        showToolbar={false}
                        // onChange={this.handleDescriptionChange.bind(this)}
                        setContents={description || ""}
                        setDefaultStyle="font-size: 15px; text-align: justify"
                        setOptions={{
                            toolbarContainer : '#toolbar_container',
                            resizingBar : false,
                            katex: katex,
                        }}
                    />

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
                    <table 
                      className="table table-exemplo"
                      style={{
                        border: "1px solid rgba(0, 40, 100, 0.12)"
                      }}
                    >
                      <tbody>
                        <tr>
                          <td className="pt-0">
                            <b>Exemplo de entrada</b>
                          </td>
                          <td className="pt-0">
                            <b>Exemplo de saída</b>
                          </td>
                        </tr>
                        {results && results
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
          <select className="form-control" onChange={(e) => this.changeLanguage(e)}>
            {languages.map((lang) => {
              const languageIdx = SupportedLanguages.list.indexOf(lang);
              return (
                <option key={lang} value={lang}>
                  {SupportedLanguages.niceNames[languageIdx]}
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
            {props.loadingQuestoes? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <AceEditorWrapper
                mode={language}
                theme={theme}
                focus={false}
                onChange={(e) => alteredCode(e)}
                value={answer || ""}
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
              <AceEditorWrapper
                mode={language}
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
              {props.loadingQuestoes ? (
                <div className="loader" style={{ margin: "0px auto" }}></div>
              ) : (
                <CardTitle>Resultados</CardTitle>
              )}
            </CardHead>
            {loadingReponse ? (
              <div className="loader" style={{ margin: "100px auto" }}></div>
            ) : descriptionErro ? (
              <Card>
                {props.loadingQuestoes ? (
                  <div className="loader" style={{ margin: "0px auto" }}></div>
                ) : (
                  <CardBody className=" p-0 ">
                    <div className="alert alert-icon alert-danger" role="alert">
                      <HTMLFormat>{descriptionErro}</HTMLFormat>
                    </div>
                  </CardBody>
                )}
              </Card>
            ) : (
              <>
                {results && results.map((teste, i) => (
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
                          <table 
                            className="table" 
                            wrap="off"

                          >
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
              {props.loadingQuestoes ? (
                <div className="loader" style={{ margin: "0px auto" }}></div>
              ) : (
                <CardTitle>
                  Feed Back
                  {corrected ? (
                    <>
                      <label
                        style={{
                          color: "green",
                          fontSize: "16px",
                          marginLeft: "15px",
                        }}
                        htmlFor="selectDifficulty"
                      >
                        (Nota editada)
                      </label>
                    </>
                  ) : (
                    <>
                      <label
                        style={{
                          color: "#c88d04",
                          fontSize: "16px",
                          marginLeft: "15px",
                        }}
                        htmlFor="selectDifficulty"
                      >
                        (Nota não editada)
                      </label>

                    </>
                  )}
                </CardTitle>
              )}
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
                      <label htmlFor="selectDifficulty">Nota do Sistema:</label>
                      <input
                        readOnly
                        style={{ textAlign: "center" }}
                        className={"form-control"}
                        type={"text"}
                        maxLength={"5"}
                        value={parseFloat(props.hitPercentage).toFixed(2)}
                      ></input>
                    </Col>

                    <Col xs={10} md={4}>
                      <label htmlFor="selectDifficulty">
                        Nota do professor:
                      </label>
                      <input
                        style={{ textAlign: "center" }}
                        className={`form-control ${
                          parseFloat(props.teacherNote) > 10 ||
                          parseFloat(props.teacherNote) < 0 ||
                          isNaN(parseFloat(props.teacherNote))
                            ? "is-invalid"
                            : "is-valid"
                        }`}
                        onChange={(e) => funcTeacherNote(e)}
                        type={"text"}
                        maxLength={"5"}
                        value={props.teacherNote || ""}
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

                  <Row style={{ marginTop: "10px" }}>
                    <Col xs={10} md={6}>
                      <label htmlFor="selectDifficulty">
                        Tempo gasto na questão:
                      </label>
                      <input
                        readOnly
                        style={{ paddingRight: "14px" }}
                        className={"form-control"}
                        type={"text"}
                        maxLength={"5"}
                        value={`
                          ${parseInt(
                            props.timeConsuming / 1000 / 60
                          )} min ${parseInt(
                          (props.timeConsuming / 1000) % 60
                        )} seg`}
                      ></input>
                    </Col>

                    {props.char_change_number && <Col xs={10} md={6}>
                      <label htmlFor="selectDifficulty">
                        Nº de variação de caracteres:
                      </label>
                      <input
                        readOnly
                        style={{ textAlign: "center" }}
                        className={"form-control"}
                        type={"text"}
                        maxLength={"5"}
                        value={parseFloat(props.char_change_number)}
                      ></input>
                    </Col>}
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
                            checked={props.compilation_error}
                            onChange={() => checkBox1()}
                          />
                          <span className="custom-control-label">
                            Erro em tempo de compilação
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="runtime_error"
                            checked={props.runtime_error}
                            onChange={() => checkBox2()}
                          />
                          <span className="custom-control-label">
                            Erro em tempo de execução
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="presentation_error"
                            checked={props.presentation_error}
                            onChange={() => checkBox3()}
                          />
                          <span className="custom-control-label">
                            Erro de apresentação
                          </span>
                        </label>
                      </Col>
                      <Col xs={12} md={6}>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="wrong_answer"
                            checked={props.wrong_answer}
                            onChange={() => checkBox4()}
                          />
                          <span className="custom-control-label">
                            Resposta errada
                          </span>
                        </label>
                        <label className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="invalid_algorithm"
                            checked={props.invalid_algorithm}
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
