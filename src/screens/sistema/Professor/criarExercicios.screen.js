import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'

import TemplateSistema from "components/templates/sistema.template";
//import PropTypes from "prop-types";
import api from '../../../services/api'
import apiCompiler from '../../../services/apiCompiler'

//import * as monaco from 'monaco-editor'
import TableResults from '../../../components/ui/tables/tableResults.component'
import FormExercicio from '../../../components/ui/forms/formExercicio.component'
import FormSelect from '../../../components/ui/forms/formSelect.component'
import styleEditor from '../../../'
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
      content:"//code here...",
      contentRes:"//Resposta\n",
      language:'javascript',
      theme:'vs-dark',
      response:[],
      msgSavedSucess:false,
      msgSavedFailed:false,
      loadingReponse:false,
      savingQuestion:false,
      loadingEditor:true,
      title:'',
      description:'',
      inputs:'',
      outputs:'',
      percentualAcerto:'',
      redirect:'',
      perfil: localStorage.getItem("user.profile")
    }
  }

  componentDidMount() {
    this.handleLoad();
  }
  //-----------------funções para carregar o editor---------------------//
  handleLoad(){
    // @note: safe to not check typeof window since it'll call on componentDidMount lifecycle:
    if (!window.require) {
      const loaderScript = window.document.createElement("script");
      loaderScript.type = "text/javascript";
      // @note: Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack (cf. https://github.com/Microsoft/monaco-editor/issues/18):
      loaderScript.src = "https://unpkg.com/monaco-editor/min/vs/loader.js";
      loaderScript.addEventListener("load", this.didLoad);
      window.document.body.appendChild(loaderScript);
    } else {
      this.didLoad();
    }
  }

  async handleMount() {
    console.log('editor montado');
    await this.setState({loadingEditor:false})

    const elementEditor = document.getElementById('monacoEditor')
    elementEditor.innerHTML = ''

    const elementEditorRes = document.getElementById('monacoEditorRes')
    elementEditorRes.innerHTML = ''

    const { language,theme,content,contentRes } = this.state;
    //editor de codigo
    const editor = window.monaco.editor.create(elementEditor, {
      value: content,
      language,
      theme,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      scrollBeyondLastColumn:false,
      selectOnLineNumbers:false,
      minimap:{enabled:false},
      overviewRulerBorder:false,
    });
    //teste
    const editorRes = window.monaco.editor.create(elementEditorRes, {
      value: contentRes,
      language:'javascript',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      scrollBeyondLastColumn:false,
      selectOnLineNumbers:false,
      minimap:{enabled:false},
      overviewRulerBorder:false,
      readOnly:true,
    });
    await this.setState({
      editor:editor,
      editorRes:editorRes

    })
    return this.state.editor;
  }
  didLoad = e => {

    window.require.config({
      paths: { vs: "https://unpkg.com/monaco-editor/min/vs" }
    });
    window.require(["vs/editor/editor.main"], () => {
      this.handleMount();
    });

    if (e) {
      e.target.removeEventListener("load", this.didLoad);
    }
  }
  //--------------------------------------------------------------//

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
    const language = e.target.value;
    const content = this.state.editor.getValue()
    const contentRes = this.state.editorRes.getValue()
    //console.log(' e.target.value: '+language)
    await this.setState({
      language,
      contentRes,
      content
    })
    //console.log('language: '+this.state.language);
    this.handleMount()
  }
  async changeTheme(e){
    const theme = e.target.value;
    const content = this.state.editor.getValue()
    const contentRes = this.state.editorRes.getValue()
    await this.setState({
      theme,
      content,
      contentRes
    })
    this.handleMount()
  }
  async executar(e){
    //console.log(e.target.value);
    const request = {
      codigo : this.state.editor.getValue(),
      linguagem : this.state.language,
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
          contentRes:'//Respostas...\n'+response.data.info,
          content: this.state.editor.getValue()
        })
        this.handleMount()
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      this.setState({
        content: this.state.editor.getValue()
      })
      this.handleMount()
      alert('erro na conexão com o servidor')
    }
    
  }
  getResults(){
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
    console.log('resultados:');
    console.log(resultados);
    return resultados
  }
  async saveQuestion(e){
    const request = {
      title : this.state.title,
      description : this.state.description,
      results : this.getResults()
    }
    try{
      this.setState({savingQuestion:true})
      const response = await api.post('/question/store',request)
      console.log(response.data)
      if(response.status===200){
        this.setState({
            msgSavedSucess:true,
            savingQuestion:false
        })
      }
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({
        msgSavedFailed:true,
        savingQuestion:false
      })
    }
  }

  render() {
    if(this.state.perfil!=="PROFESSOR"){
      return <Redirect to="/401" />;
    }
    const {percentualAcerto,response,redirect,msgSavedSucess,savingQuestion,msgSavedFailed ,loadingEditor,loadingReponse,title,description,inputs,outputs} = this.state
    const { language,theme,content,contentRes } = this.state;

    /*if(redirect){
      return <Redirect to={'/'} exact={true} />
    }*/
    
    if(loadingEditor){
      return(
        <div className="container text-center">
          <br/><br/><br/><img src={imgLoading} width="300px" />
        </div>
      )
    }
    else
    return (
    <TemplateSistema active='criarExercicio'>
    <div className="container">
    <form className="form-group form-control col-12">
      <div className="row">
        <div className="col-12 text-center">
          <h2>Nova questão</h2>
        </div>
      </div>
      <FormExercicio
        title={title}
        description={description}
        inputs={inputs}
        outputs={outputs}
        loadingReponse={loadingReponse}
        handleTitleChange={this.handleTitleChange.bind(this)}
        handleDescriptionChange={this.handleDescriptionChange.bind(this)}
        handleInputsChange={this.handleInputsChange.bind(this)}
        handleOutputsChange={this.handleOutputsChange.bind(this)}
      />
      <FormSelect
        loadingReponse={loadingReponse}
        changeLanguage={this.changeLanguage.bind(this)}
        changeTheme={this.changeTheme.bind(this)}
        executar={this.executar.bind(this)}
      />
          <div className='row'>
            <div className='col-6'>
              <div id='monacoEditor' style={{height:"400px", width:"100%"}}/>
            </div>
           {loadingReponse?
           <div className="card" className ="col-6 text-center">
              <img src={imgLoading2} width="300px" />           
           </div>:
           <div className="card" className ="col-6">
             <div id='monacoEditorRes' style={{height:"400px", width:"100%"}}/>
           </div>
           }
          </div>
        
        <div className='row'>
            <div className="card" className ="col-12">
              <TableResults 
                response={response}
                percentualAcerto={percentualAcerto}
              />
            </div>
        </div>

        {msgSavedSucess?
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Questão salva com sucesso :)
          <button onClick={e => this.setState({msgSavedSucess:false})} type="button" className="close" data-dismiss="alert">
            <span >&times;</span>
          </button>
        </div>:''}

        {msgSavedFailed?
        <div className="alert alert-warning  alert-dismissible fade show" role="alert">
          Questão não pôde ser salva :(
          <button onClick={e => this.setState({msgSavedFailed:false})} type="button" className="close" data-dismiss="alert">
            <span>&times;</span>
          </button>
        </div>:''}
        
        <br></br>
        {savingQuestion?
          <button id="save" type="button" className="btn btn-primary btn-lg btn-block" disabled>Salvando</button>
        :
          <button id="save" onClick={e => this.saveQuestion(e)} type="button" className="btn btn-primary btn-lg btn-block">Salvar</button>        
        }
    </form>
    </div>
    </TemplateSistema>
    );
  }
}