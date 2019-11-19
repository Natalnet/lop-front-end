import React, { Component} from "react";
import {Redirect} from 'react-router-dom'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import apiCompiler from '../../../services/apiCompiler'
import Swal from 'sweetalert2'
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
import TableResults2 from '../../../components/ui/tables/tableResults2.component'
import TableIO from '../../../components/ui/tables/tableIO.component'
import FormExercicio from '../../../components/ui/forms/formExercicio.component'
import FormSelect2 from '../../../components/ui/forms/formSelect2.component'

export default class Editor extends Component {
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
      loadingReponse:false,
      savingQuestion:false,
      loadingEditor:false,
      title:'',
      description:'',
      inputs:'',
      outputs:'',
      percentualAcerto:'',
      tags:[],
      tagsSelecionadas:[],
      loadingTags:false,
      redirect:false,
    }
  }
  componentDidMount(){
    document.title = "Editar Exercício - professor";
    this.getTags()
    this.getExercicio()
  }
  async getTags(){
    try{
      this.setState({loadingTags:true})
      const response = await api.get('/tag')
      this.setState({
        tags: response.data.map(tag=>{
          return {
            value: tag.id,
            label: tag.name
          }
        }),
        loadingTags:false
      })
    }
    catch(err){
      console.log(err);
      this.setState({loadingTags:false})
    }
  }
  async getExercicio(){
    const id = this.props.match.params.id
    try{
      this.setState({loadingExercicio:true})
      const response = await api.get(`/question/${id}`)
      //console.log(response.data);
      const [inputs,outputs] = this.getInputsAndOutpus(response.data.results)
      this.setState({
        title : response.data.title,
        description : response.data.description,
        katexDescription:response.data.katexDescription || '',
        status:response.data.status,
        difficulty:response.data.difficulty,
        solution:response.data.solution,
        inputs:inputs,
        outputs:outputs,
        loadingExercicio:false,
        tagsSelecionadas:response.data.tags.map(tag=>{
          return {
            value:tag.id,
            label:tag.name
          }
        })
      })
    }

    catch(err){
      this.setState({loadingExercicio:false})
      console.log(Object.getOwnPropertyDescriptors(err));
    } 
  }
  async handleTagsChangeTags(tags){
    console.log(tags);
    this.setState({
        tagsSelecionadas:tags || []
    })
  }
  getInputsAndOutpus(results){
    let inputs=[]
    let output=[]
     console.log('results');
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
  async handleTitleChange(e){
      this.setState({
        title:e.target.value
      })
  }
  async handleDescriptionChange(e){
      this.setState({
        description:e.target.value
      })
  }
  async handlekatexDescription(e){
    this.setState({
      katexDescription:e.target.value
    })
  }

  async handleStatus(e){
    console.log(e.target.value);
    this.setState({status:e.target.value})
  }
  async handleDifficulty(e){
    this.setState({
      difficulty:e.target.value
    })
  }
  async handleInputsChange(e){
      this.setState({
        inputs:e.target.value
      })
  }
  async handleOutputsChange(e){
      this.setState({
        outputs:e.target.value
      })
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
  async executar(e){
    e.preventDefault()
    const {solution,language} = this.state
    const request = {
      codigo : solution,
      linguagem :language,
      results : this.getResults()
    }
    this.setState({loadingReponse:true})
    try{
      const response = await apiCompiler.post('/submission/exec',request)
      this.setState({ loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          contentRes:response.data.info,
        })
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      alert('erro na conexão com o servidor')
    }
    
  }
  getResults(){
    const {inputs,outputs} = this.state
    const entradas = inputs.split('\n').map(input => input.trim())
    const saidas = outputs.split('\n').map(input => input.replace(/\s+$/,''))
    console.log('saidas: '+saidas);
    const resultados = []
    for(let i=0 ; i<entradas.length ; i++ ){
      resultados.push({
        inputs: entradas[i]?entradas[i].split(',').map(i=>i.trim()).map(entrada => entrada+'\n').join(''):'',
        output: saidas[i]?saidas[i].split('|').map(saida => saida.replace(/\s+$/,'')).join('\n').replace(/\n+$/,''):''
      })
    }
    return resultados
  }
  async updateQuestion(e){
    const id = this.props.match.params.id
    Swal.fire({
      title:'Atualizando questão',
      allowOutsideClick:false,
      allowEscapeKey:false,
      allowEnterKey:false
    })
    Swal.showLoading()
    console.log('katexDescription:');
    console.log(this.state.katexDescription);
    const request = {
      title : this.state.title,
      description : this.state.description,
      katexDescription:this.state.katexDescription,
      status:this.state.status,
      difficulty:this.state.difficulty,
      solution:this.state.solution,
      tags:this.state.tagsSelecionadas.map(tag=>tag.value),
      results : this.getResults()
    }
    try{
      this.setState({savingQuestion:true})
      const response = await api.put(`/question/update/${id}`,request)
      
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Questão atualizada com sucesso!',
      })
      this.setState({
        savingQuestion:false,
        redirect:true
      })
      console.log(response.data)
    }
    catch(err){
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Questão não pôde ser atualizada',
      })
      this.setState({savingQuestion:false})
      console.log(Object.getOwnPropertyDescriptors(err));

    }
  }

  render() {
    if(this.state.redirect){
      return <Redirect to='/professor/exercicios' />
    }
    const {percentualAcerto,response,status,difficulty,katexDescription,savingQuestion,loadingReponse,title,description,inputs,outputs} = this.state
    const { language,theme,contentRes,solution,loadingExercicio,tags,tagsSelecionadas ,loadingTags,someErro } = this.state;


    return (
    <TemplateSistema active='exercicios'>
    <Card>
      <CardHead>
          <CardTitle center>
            <i className="fa fa-edit"></i> Atualizar questão
          </CardTitle>
      </CardHead>
      <CardBody loading={loadingExercicio}>
      <FormExercicio
        title={title}
        description={description}
        inputs={inputs}
        outputs={outputs}
        katexDescription={katexDescription}
        status={status}
        difficulty={difficulty}
        loadingReponse={loadingReponse}
        tags={tags}
        defaultTags={tagsSelecionadas}
        loadingTags={loadingTags}
        handleTagsChangeTags={this.handleTagsChangeTags.bind(this)}
        handleTitleChange={this.handleTitleChange.bind(this)}
        handleDescriptionChange={this.handleDescriptionChange.bind(this)}
        handlekatexDescription={this.handlekatexDescription.bind(this)}
        handleStatus={this.handleStatus.bind(this)}
        handleDifficulty={this.handleDifficulty.bind(this)}
        handleInputsChange={this.handleInputsChange.bind(this)}
        handleOutputsChange={this.handleOutputsChange.bind(this)}
      />
      <div className='row'>
        <div className="card col-12">
          <TableIO
            results={this.getResults()}
          />
        </div>
      </div>
      <div className ="row" style={{marginBottom:"10px"}}>
      <FormSelect2
        loadingReponse={loadingReponse}
        changeLanguage={this.changeLanguage.bind(this)}
        changeTheme={this.changeTheme.bind(this)}
        executar={this.executar.bind(this)}
      />
      </div>
          <div className='row'>
            <div className='col-12 col-md-7'>
              <AceEditor
                mode={language==='cpp'?'c_cpp':language}
                theme={theme}
                focus={false}
                onChange={this.handleSolution.bind(this)}
                value={solution}
                fontSize={14}
                width='100%'
                name="ACE_EDITOR"
                showPrintMargin={false}
                showGutter={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={true}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </div>

          <div className ="col-12 col-md-5">
          {loadingReponse?
              <div className="loader"  style={{margin:'0px auto'}}></div>
           :
              <Card style={{minHeight:'500px'}}>
                <CardHead>
                  <CardTitle>
                    Resultados
                  </CardTitle>
                </CardHead>
                <TableResults2 
                  response={response}
                  descriptionErro={contentRes}
                  erro={someErro}
                  percentualAcerto={percentualAcerto}
                />
              </Card>
          }
          </div>
          </div>
        </CardBody>
        <CardFooter loading={loadingExercicio}>
          <button onClick={e => this.updateQuestion(e)} className={`btn btn-primary btn-lg btn-block ${savingQuestion && 'btn-loading'}`}>
            <i className="fa fa-save"></i> Atualizar
          </button>         
        </CardFooter>
      </Card>
    </TemplateSistema>
    );
  }
}