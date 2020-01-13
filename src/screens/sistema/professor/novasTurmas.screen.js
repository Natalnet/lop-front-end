import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
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
    name:"",
    year: new Date().getFullYear().toString(),
    semester: new Date().getMonth() < 6 ? "1" : "2",
    description: "",
    state: "ATIVA",
    prof: "",
    todosProfessores: [],
    professoresSelecionados: [],
    loadingProfessores: true,
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
  componentDidMount() {
    this.getProfessores();
    document.title = "Cadastro de turmas - Plataforma LOP";
  }
  async cadastro(event) {
    event.preventDefault();
    let {name,year,semester,description,state,linguagensSelecionadas,professoresSelecionados}=this.state
    let msg=""
    msg += !name?"Informe o nome da turma<br/>":"" ;
    msg += !description?"Informe a descrição da turma<br/>":"" ;
    msg += professoresSelecionados.length === 0? "Escolha pelo menos um professor<br/>":"";
    msg += linguagensSelecionadas.length === 0? "Escolha pelo menos uma linguagen<br/>":"";
    
    if(msg){
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel cadastrar a Turma",
        html:  msg
      });
      return null
    }
    const requestInfo = {
      name,
      year,
      semester,
      description,
      state,
      professores:professoresSelecionados.map(p => p.value),
      languages: linguagensSelecionadas.map(l => l.value)
    };
    Swal.fire({
      title: "Criando turma",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });
    Swal.showLoading();
    try {
      await api.post("/class/store", requestInfo);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Turma criada com sucesso!"
      });
      this.props.history.push("/professor")
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel cadastrar a Turma"
      });
    }
    
  }

  async getProfessores() {
    let query = `?fields=id email&profile=PROFESSOR`;
    try {
      const response = await api.get(`/user${query}`);
      console.log("professores:");
      console.log(response.data);
      await this.setState({
        professoresSelecionados: [
          {
            value: sessionStorage.getItem("user.email"),
            label: sessionStorage.getItem("user.email")
          }
        ],
        todosProfessores: response.data.map(p => {
          return {
            value: p.email,
            label: p.email
          };
        })
      });
      this.setState({ loadingProfessores: false });
      console.log("todos professores");
      console.log(this.state.todosProfessores);
      console.log("professores selecionados");
      console.log(this.state.professoresSelecionados);
    } catch (err) {
      console.log(err);
    }
  }

  handleNameChange(e){
    this.setState({ name: e.target.value });
  };
  handleYearChange(e){
    this.setState({ year: e.target.value });
  };
  handleSemesterChange(e){
    this.setState({ semester: e.target.value });
  };

  handleDescriptionChange(e){
    this.setState({ description: e.target.value });
  };
  handleStateChange = e => {
    this.setState({ state: e.target.value });
  };
  handleProfessorsChange = (professores, { action, removedValue  }) => {
    console.log("professores:",professores)
    console.log("action:",action)
    console.log("removedProfessor:",removedValue )
    const myEmail = sessionStorage.getItem("user.email")
    if(removedValue && removedValue.value===myEmail) return null
    
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
    const {name} = this.state
    return (
      <TemplateSistema active="home">
        <Card>
          <CardHead>
            <CardTitle>Cadastro de Turmas</CardTitle>
          </CardHead>
          <CardBody>
            <form onSubmit={e => this.cadastro(e)}>
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
                    value={name}
                    onChange={(e)=>this.handleNameChange(e)}
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
                    onChange={(e)=>this.handleYearChange(e)}
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
                  <label htmlFor="exampleFormControlSelect1">semestre: </label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    defaultValue={this.state.semester}
                    onChange={(e)=>this.handleSemesterChange(e)}
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
                    rows="5"
                    required
                    value={this.state.description}
                    onChange={(e)=>this.handleDescriptionChange(e)}
                  ></textarea>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-12">
                  <label>Linguagems: </label>
                  <Select
                    style={{ boxShadow: "white" }}
                    placeholder={"Selecione as linguagens"}
                    isMulti
                    options={this.state.linguagens}
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
                    isMulti
                    isLoading={this.state.loadingProfessores}
                    defaultValue={[
                      {
                        value: sessionStorage.getItem("user.email"),
                        id: sessionStorage.getItem("user.email"),
                        label: sessionStorage.getItem("user.email")
                      }
                    ]}
                    value={this.state.professoresSelecionados}
                    options={this.state.todosProfessores}
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
                    Cadastrar
                  </button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </TemplateSistema>
    );
  }
}
