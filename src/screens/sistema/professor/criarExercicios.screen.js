import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";
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
import TableResults2 from '../../../components/ui/tables/tableResults2.component'
import TableIO from '../../../components/ui/tables/tableIO.component'
import Select from 'react-select';
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import FormSelect2 from '../../../components/ui/forms/formSelect2.component'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default class Editor extends Component {
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      editorRes:'',
      descriptionErro:"",
      language:'javascript',
      theme:'monokai',
      response:[],
      katexDescription:'',
      status:'PÚBLICA',
      difficulty:'Médio',
      solution:'',
      loadingReponse:false,
      savingQuestion:false,
      title:'',
      description:'',
      tests:[{
        inputs:'',
        output:'',
        msgInputs:'',
        msgOutput:'',
      }],
      msgTitle:'',
      msgDescription:'',
      percentualAcerto:'',
      tags:[],
      tagsSelecionadas:[],
      loadingTags:false,
    }
  }
  componentDidMount(){
    this.getTags()
    document.title = "Criar Exercício - professor";
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
  handleNumTest(action){
    let {tests} = this.state
    if(action==='+'){
      tests = [...tests,{
        inputs:'',
        output:'',
        msgInputs:'',
        msgOutput:'',
      }]
    }
    else{
      if(tests.length===1) return null
      else{
        tests.pop()
      }
    }
    this.setState({
      tests:[...tests]
    })
  }
  async handleTagsChangeTags(tags){
    console.log(tags);
    this.setState({
        tagsSelecionadas:tags || []
    })
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
  handleInputsChange(e,i){
    const inputs = e.target.value
    const {tests} = this.state
    tests[i].inputs = inputs
    this.setState({tests:tests})
  }
  handleOutputChange(e,i){
    const output = e.target.value
    const {tests} = this.state
    tests[i].output = output
    this.setState({tests:tests})
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
  isTestEmpty(results){
     let isTestEmpty = false
     const testsChecked = results.map(test=>{
        if(!test.inputs || !test.output) isTestEmpty = true
          return {
            inputs:test.inputs.replace(/\s+$/,''),
            output:test.output.replace(/\s+$/,'').replace(/\n+$/,''),
            msgInputs:!test.inputs?'Este campo obrigatório':'',
            msgOutput:!test.output?'Este campo obrigatório':''
        }
     })
     this.setState({tests:testsChecked})
     return isTestEmpty;
  }
  async executar(e){
    e.preventDefault()
    let {tests,solution,language} = this.state
    if(this.isTestEmpty(tests)) return null
    const results = this.rTrimAll(tests)
    const request = {
      codigo : solution,
      linguagem :language,
      results, 
    }
    try{
      this.setState({ loadingReponse:true})
      const response = await apiCompiler.post('/submission/exec',request)
      this.setState({ loadingReponse:false})
      console.log('resultados da requisição');
      console.log(response.data);
      if(response.status===200){
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          descriptionErro:response.data.descriptionErro,
        })
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      alert('erro na conexão com o servidor')
    }
    
  }
  rTrimAll(tests){
    console.log('antes do Rtrim');
    console.log(tests);

    const results =  tests.map(test=>{
      return {
        inputs:test.inputs.split('\\n').map(test=>test.replace(/\s+$/,'')).join('\n'),
        output:test.output.split('\\n').join('\n').replace(/\s+$/,'').replace(/\n+$/,'')
      }
    })
    console.log('depois do em RTrim');
    console.log(results);
    return results
  }
  async saveQuestion(e){
    e.preventDefault()
    let {tests,title,description,tagsSelecionadas,solution,status,difficulty,katexDescription} = this.state
    if(this.isTestEmpty(tests)) return null
    const results = this.rTrimAll(tests)
    Swal.fire({
      title:'Salvando questão',
      allowOutsideClick:false,
      allowEscapeKey:false,
      allowEnterKey:false
    })
    Swal.showLoading()
    const request = {
      title,
      description,
      tags : tagsSelecionadas.map(tag=>tag.value),
      katexDescription,
      status,
      difficulty,
      solution,
      results,
    }
    try{
      this.setState({savingQuestion:true})
      await api.post('/question/store',request)
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Questão salva com sucesso!',
      })
      this.setState({
        savingQuestion:false,
      })
      this.props.history.push('/professor/exercicios')
    }
    catch(err){
      console.log('status');
      console.log(err.response && err.response.status);
      console.log(Object.getOwnPropertyDescriptors(err));
      await this.setState({
        msgTitle:'',
        msgDescription:'',
      })
      if(err.response && err.response.status===400){
          for(let fieldErro of err.response.data){
            if(fieldErro.field==="title"){
              this.setState({msgTitle:fieldErro.msg})
            }
            if(fieldErro.field==="description"){
              this.setState({msgDescription:fieldErro.msg})
            }
          }
      }
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Questão não pôde ser salva',
      })
      this.setState({savingQuestion:false})
    }
  }

  render() {
    const {percentualAcerto,status,difficulty,katexDescription,response,savingQuestion ,loadingReponse,title,description} = this.state
    const { tests,language,theme,descriptionErro,solution,tags,loadingTags,msgTitle,msgDescription} = this.state;
    return (
    <TemplateSistema active='exercicios'>
      <Row mb={15}>
          <Col xs={12}>
            <h5 style={{margin:'0px'}}>
                <Link to="/professor/exercicios">
                  Exercícios
                </Link>
                <i className="fa fa-angle-left ml-2 mr-2"/> 
                Criar Exercício
              </h5>
          </Col>
      </Row>
    <Card>
      <CardBody>
      <form onSubmit={e => this.saveQuestion(e)} >
        <div className="form-row">
          <div className="form-group col-md-12">
            <label>Título: </label>
            <input
              type="text"
              onChange={(e)=>this.handleTitleChange(e)} 
              className={`form-control ${msgTitle && 'is-invalid'}`} 
              placeholder="Digite o título da questão..." 
              value={title}
              required
            />
            <div className="invalid-feedback">{msgTitle}</div>
          </div>
          <div className="form-group col-md-12">
            <label>Enunciado:</label>
            <textarea 
              onChange={(e)=>this.handleDescriptionChange(e)} 
              style={{height:'150px'}} 
              className={`form-control ${msgDescription && 'is-invalid'}`}  
              value={description}
              required
            >
            </textarea> 
            <div className="invalid-feedback">{msgDescription}</div>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="selectStatus">Status da questão: </label>
            <select className="form-control" defaultValue={status} id='selectStatus' onChange={(e)=>this.handleStatus(e)}>
              <option value='PÚBLICA'>Pública (para uso em listas)</option>
              <option value='PRIVADA'>Oculta (para uso em provas)</option>
            </select>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="selectDifficulty">Dificuldade </label>
            <select className="form-control" defaultValue={difficulty} id='selectDifficulty' onChange={(e)=>this.handleDifficulty(e)}>
              <option value = 'Muito fácil' >Muito fácil</option>
              <option value = 'Fácil' >Fácil</option>
              <option value = 'Médio' >Médio</option>
              <option value = 'Difícil' >Difícil</option>
              <option value = 'Muito difícil' >Muito difícil</option>
            </select>
          </div>
          <div className="form-group col-12">
            <label>Tags </label>
              <Select
              style={{boxShadow: "white"}}
              options={tags || []}
              isMulti
              isLoading={loadingTags}
              closeMenuOnSelect={false}
              onChange={this.handleTagsChangeTags.bind(this)}
              />
          </div>
          <div className="form-group col-md-6">
            <label>
            Katex: &nbsp;
            <a href='https://katex.org/docs/supported.html#operators' className="badge badge-info" rel="noopener noreferrer" target='_blank'>
              <i className="fa fa-info-circle"/> &nbsp;
              Ver documentação
              </a>
            </label>
            <textarea 
              onChange={(e)=>this.handlekatexDescription(e)} 
              style={{height:'150px'}} 
              className="form-control" 
              value={katexDescription}
            >
              </textarea> 
          </div>
          <div className="col-md-6" >
            <label>Saída Katex:</label>
            <div className="alert alert-info" role="alert" style={{height:'150px'}}>
              <BlockMath>
              {katexDescription}
              </BlockMath>
            </div>
          </div>
          {/*teste*/}
          <div className="form-group col-md-12">      
            <label className="mr-2">Entradas para testes: </label>
            <button onClick={()=>this.handleNumTest('+')} type="button" className="btn btn-primary btn-sm mr-2">
              <i className="fe fe-plus"/>
            </button>
            <button onClick={()=>this.handleNumTest('-')} type="button" className="btn btn-sm btn-danger">
              <i className="fe fe-minus"/>
            </button>
          </div>
            {tests.map((test,i)=>{
              return(
                <Fragment key={i}>
                  
                  <div className="form-group col-12 col-md-6" style={{border:'1px solid #00f'}}>
                  <div className="form-group col-12">
                    <label>teste {i+1}</label>
                  </div>
                  <div className="form-group col-12">
                    <label>entrada(s) (cada entrada deve vir acompanahada de um \n)</label>
                      <input
                        type="text"
                        onChange={(e)=>this.handleInputsChange(e,i)} 
                        className={`form-control ${!tests[i].inputs && tests[i].msgInputs?'is-invalid':''}`}
                        placeholder="Ex: 12\n16.4\nOlá mundo!\n"
                        value={tests[i].inputs}
                        required
                      />
                      <div className="invalid-feedback">{!tests[i].inputs && tests[i].msgInputs?tests[i].msgInputs:''}</div>
                  </div>
                  <div className="form-group col-12">
                    <label>saída</label>
                      <textarea 
                        onChange={(e)=>this.handleOutputChange(e,i)} 
                        style={{minHeight:'38px',height:'90px',width:'100%'}}
                        className={`form-control ${!tests[i].output && tests[i].msgOutput?'is-invalid':''}`}
                        wrap="off"
                        placeholder="EX1: 34.89; EX2: Eh maior"
                        value={tests[i].output}
                        required
                      >
                      </textarea>
                      <div className="invalid-feedback">{!tests[i].output && tests[i].msgOutput?tests[i].msgOutput:''}</div>
                  </div>
                  
                </div>
                
                </Fragment>
              )
              })
            }
        </div>
      <div className='row'>
        <div className="card col-12">
          <TableIO
            results={this.rTrimAll(tests)}
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
                 
                 
                highlightActiveLine={true}
                setOptions={{
                   
                   
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
                  showAllTestCases={true}
                  descriptionErro={descriptionErro}
                  percentualAcerto={percentualAcerto}
                />
              </Card>
          }
          </div>
        </div>
          <button type='submit' className={`btn btn-primary btn-lg btn-block ${savingQuestion && 'btn-loading'}`}>
            <i className="fa fa-save"></i> Salvar
          </button> 
        </form>
        </CardBody>
      </Card>
    </TemplateSistema>
    );
  }
}