import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import Select from "react-select";
import Card from "../../../components/ui/card/card.component";
import CardHead from "../../../components/ui/card/cardHead.component";
import CardTitle from "../../../components/ui/card/cardTitle.component";
import CardBody from "../../../components/ui/card/cardBody.component";
import TemplateSistema from "../../../components/templates/sistema.template";

import SupportedLanguages from "../../../config/SupportedLanguages";

const botao = {
  marginTop: "10px",
  float: "right",
};

export default class NovasTurmasScreen extends Component {
  state = {
    name: "",
    year: new Date().getFullYear().toString(),
    semester: new Date().getMonth() < 6 ? "1" : "2",
    description: "",
    state: "ATIVA",
    professoresSelecionados: [],
    todosProfessores: [],
    loadingInfoTurma: true,
    linguagensSelecionadas: [],
    linguagens: []
  };

  constructor(){
    super();
    /*populate linguagens vector using the supported languages structure*/
    for(var i=0; i<SupportedLanguages.list.length; i++)
      this.state.linguagens.push({value: SupportedLanguages.list[i], label: SupportedLanguages.niceNames[i]})
  }
  async componentDidMount() {
    document.title = "Editar Turma - professor";
    await this.getProfessores();
    this.getInfoTurma();
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    let query = `?user=YES`;
    query += `&profile=PROFESSOR`;
    try {
      const response = await api.get(`/class/${id}${query}`);
      await this.setState({
        name: response.data.name,
        year: response.data.year,
        semester: response.data.semester,
        description: response.data.description,
        state: response.data.description.state,
        professoresSelecionados: response.data.users
          .filter((p) => p.profile === "PROFESSOR")
          .map((p) => {
            return {
              value: p.email,
              label: p.email,
            };
          }),
        linguagensSelecionadas: response.data.languages.map( (language) => {
          if (SupportedLanguages.list.indexOf(language) !== -1){
            return {
              value: language,
              label: SupportedLanguages[language].niceName,
            };
          }
          else /*fail safe to avoid old backend information to crash the frontend*/
            return {value:language, label:language+"-deprecated"}
        }),
        loadingInfoTurma: false,
      });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }
  async atualizarTurma(event) {
    event.preventDefault();
    let {
      name,
      year,
      semester,
      description,
      state,
      linguagensSelecionadas,
      professoresSelecionados,
    } = this.state;
    let msg = "";
    msg += !name ? "Informe o nome da turma<br/>" : "";
    msg += !description ? "Informe a descrição da turma<br/>" : "";
    msg +=
      professoresSelecionados.length === 0
        ? "Escolha pelo menos um professor<br/>"
        : "";
    msg +=
      linguagensSelecionadas.length === 0
        ? "Escolha pelo menos uma linguagen<br/>"
        : "";

    if (msg) {
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel cadastrar a Turma",
        html: msg,
      });
      return null;
    }
    const requestInfo = {
      updatedClass: {
        name,
        year,
        semester,
        description,
        state,
        languages: linguagensSelecionadas.map((l) => l.value),
      },
      professores: professoresSelecionados.map((p) => p.value),
    };
    Swal.fire({
      title: "Atualizando turma",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });
    Swal.showLoading();
    try {
      const idClass = this.props.match.params.id;
      await api.put(`/class/${idClass}/update`, requestInfo);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Turma atualizada com sucesso!",
      });
      this.props.history.push("/professor");
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel cadastrar a Turma",
      });
      this.setState({ msg: "Erro: Não foi possivel cadastrar a Turma" });
    }
  }

  async getProfessores() {
    let query = `?fields=id email`;
    query += `&profile=PROFESSOR`;
    try {
      const response = await api.get(`/user${query}`);
      this.setState({
        todosProfessores: response.data.map((p) => {
          return {
            value: p.email,
            label: p.email,
          };
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };
  handleYearChange = (e) => {
    this.setState({ year: e.target.value });
  };
  handleSemesterChange = (e) => {
    this.setState({ semester: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };
  handleStateChange = (e) => {
    this.setState({ state: e.target.value });
  };
  handleProfessorsChange = (professores, { action, removedValue }) => {
    const myEmail = sessionStorage.getItem("user.email");
    if (removedValue && removedValue.value === myEmail) return null;

    this.setState({
      professoresSelecionados: professores || [],
    });
  };
  handleLanguageChange = (linguagens) => {
    this.setState({
      linguagensSelecionadas: linguagens || [],
    });
  };

  render() {
    const { loadingInfoTurma } = this.state;
    return (
      <TemplateSistema active="home">
        {loadingInfoTurma ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Card>
            <CardHead>
              <CardTitle>Cadastro de Turmas</CardTitle>
            </CardHead>
            <CardBody>
              <form onSubmit={(e) => this.atualizarTurma(e)} onKeyDown={e => {if (e.key === 'Enter') e.preventDefault();}}>
                <div className="form-row">
                  <div className="form-group col-12">
                    <span className="alert-danger">{this.state.msg}</span>
                    <label htmlFor="name">Nome: </label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="form-control"
                      placeholder="Nome de turma"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-4">
                    <label htmlFor="exampleFormControlSelect0">Ano: </label>
                    <select
                      className="form-control"
                      id="exampleFormControlSelect0"
                      defaultValue={this.state.year}
                      onChange={this.handleYearChange}
                    >
                      {[
                        new Date().getFullYear() - 1,
                        new Date().getFullYear(),
                        new Date().getFullYear() + 1,
                      ].map((ano, index) => (
                        <option key={ano} value={ano}>
                          {ano}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col-4">
                    <label htmlFor="exampleFormControlSelect1">
                      semestre:{" "}
                    </label>
                    <select
                      className="form-control"
                      id="exampleFormControlSelect1"
                      defaultValue={this.state.semester}
                      onChange={this.handleSemesterChange}
                    >
                      <option value="1">1ºSemestre</option>
                      <option value="2">2ºSemestre</option>
                    </select>
                  </div>

                  <div className="form-group col-4">
                    <label htmlFor="exampleFormControlSelect2">Status</label>
                    <select
                      className="form-control"
                      id="exampleFormControlSelect2"
                      defaultValue={this.state.state}
                      onChange={this.handleStateChange}
                    >
                      <option value={"ATIVA"}>ATIVA</option>
                      <option value={"INATIVA"}>INATIVA</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-12">
                    <label htmlFor="Descricao">Descrição</label>
                    <textarea
                      className="form-control"
                      id="Descricao"
                      required
                      rows="5"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-12">
                    <label htmlFor="Descricao">Linguagens:</label>
                    <Select
                      style={{ boxShadow: "white" }}
                      defaultValue={this.state.linguagensSelecionadas}
                      isMulti
                      options={this.state.linguagens}
                      closeMenuOnSelect={false}
                      isClearable={false}
                      onChange={this.handleLanguageChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label>Professores: </label>
                    <Select
                      style={{ boxShadow: "white" }}
                      value={this.state.professoresSelecionados}
                      options={this.state.todosProfessores}
                      isMulti
                      isClearable={false}
                      onChange={this.handleProfessorsChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
                    <button
                      style={botao}
                      type="submit"
                      className="btn btn-primary"
                    >
                      Atualizar turma
                    </button>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </TemplateSistema>
    );
  }
}
