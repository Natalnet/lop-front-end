import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from '../../../services/api'
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
    }
  }

  componentDidMount() {
    this.setState({tempo_inicial:new Date()})
    console.log('props');
    console.log(this.props);
    this.getExercicio()
  }
  async getExercicio(){
    const id = this.props.match.params.id
    try{
      this.setState({loadingExercicio:true})
      const response = await api.get(`/question/${id}`)
      console.log('questão');
      console.log(response.data);
      //const [inputs,outputs] = this.getInputsAndOutpus(response.data.results)
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
    const request = {
      codigo : solution,
      linguagem :language==='c_cpp'?'cpp':language,
      results : results
    }
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
    const idQuestion = this.props.match.params.id
    const query = this.props.location.search
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
  getInputsAndOutpus(results){
    let inputs=[]
    let output=[]
    for(let i=0 ; i<results.length ; i++ ){
      console.log(results[i]);
      inputs.push(results[i].inputs.slice(0,-1).split('\n').join(','))
      output.push(results[i].output.split('\n').join('|'))
    }
    inputs = inputs.join('\n')
    output = output.join('\n')
    console.log(inputs);
    return [inputs,output]
  }
  /*getResults(){
    const {inputs,outputs} = this.state
    const entradas = inputs.split('\n')
    const saidas = outputs.split('\n')
    console.log('saidas: '+saidas);
    const resultados = []
    for(let i=0 ; i<entradas.length ; i++ ){
      resultados.push({
        inputs: (entradas[i].split(',').map(inp => inp+'\n')).join(''),
        output: saidas[i].split('|').join('\n')
      })
    }
    return resultados
  }*/
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
    const {response,redirect,someErro,percentualAcerto,loadingEditor,loadingReponse,title,description,inputs,outputs,results} = this.state
    const { language,theme,contentRes,solution,loadingExercicio } = this.state;

    if(redirect){
      return <Redirect to={'/'} exact={true} />
    }
    if(loadingEditor){
      return(
        <div className="container text-center">
          <br/><br/><br/><img src={imgLoading} width="300px" />
        </div>
      )
    }
    else{
    return (

    <TemplateSistema active='exercicios'>
        <div className='row'>
          <div className ="col-12">
            <CardEnunciado
              title={title}
              description={description}
              id={this.idExercicio}
              results={results}
            />
          </div>
          <div className ="col-12">
            <FormSelect
              loadingReponse={loadingReponse}
              changeLanguage={this.changeLanguage.bind(this)}
              changeTheme={this.changeTheme.bind(this)}
              executar={this.submeter.bind(this)}
            />
           </div>
         </div>

         <div className='row'>
           <div className ="col-6">
              <Card>
              <AceEditor
                mode={language}
                theme={theme}
                focus={false}
                onChange={this.handleSolution.bind(this)}
                value={solution}
                fontSize={14}
                width='100%'
                name="ACE_EDITOR"
                showPrintMargin={true}
                showGutter={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={true}
                highlightActiveLine={true}
              />
              </Card>
           </div>

          <div className ="col-6">
          {loadingReponse?
              <div className="loader"  style={{margin:'0px auto'}}></div>
           :
              
              <TableResults2 
                response={response}
                descriptionErro={contentRes}
                erro={someErro}
                percentualAcerto={percentualAcerto}
              />
          }
          </div>
        </div>
        
    </TemplateSistema>
    );
    }
  }
}
