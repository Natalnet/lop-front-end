import React, { Component} from "react";
//import PropTypes from "prop-types";
import {findLocalIp} from "../../../util/auxiliaryFunctions.util";
import api from "../../../services/api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import apiCompiler from "../../../services/apiCompiler";
import TemplateSistema from "../../../components/templates/sistema.template";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import ExercicioScreen from "components/screens/exercicio.componete.escreen";

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: "",
      editorRes: "",
      descriptionErro: "",
      language: "javascript",
      theme: "monokai",
      response: [],
      katexDescription: "",
      status: "PÚBLICA",
      difficulty: null,
      solution: "",
      results: [],
      tempo_inicial: null,
      loadingReponse: false,
      loadingEditor: false,
      title: "",
      description: "",
      inputs: "",
      outputs: "",
      percentualAcerto: "",
      loadingExercicio: true,
      userDifficulty: "",
      loadDifficulty: false,
      salvandoRascunho: false,
      char_change_number:0,
    };
    
  }

  async componentDidMount() {
    this.setState({ tempo_inicial: new Date() });
    await this.getExercicio();
    this.salvaAcesso()
    
    document.title = `${this.state.title}`;
    //salva rascunho a cada 1 minuto
    this.time = setInterval(function() {
        this.salvaRascunho(false);
    }.bind(this),60000);
  }
  componentWillUnmount(){
    clearInterval(this.time)
  }

  
  async salvaAcesso(){
    const ip = await findLocalIp(false);
    const idQuestion = this.props.match.params.id;
    const request = {
      ip : ip[0],
      environment:'desktop',
      idQuestion,
    }
    try{
      await api.post(`/access/store`,request)
    }
    catch(err){
      console.log(err);
    }
  }
  async getExercicio() {
    const idQuestion = this.props.match.params.id;
    let query = `?exclude=id code status createdAt updatedAt author_id solution`;
    query += `&draft=yes`
    query += `&difficulty=yes`
    try {
      const response = await api.get(`/question/${idQuestion}${query}`);
      console.log("questão");
      console.log(response.data);
      this.setState({
        results: [...response.data.results],
        title: response.data.title,
        description: response.data.description,
        katexDescription: response.data.katexDescription || "",
        difficulty: response.data.difficulty,
        userDifficulty: response.data.userDifficulty || "",
        solution: response.data.questionDraft?response.data.questionDraft.answer:'',
        char_change_number:response.data.questionDraft?response.data.questionDraft.char_change_number:0,
        loadingExercicio: false, 
      });
    } catch (err) {
      console.log(err);
      //this.setState({ loadingExercicio: false });
    }
  }
  
  async salvaRascunho(showMsg = true) {
    const idQuestion = this.props.match.params.id;
    const {solution,char_change_number} = this.state
    const request = {
      answer: solution,
      char_change_number,
      idQuestion,
    };
    try {
      this.setState({ salvandoRascunho: true });

      await api.post(`/draft/store`, request);
      this.setState({ salvandoRascunho: false });
      if (showMsg) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: "success",
          title: "Rascunho salvo com sucesso!"
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ salvandoRascunho: false });
    }
  }
  
  async submeter(e) {
    e.preventDefault();
    const timeConsuming = new Date() - this.state.tempo_inicial;
    const { solution, language, results,char_change_number } = this.state;
    const request = {
      codigo: solution,
      linguagem: language,
      results: results,
    };
    this.setState({ loadingReponse: true });
    try {
      this.salvaRascunho();
      const response = await apiCompiler.post("/apiCompiler", request);
      await this.saveSubmission(
        request,
        response.data.percentualAcerto,
        timeConsuming,
        char_change_number
      );
      console.log("sumbissão: ");
      console.log(response.data);
      this.setState({
        loadingReponse: false,
        response: response.data.results,
        percentualAcerto: response.data.percentualAcerto,
        descriptionErro: response.data.descriptionErro
      });
    } catch (err) {
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({ loadingReponse: false });
      Swal.fire({
        type: 'error',
        title: 'ops... Algum erro aconteceu na operação :(',
      })
      console.log(err);    
    }
  }
  
  async saveSubmission({ codigo, linguagem }, hitPercentage, timeConsuming,char_change_number) {
    const idQuestion = this.props.match.params.id;
    try {
      const ip = await findLocalIp(false);
      console.log("local ips:");
      console.log(ip);
      const request = {
        answer: codigo,
        language: linguagem,
        hitPercentage: hitPercentage,
        timeConsuming: timeConsuming,
        ip: ip[0],
        environment: "desktop",
        char_change_number,
        idQuestion,
      };
      await api.post(`/submission/store`,request); 
      this.setState({ tempo_inicial: new Date() });
    } catch (err) {
      this.setState({ tempo_inicial: new Date() });
      console.log(err);
      throw err;
    }
  }

  async changeLanguage(e) {
    await this.setState({ language: e.target.value });
  }
  async changeTheme(e) {
    await this.setState({ theme: e.target.value });
  }
  handleSolution(newValue) {
    this.setState({ 
      solution: newValue,
      char_change_number:this.state.char_change_number+1,
    });
  }
  
  async handleDifficulty(e) {
    const userDifficulty = e.target ? e.target.value : "";
    const idQuestion = this.props.match.params.id;
    const request = {
      userDifficulty: userDifficulty,
      idQuestion
    };
    try {
      this.setState({ loadDifficulty: true });
      await api.post(`/difficulty/store`, request);
      this.setState({
        userDifficulty: userDifficulty,
        loadDifficulty: false
      });
    } catch (err) {
      this.setState({ loadDifficulty: false });
      console.log(err);
    }
  }

  render() {
    const {title,loadingExercicio} = this.state;
    return (
      <TemplateSistema active="exercicios">
        <Row mb={15}>
          <Col xs={12}>
            <h5 style={{margin:'0px'}}>
              <Link to="/aluno/exercicios">
                Exercícios
              </Link>
              <i className="fa fa-angle-left ml-2 mr-2"/> 
              {title || <div style={{width:'140px',backgroundColor:'#e5e5e5',height:'12px',display: "inline-block"}}/>}
            </h5>
          </Col>
        </Row>
        {loadingExercicio ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <ExercicioScreen
            {...this.state}
            {...this.props}
            showAllTestCases={true}
            cardExemplos={this.cardEnunciadoRef}
            changeLanguage ={this.changeLanguage.bind(this)}
            changeTheme ={this.changeTheme.bind(this)}
            handleSolution ={this.handleSolution.bind(this)}
            handleDifficulty ={this.handleDifficulty.bind(this)}
            submeter ={this.submeter.bind(this)}
            salvaRascunho={this.salvaRascunho.bind(this)}
          />
        )}
      </TemplateSistema>
    );
  }
}
