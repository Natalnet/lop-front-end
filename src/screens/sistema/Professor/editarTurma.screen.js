import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import TemplateSistema from "components/templates/sistema.template";

const botao = {
  marginTop: "10px",
  float: "right"
};

export default class NovasTurmasScreen extends Component {
  state = {
    redirect: false,
    name: "",
    year: new Date().getFullYear().toString(),
    semester: new Date().getMonth() < 6 ? "1" : "2",
    description: "",
    state: "ATIVA",
    professoresSelecionados: [],
    todosProfessores: [],
    loadingInfoTurma: true,
    linguagensSelecionadas: [],
    linguagens: [
      {
        value: "javascript",
        label: "JavaScript"
      },
      {
        value: "cpp",
        label: "C++"
      }
    ]
  };
  async componentDidMount() {
    document.title = "Editar Turma - professor";
    await this.getProfessores();
    this.getInfoTurma();
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    try {
      const response = await api.get(`/class/${id}`);
      console.log("class:");
      console.log(response.data);
      await this.setState({
        name: response.data.name,
        year: response.data.year,
        semester: response.data.semester,
        description: response.data.description,
        state: response.data.description.state,
        professoresSelecionados: response.data.users
          .filter(p => p.profile === "PROFESSOR")
          .map(p => {
            return {
              id: p.id,
              value: p.id,
              label: p.email
            };
          }),
        linguagensSelecionadas: response.data.languages.map(language => {
          return {
            value: language,
            label:
              language === "javascript"
                ? "JavaScript"
                : language === "cpp"
                ? "C++"
                : ""
          };
        })
      });
      console.log(this.state.linguagensSelecionadas);
      this.setState({ loadingInfoTurma: false });
    } catch (err) {
      this.setState({ loadingInfoTurma: false });
      console.log(err);
    }
  }
  async atualizarTurma(event) {
    event.preventDefault();
    console.log(
      " nome: " +
        this.state.name +
        "\n ano: " +
        this.state.year +
        "\n semestre: " +
        this.state.semester +
        "\n descriçao: " +
        this.state.description +
        "\n Status: " +
        this.state.state +
        "\n professores: " +
        this.state.professoresSelecionados
    );
    if (this.state.name === "") {
      this.setState({ msg: "Informe o nome da turma" });
    } else if (
      this.state.year === "" ||
      this.state.year > 2020 ||
      this.state.year < 2010
    ) {
      this.setState({ msg: "Informe o ano" });
    } else if (this.state.professoresSelecionados.length === 0) {
      this.setState({ msg: "Selecione os professores" });
    } else {
      const requestInfo = {
        name: this.state.name,
        year: this.state.year,
        semester: this.state.semester,
        description: this.state.description,
        state: this.state.state,
        professores: this.state.professoresSelecionados.map(p => p.id),
        languages: this.state.linguagensSelecionadas.map(l => l.value)
      };
      Swal.fire({
        title: "Atualizando turma",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
      Swal.showLoading();
      try {
        const idClass = this.props.match.params.id;
        await api.put(`/class/${idClass}/update`, requestInfo);
        Swal.hideLoading();
        Swal.fire({
          type: "success",
          title: "Turma atualizada com sucesso!"
        });
        this.setState({ redirect: true });
      } catch (err) {
        Swal.hideLoading();
        Swal.fire({
          type: "error",
          title: "Erro: Não foi possivel cadastrar a Turma"
        });
        this.setState({ msg: "Erro: Não foi possivel cadastrar a Turma" });
      }
    }
  }
  async getProfessores() {
    let query = `?fields=id email&profile=PROFESSOR`;
    try {
      const response = await api.get(`/user${query}`);
      this.setState({
        todosProfessores: response.data.map(p => {
          return {
            value: p.id,
            id: p.id,
            label: p.email
          };
        })
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleNameChange = e => {
    this.setState({ name: e.target.value });
  };
  handleYearChange = e => {
    this.setState({ year: e.target.value });
  };
  handleSemesterChange = e => {
    this.setState({ semester: e.target.value });
  };

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };
  handleStateChange = e => {
    this.setState({ state: e.target.value });
  };
  handleProfessorsChange = professores => {
    const { professoresSelecionados } = this.state;
    this.setState({
      professoresSelecionados: professores || []
    });
  };
  handleLanguageChange = linguagens => {
    this.setState({
      linguagensSelecionadas: linguagens || []
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/professor" />;
    }
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
              <form onSubmit={e => this.atualizarTurma(e)}>
                <div className="form-row">
                  <div className="form-group col-12">
                    <span className="alert-danger">{this.state.msg}</span>
                    <label htmlFor="name">Nome: </label>
                    <input
                      id="name"
                      type="text"
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
                        new Date().getFullYear() + 1
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
                    <label htmlFor="exampleFormControlSelect1">Status</label>
                    <select
                      className="form-control"
                      id="exampleFormControlSelect1"
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
                      rows="5"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                    ></textarea>
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
                      onChange={this.handleLanguageChange.bind(this)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label>Professores: </label>
                    <Select
                      style={{ boxShadow: "white" }}
                      defaultValue={this.state.professoresSelecionados}
                      options={this.state.todosProfessores}
                      isMulti
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
