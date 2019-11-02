import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from '../../../services/api'
import HTMLFormat from '../../../components/ui/htmlFormat'

import apiCompiler from '../../../services/apiCompiler'
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/c_cpp';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/theme/github';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/theme/textmate';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/terminal';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import TableResults from '../../../components/ui/tables/tableResults.component'
import TableResults2 from '../../../components/ui/tables/tableResults2.component'
import { InlineMath, BlockMath } from 'react-katex';
import FormExercicio from '../../../components/ui/forms/formExercicio.component'
import FormSelect from '../../../components/ui/forms/formSelect.component'
import TemplateSistema from '../../../components/templates/sistema.template'
import CardEnunciado from '../../../components/ui/card/cardEnunciadoExercicio.component'
import imgLoading from '../../../assets/loading.gif'
import imgLoading1 from '../../../assets/loading1.gif'
import imgLoading2 from '../../../assets/loading2.gif'


export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      editorRes:'',
      contentRes:"",
      language:'javascript',
      theme:'monokai',
      response:[],
      katexDescription:'',
      status:'PÚBLICA',
      difficulty:'Médio',
      solution:'',
      results:[],
      tempo_inicial:null,
      loadingReponse:false,
      loadingEditor:false,
      title:'',
      someErro:false,
      description:'',
      inputs:'',
      outputs:'',
      percentualAcerto:'',
      redirect:'',
      turma:'',
      loadingInfoTurma:true,
      loadingExercicio:true
    }
  }

  async componentDidMount() {
    this.setState({tempo_inicial:new Date()})
    
    await this.getInfoTurma()
    await this.getExercicio()
    document.title = `${this.state.title}`
    this.appStyles()
  }
  appStyles(){
    const cardEnunciado = document.getElementById('cardEnunciado')
    const cardExemplos = document.getElementById('cardExemplos')
    const heightCardEnunciado = cardEnunciado && cardEnunciado.offsetHeight 
    const heightCardExemplos = cardExemplos && cardExemplos.offsetHeight 
    if(heightCardEnunciado>heightCardExemplos){
      cardEnunciado && cardEnunciado.setAttribute("style",`height:${heightCardEnunciado}px`);
      cardExemplos && cardExemplos.setAttribute("style",`height:${heightCardEnunciado}px`);
    }
    else{
      cardEnunciado && cardEnunciado.setAttribute("style",`height:${heightCardExemplos}px`);
      cardExemplos && cardExemplos.setAttribute("style",`height:${heightCardExemplos}px`);
    }
  }
  async getInfoTurma(){
      const id = this.props.match.params.id
      try{
          const response = await api.get(`/class/${id}`)
          this.setState({
              turma:response.data,
              loadingInfoTurma:false,
          })
      }
      catch(err){
          this.setState({loadingInfoTurma:false})
          console.log(err);
      }
  }
  async getExercicio(){
    const id = this.props.match.params.idExercicio
    const query = `?exclude=solution`
    try{

      const response = await api.get(`/question/${id}${query}`)
      console.log('questão');
      console.log(response.data);
      this.setState({
        results : [...response.data.results],
        title : response.data.title,
        description : response.data.description,
        katexDescription:response.data.katexDescription || '',
        difficulty:response.data.difficulty,
        
        loadingExercicio:false
      })

    }
    catch(err){
      this.setState({loadingExercicio:false})
    } 
  }
  async submeter(e){
    e.preventDefault()
    const timeConsuming = new Date() - this.state.tempo_inicial
    const {solution,language,results} = this.state
    console.log('solution:');
    console.log(solution);
    const request = {
      codigo : solution,
      linguagem :language==='c_cpp'?'cpp':language,
      results : results
    }
    console.log('codigo aparado');
    console.log(request.codigo);
    this.setState({loadingReponse:true})
    try{
      const response = await apiCompiler.post('/submission/exec',request)
      this.saveSubmission(request,response.data.percentualAcerto,timeConsuming)
      console.log('sumbissão: ');
      console.log(response.data);
      this.setState({
        loadingReponse:false,
        response:response.data.results,
        percentualAcerto:response.data.percentualAcerto,
        contentRes:response.data.info,
        someErro:response.data.someErro,
      })
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      alert('erro na conexão com o servidor')
    }
    
  }
  async saveSubmission({codigo,linguagem},hitPercentage,timeConsuming){
    const idQuestion = this.props.match.params.idExercicio
    const query = `?class=${this.props.match.params.id}`
    const request = {
      answer: codigo,
      language: linguagem,
      hitPercentage : hitPercentage,
      timeConsuming : timeConsuming
    }
    try{
      const response = await api.post(`/submission/question/${idQuestion}/store${query}`,request)
      this.setState({tempo_inicial:new Date()})
    }
    catch(err){
      this.setState({tempo_inicial:new Date()})
      console.log(err);
    }
  }

  async changeLanguage(e){
    await this.setState({language:e.target.value})
  }
  async changeTheme(e){
    await this.setState({theme:e.target.value})

  }
  handleSolution(newValue){
    this.setState({solution:newValue})
  }

  render() {
    const {turma,response,redirect,someErro,percentualAcerto,loadingEditor,loadingReponse,title,description,inputs,outputs,results,katexDescription} = this.state
    const { language,theme,contentRes,solution,loadingExercicio ,loadingInfoTurma} = this.state;

    return (

    <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
        <div className='row'>
        <div className ="col-12">
          {loadingInfoTurma?
              <div className="loader"  style={{margin:'0px auto'}}></div>
              :
              <h3><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
          }
        </div>
        </div>
        {loadingExercicio?
          <div className="loader"  style={{margin:'0px auto'}}></div>
        :
        <Fragment>
        <div className='row' >
          <div className ="col-7">
            <Card id='cardEnunciado'>
              <CardHead>
                <CardTitle>
                <b>{title}</b>
                </CardTitle>
              </CardHead>
              <CardBody>
                {description}
                {katexDescription?[<br/>,<br/>,<BlockMath>{katexDescription}</BlockMath>]:''}                
              </CardBody>
            </Card>

          </div>
          <div className="col-5">
            <Card id="cardExemplos">
              <CardHead>
                <CardTitle>
                  Exemplos
                </CardTitle>
              </CardHead>
              <CardBody>
              
                <table className="table">
                  <tbody>
                    <tr>
                      <td><b>Exemplo de entrada</b></td>
                      <td><b>Exemplo de saída</b></td>                       
                    </tr>
                      {results.map((res,i)=> 
                      <tr key={i}>
                        <td>
                          <HTMLFormat>
                            {res.inputs}
                          </HTMLFormat>
                        </td>
                        <td>
                          <HTMLFormat>
                            {res.output}
                          </HTMLFormat>
                        </td>
                      </tr>
                    ).filter((res,i) => i<2)}
                  </tbody>
                </table>
            </CardBody>
            </Card>
          </div>
          </div>
          <div className ="row" style={{marginBottom:"10px"}}>
              <FormSelect
                loadingReponse={loadingReponse}
                languages = {this.state.turma.languages}
                changeLanguage={this.changeLanguage.bind(this)}
                changeTheme={this.changeTheme.bind(this)}
                executar={this.submeter.bind(this)}
              />
            <div className="col-5 col-md-3">
                <label htmlFor="rascunho">&nbsp;</label>
                <button style={{width:"100%"}} className={`btn btn-azure`} >
                  <i className="fa fa-floppy-o"/>&nbsp;&nbsp; Salvar rascunho
                </button>
            </div>
            <div className="col-5 col-md-2" style={{float:"right", marginLeft:"auto"}}>

            <label htmlFor="selectDifficulty">Dificudade: </label>
              <select className="form-control"  id='selectDifficulty' >
                <option value = 'Muito fácil' >Muito fácil</option>
                <option value = 'Fácil' >Fácil</option>
                <option value = 'Médio' >Médio</option>
                <option value = 'Difícil' >Difícil</option>
                <option value = 'Muito difícil' >Muito difícil</option>

              </select>
            </div>
          </div>
         <div className='row'>
           <div className ="col-12 col-md-7">
              <Card>
              <AceEditor
                mode={language}
                theme={theme}
                focus={false}
                onChange={this.handleSolution.bind(this)}
                value={solution}
                fontSize={14}
                width='100%'
                showPrintMargin={false}
                name="ACE_EDITOR"
                showGutter={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={true}
                highlightActiveLine={true}
              />
              </Card>
           </div>

          <div className ="col-12 col-md-5">
          {loadingReponse?
              <div className="loader"  style={{margin:'0px auto'}}></div>
           :
              <div style={{backgroundColor:"white"}}>
                <CardHead>
                  <h3>Resultados:</h3>
                </CardHead>
                <TableResults2 
                  response={response}
                  descriptionErro={contentRes}
                  erro={someErro}
                  percentualAcerto={percentualAcerto}
                />
              </div>
          }
          </div>
        </div>
        </Fragment>
        }
        
    </TemplateSistema>
    );
  }
}
