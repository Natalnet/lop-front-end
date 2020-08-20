import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { BlockMath } from "react-katex";
import AceEditor from "react-ace";
import "brace/mode/c_cpp";
import "brace/mode/python";

import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/theme/github";
import "brace/theme/tomorrow";
import "brace/theme/kuroir";
import "brace/theme/twilight";
import "brace/theme/xcode";
import "brace/theme/textmate";
import "brace/theme/solarized_dark";
import "brace/theme/solarized_light";
import "brace/theme/terminal";
import HTMLFormat from "components/ui/htmlFormat";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardOptions from "components/ui/card/cardOptions.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default (props)=>{
    const {response,loadingReponse,title,description,results,katexDescription} = props;
    const {language,theme,descriptionErro,solution,userDifficulty,loadDifficulty,salvandoRascunho} = props;
    const {changeLanguage,changeTheme,handleSolution,handleDifficulty,submeter,salvaRascunho} = props
    const themes = ['monokai','github','tomorrow','kuroir','twilight','xcode','textmate','solarized_dark','solarized_light','terminal']
    const languages = props.languages || ['javascript','cpp','python']
    console.log('languages: ',languages)
    let tests = props.showAllTestCases?response:response.filter((t,i)=>i===0)

    
    return(
    <>
        <Row mb={10}>
            <Col xs={12}>
                <Card className=" card-status-primary">
                    <CardHead>
                        <CardTitle>
                        <b><i className="fa fa-code mr-2"/> {title}</b>
                        </CardTitle>
                    </CardHead>
                    <CardBody className="overflow-auto">
                    <Row>
                        <Col xs={12} md={7}>
                            {/* <HTMLFormat>
                                {description}
                            </HTMLFormat> */}
                            <SunEditor 
                                lang="pt_br"
                                height="auto"
                                disable={true}
                                showToolbar={false}
                                // onChange={this.handleDescriptionChange.bind(this)}
                                setContents={description}
                                setDefaultStyle="font-size: 15px; text-align: justify"
                                setOptions={{
                                    toolbarContainer : '#toolbar_container',
                                    resizingBar : false,
                                    katex: katex,
                                }}
                            />
                            {katexDescription ? (
                                <BlockMath>{katexDescription}</BlockMath>
                            ) : (
                                ""
                            )}
                        </Col>
                        <Col xs={12} md={5}>
                            <table 
                                className="table table-exemplo"
                                style={{
                                    border: "1px solid rgba(0, 40, 100, 0.12)"
                                }}
                            >
                            <tbody >
                            <tr>
                                <td className="pt-0">
                                    <b>Exemplo de entrada</b>
                                </td>
                                <td className="pt-0">
                                <b>Exemplo de saída</b>
                                </td>
                            </tr>
                            {results
                                .map((res, i) => (
                                <tr key={i}>
                                    <td>
                                    <HTMLFormat>{res.inputs}</HTMLFormat>
                                    </td>
                                    <td>
                                    <HTMLFormat>{res.output}</HTMLFormat>
                                    </td>
                                </tr>
                                ))
                                .filter((res, i) => i < 2)}
                            </tbody>
                        </table>
                        </Col>
                    </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row mb={10}>
            <Col xs={4} md={2}>
                <label htmlFor="selectDifficulty">&nbsp; Linguagem: </label>
                <select className="form-control" onChange={(e)=>changeLanguage(e)}>
                    {languages.map(lang=>{
                    const language =
                        lang === "javascript"
                        ? "JavaScript"
                        : lang === "cpp"
                        ? "C/C++"
                        : lang === "python"
                        ?
                        "Python"
                        : "";                        
                        return(
                        <option key={lang} value = {lang}>
                            {language}
                        </option>
                        )
                    })}
                </select>
            </Col>
            <Col xs={4} md={2}>
                <label htmlFor="selectDifficulty">&nbsp; Tema: </label>
                <select defaultValue='monokai' className="form-control" onChange={(e)=>changeTheme(e)}>
                {
                    themes.map(thene=>(
                    <option key={thene} value ={thene}>{thene}</option>
                    ))
                }
                </select>
            </Col>
            <Col xs={4} md={3}>
                <label htmlFor="selectDifficul">&nbsp;</label>
                <button style={{width:"100%"}} className={`btn btn-primary ${loadingReponse && 'btn-loading'}`} onClick={(e)=>submeter(e)}>
                    <i className="fa fa-play" /> <i className="fa fa-gears" /> &nbsp;&nbsp; Submeter
                </button>
            </Col>
            <Col xs={5} md={3}>
            <label htmlFor="rascunho">&nbsp;</label>
            <button
                style={{ width: "100%" }}
                className={`btn btn-azure ${salvandoRascunho &&
                "btn-loading"}`}
                onClick={() => salvaRascunho()}
            >
                <i className="fa fa-floppy-o" />
                &nbsp;&nbsp; Salvar rascunho
            </button>
            </Col>
            <Col xs={5} md={2}>
            <label htmlFor="selectDifficulty">Dificuldade: </label>
            <select
                defaultValue = {userDifficulty}
                className="form-control"
                id="selectDifficulty"
                disabled={loadDifficulty ? "disabled" : ""}
                onChange={e => handleDifficulty(e)}
            >
                <option value={""}></option>
                <option value = '1' >Muito fácil</option>
                <option value = '2' >Fácil</option>
                <option value = '3' >Médio</option>
                <option value = '4' >Difícil</option>
                <option value = '5' >Muito difícil</option>
            </select>
            </Col>
        </Row>
        <Row>
            <Col xs={12} md={7}>
            <Card>
                <AceEditor
                    mode={language === "cpp" ? "c_cpp" : language}
                    theme={theme}
                    focus={false}
                    onChange={handleSolution}
                    value={solution}
                    fontSize={14}
                    width="100%"
                    showPrintMargin={false}
                    name="ACE_EDITOR"
                    showGutter={true}
                    highlightActiveLine={true}
                />
            </Card>
            </Col>

            <Col xs={12} md={5}>
            
                <Card className="card-results">
                    <CardHead>
                        <CardTitle>Resultados</CardTitle>
                    </CardHead>
                    {loadingReponse ? (
                        <div className="loader" style={{ margin: "100px auto" }}></div>
                    ) : (
                        descriptionErro?
                            <Card>
                                <CardBody className=" p-0 ">
                                <div class="alert alert-icon alert-danger" role="alert">
                                    <HTMLFormat>
                                        {descriptionErro}
                                    </HTMLFormat>
                                </div>
                                </CardBody>
                            </Card>
                        :
                            <>
                            {tests.map((teste,i)=>
                            <Card key={i} className={`card-status-${teste.isMatch?'success':'danger'}`}>
                                <CardHead>
                                <CardTitle>
                                    {`${i+1}° Teste `}
                                    {teste.isMatch?
                                    <i className="fa fa-smile-o" style={{color:'green'}}/>
                                    :
                                    <i className="fa fa-frown-o" style={{color:'red'}}/>
                                    }
                                </CardTitle>
                                <CardOptions>
                                    <i
                                    title='Ver descrição'
                                    style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                                    className={`fe fe-chevron-down`} 
                                    data-toggle="collapse" data-target={'#collapse'+i} 
                                    aria-expanded={false}
                                    />
                                </CardOptions>
                                </CardHead>
                                <div className="collapse" id={'collapse'+i}>
                                <CardBody className="p-0 overflow-auto">
                                {
                                teste.descriptionErro
                                ?
                                    <HTMLFormat>
                                    {`${teste.descriptionErro}`}
                                    </HTMLFormat>
                                :
                                    <table className="table" wrap="off">
                                    <tbody>
                                        <tr>
                                        <td><b>Entrada(s) para teste</b></td>
                                        <td><b>Saída do seu programa</b></td>
                                        <td><b>Saída esperada</b></td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <HTMLFormat>
                                            {teste.inputs}
                                            </HTMLFormat>
                                        </td>
                                        <td>  
                                            <HTMLFormat>
                                            {teste.saidaResposta}
                                            </HTMLFormat> 
                                        </td>
                                        <td>
                                            <HTMLFormat>
                                            {teste.output}
                                            </HTMLFormat> 
                                        </td>  
                                        </tr>
                                    </tbody>
                                    </table>
                                }
                                </CardBody>
                                </div>
                            </Card>
                            )}
                        </>
                    )  
                    }
                </Card>
           
            </Col>
        </Row>
    </>
    )
}

