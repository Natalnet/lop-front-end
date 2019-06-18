import React, { Component } from "react";
import List from "../List";
import Swal from "sweetalert2";
import api from "../../../services/jsonApi";

export default class pagInstituição extends Component {
  state = {
    nome: "",
    logradouro: "",
    cep: "",
    numero: "",
    complemento: "",
    uf: "",
    localidade: "",
    bairro: "",
    msg: "",
    items: [],
    filtro: [],
    editItem: false,
    id: null
  };
  handleSubmit = async e => {
    e.preventDefault();
  };
  componentDidMount() {
    this.getInstituicoes();
  }
  getInstituicoes = async () => {
    const { data } = await api.get("/instituicoes");

    data.map(inst => {
      return this.setState({
        items: [
          ...this.state.items,
          inst.nome + ", " + inst.localidade + ", " + inst.uf
        ],
        filtro: [
          ...this.state.items,
          inst.nome + ", " + inst.localidade + ", " + inst.uf
        ]
      });
    });
  };
  onSubmit = event => {
    event.preventDefault();

    if (this.state.editItem) {
      if (this.state.nome.length > 0) {
        const requestInfo = {
          nome: this.state.nome,
          logradouro: this.state.logradouro,
          cep: this.state.cep,
          numero: this.state.numero,
          complemento: this.state.complemento,
          uf: this.state.uf,
          localidade: this.state.localidade,
          bairro: this.state.bairro
        };
        const { id } = this.state;
        api
          .put(`/instituicoes/${id}`, requestInfo)
          .then(response => {
            if (response) {
              Swal.fire({
                type: "success",
                title: `Instituição editada com sucesso`,
                confirmButtonText: "Voltar para o sistema"
              });
              this.setState({
                nome: "",
                logradouro: "",
                cep: "",
                numero: "",
                complemento: "",
                uf: "",
                localidade: "",
                bairro: "",
                msg: "",
                items: [],
                editItem: false,
                id: null,
                filtro: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.localidade +
                    ", " +
                    this.state.uf
                ]
              });
              this.getInstituicoes();
            }
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: `Error ao editar instituição`,
              text: `error: ${err}`,
              confirmButtonText: "Voltar para o sistema"
            });
          });
      } else {
        Swal.fire({
          type: "error",
          title: `Campo instituição vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      }
    } else {
      if (this.state.nome.length > 0) {
        const requestInfo = {
          nome: this.state.nome,
          logradouro: this.state.logradouro,
          cep: this.state.cep,
          numero: this.state.numero,
          complemento: this.state.complemento,
          uf: this.state.uf,
          localidade: this.state.localidade,
          bairro: this.state.bairro
        };
        api
          .post("/instituicoes", requestInfo)
          .then(response => {
            if (response) {
              Swal.fire({
                type: "success",
                title: `Instituição cadastrada`,
                confirmButtonText: "Voltar para o sistema"
              });
              this.setState({
                nome: "",
                logradouro: "",
                cep: "",
                numero: "",
                complemento: "",
                uf: "",
                localidade: "",
                bairro: "",
                msg: "",
                editItem: false,
                id: null,
                items: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.localidade +
                    ", " +
                    this.state.uf
                ],
                filtro: [
                  ...this.state.items,
                  this.state.nome +
                    ", " +
                    this.state.localidade +
                    ", " +
                    this.state.uf
                ]
              });
            }
          })
          .catch(err => {
            Swal.fire({
              type: "error",
              title: `Error ao cadastrar instituição`,
              text: `error: ${err}`,
              confirmButtonText: "Voltar para o sistema"
            });
          });
      } else {
        Swal.fire({
          type: "error",
          title: `Campo instituição vazio`,
          confirmButtonText: "Voltar para o sistema"
        });
      }
    }
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  filtrar = e => {
    let ListaOriginal = [];
    let ListaNova = [];
    if (e.target.value !== "") {
      ListaOriginal = this.state.items;
      ListaNova = ListaOriginal.filter(item => {
        const lc = item.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      ListaNova = this.state.items;
    }
    this.setState({
      filtro: ListaNova
    });
  };
  editInst = async id => {
    const { data } = await api.get(`/instituicoes`);

    const inst = data.filter(item => item.id === id);

    this.setState({
      nome: inst[0].nome,
      logradouro: inst[0].logradouro,
      cep: inst[0].cep,
      numero: inst[0].numero,
      complemento: inst[0].complemento,
      uf: inst[0].uf,
      localidade: inst[0].localidade,
      bairro: inst[0].bairro,
      id: id,
      editItem: true
    });
  };
  searchWithCep = async () => {
    if (this.state.cep.replace("-", "").length !== 8) {
      Swal.fire({
        type: "error",
        title: `Error no cep: ${this.state.cep}`,
        text: "CEP tem quer ter 8 digitos EX:12345-678",
        confirmButtonText: "Voltar para o sistema"
      });
      return;
    }
    const { data } = await api.get(
      `https://viacep.com.br/ws/${this.state.cep}/json`
    );
    if (data.erro === true) {
      Swal.fire({
        type: "error",
        title: `Error no cep: ${this.state.cep}`,
        text: "CEP não encontrado",
        confirmButtonText: "Voltar para o sistema"
      });
      return;
    }
    this.setState({
      logradouro: data.logradouro,
      numero: data.complemento,
      bairro: data.bairro,
      uf: data.uf,
      localidade: data.localidade
    });
  };
  render() {
    return (
      <div className="container form-control">
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="form-group col-sm-5">
              <label htmlFor="inputNome">Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                placeholder="Nome da Instituição Ex: UFRN "
                onChange={this.handleChange}
                value={this.state.nome}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-5">
              <label htmlFor="inputEndereco">CEP</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: 59078-970"
                  name="cep"
                  value={this.state.cep}
                  onChange={this.handleChange}
                />
                <span className="input-group-append">
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={this.searchWithCep}
                  >
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-5">
              <label htmlFor="inputEndereco">Logradouro</label>
              <input
                type="text"
                className="form-control"
                name="logradouro"
                placeholder="Ex: Av Senador Salgado Filho"
                value={this.state.logradouro}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-sm-2">
              <label htmlFor="inputEndereco">Numero</label>
              <input
                type="text"
                className="form-control"
                name="numero"
                placeholder="Ex: 3000 ou s/n"
                value={this.state.numero}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-sm-5">
              <label htmlFor="inputEndereco">Complemento</label>
              <input
                type="text"
                className="form-control"
                name="complemento"
                placeholder=""
                value={this.state.complemento}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-5">
              <label htmlFor="inputEndereco">Bairro</label>
              <input
                type="text"
                className="form-control"
                name="bairro"
                placeholder="Ex: Lagoa Nova"
                value={this.state.bairro}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-5">
              <label htmlFor="inputEndereco">Cidade</label>
              <input
                type="text"
                className="form-control"
                name="localidade"
                placeholder="Ex: Natal"
                value={this.state.localidade}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-sm-2">
              <label htmlFor="inputEndereco">Estado</label>
              <input
                type="text"
                className="form-control"
                name="uf"
                placeholder="Ex: RN"
                value={this.state.uf}
                onChange={this.handleChange}
              />
            </div>
          </div>
          {this.state.editItem ? (
            <button type="submit" className="btn btn-primary mb-3 btn-sm">
              Alterar
            </button>
          ) : (
            <button type="submit" className="btn btn-primary mb-3 btn-sm">
              Salvar
            </button>
          )}
          <hr />
          <List
            items={this.state.filtro}
            edit={this.editInst}
            change={this.filtrar}
          />
        </form>
      </div>
    );
  }
}
