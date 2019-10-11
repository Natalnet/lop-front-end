import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from '../../../services/api'
import apiCompiler from '../../../services/apiCompiler'
//import * as monaco from 'monaco-editor'
import TableResults from '../../../components/ui/tables/tableResults.component'
import FormExercicio from '../../../components/ui/forms/formExercicio.component'
import FormSelect from '../../../components/ui/forms/formSelect.component'
import TemplateSistema from '../../../components/templates/sistema.template'
import CardEnunciado from '../../../components/ui/card/cardEnunciadoExercicio.component'
import styleEditor from '../../../assets/Editor.css'
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
      contentRes:"",
      language:'javascript',
      theme:'vs-dark',
      response:[],
      percentualAcerto:'',
      loadingReponse:false,
      loadingEditor:true,
      title:'',
      description:'',
      results:'',
      inputs:'',
      outputs:'',
      redirect:'',
      someErro:false
    }
    this.idTurma = this.props.match.params.idTurma
    this.idLista = this.props.match.params.idLista
    this.idExercicio = this.props.match.params.id
  }
  async componentWillMount(){
    try{
      const response = await api.get(`/question/${this.idExercicio}`)
      console.log('results:');
      console.log(response.data.results);
      this.setState({
        title:response.data.title,
        description:response.data.description,
        results:response.data.results,
      })
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
    }  
  }
  componentDidMount() {
    this.handleLoad();
  }
  //-----------------funções para carregar o editor---------------------//
  handleLoad() {
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

    const { language,theme,content,contentRes,someErro } = this.state;
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
    await this.setState({editor:editor})

    if(someErro){
      const elementEditorRes = document.getElementById('monacoEditorRes1')
      elementEditorRes.innerHTML = ''
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
      await this.setState({editorRes:editorRes})
    }
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
  //--------------------------------------------------------------------//

  async changeLanguage(e){
    const language = e.target.value;
    const {editor,editorRes} = this.state
    const content = editor?editor.getValue():''
    const contentRes = editorRes?editorRes.getValue():''
    
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
    const {editor,editorRes} = this.state
    const content = editor?editor.getValue():''
    const contentRes = editorRes?editorRes.getValue():''
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
      results:this.state.results
    }
    this.setState({loadingReponse:true})
    try{
      const response = await apiCompiler.post('/submission/exec',request)
      this.setState({loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          contentRes:response.data.info,
          someErro:response.data.someErro,
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
  render() {
    const {response,redirect,someErro,percentualAcerto,loadingEditor,loadingReponse,title,description,inputs,outputs,results} = this.state
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

    <TemplateSistema>
    <div className="container">
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
              executar={this.executar.bind(this)}
            />
           </div>
         </div>

         <div className='row'>
           <div className="card" className ="col-12">
             <div  id='monacoEditor' style={{height:"400px", width:"100%"}}/>
           </div>
         </div>
        <div className='row'>
          <div className="card" className ="col-12">
            <h3>Resultados:</h3>
          </div>
          {loadingReponse?
           <div className="card" className ="col-12 text-center">
              <img src={imgLoading2} width="300px" />           
           </div>:
           <Fragment>
            {someErro?
              <div className="card" className ="col-12">
                <div id='monacoEditorRes1' style={{height:"200px", width:"100%"}}/>
              </div>
            :''
            }
            
            <div className="card" className ="col-12">
              <TableResults 
                response={response}
                percentualAcerto={percentualAcerto}
              />
            </div>
          </Fragment>
          }
        </div>
    </div>
    </TemplateSistema>
    );
    }
  }
}
