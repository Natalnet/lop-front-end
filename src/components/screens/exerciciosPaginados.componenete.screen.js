import React from "react"
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import 'katex/dist/katex.min.css';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import Select from 'react-select';
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";

export default props =>{
    const {exercicios,fildFilter,loadingExercicios,contentInputSeach,numPageAtual,totalPages,showFilter,docsPerPage,tags,loadingTags,radioAsc,radioDesc,sortBy} = props
    const {handleShowfilter ,filterSeash,handleContentInputSeach ,handleSelectfildFilter ,handleSort,handleRadio ,handleDocsPerPage ,handleTagsChangeTags,handleShowModalInfo,handlePage} = props
    
    const arrDifficulty = [null,"Muito fácil","Fácil","Médio","Difícil","Muito Difícil"]
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
    const email = sessionStorage.getItem("user.email")
    return (
        <>
        <Card>
            <CardHead onClick={handleShowfilter} style={{cursor:"pointer"}}>
                <CardTitle center>
                    {showFilter?'Ocultar ':'Exibir '} filtro &nbsp;
                        <i 
                        className="fa fa-chevron-down"
                        style={{color:"#00f"}}
                    />
                </CardTitle>
            </CardHead>
            {showFilter
            ?
            <CardBody className="card-filter-exercicio" overflow="visible">
            <form onSubmit={(e)=>filterSeash(e)}>
                <div className="form-row">
                    <div className="form-group col-12 col-md-6 col-lg-7">
                        <label htmlFor="nome">{`${fildFilter==='title'?'Título da ':fildFilter==='code'?'Código':'...'} da questão`} </label>
                        <div className="input-group">
                            <input
                                id="nome"
                                type="text" 
                                className="form-control" 
                                placeholder={`Perquise pelo ${fildFilter==='title'?'Título':fildFilter==='code'?'Código':'...'} da questão`}
                                aria-label="Recipient's username" 
                                aria-describedby="button-addon2"
                                value={contentInputSeach}
                                onChange={(e) => handleContentInputSeach(e)}
                            />
                            <div className="selectgroup" >
                                <select style={{cursor:"pointer"}} defaultValue={fildFilter} onChange={(e)=>handleSelectfildFilter(e)} className="selectize-input items has-options full has-items form-control">
                                    <option value={'title'}>Título</option>
                                    <option value={'code'}>Código</option>
                                </select>     
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-12 col-md-6 col-lg-3">
                        <label htmlFor="ordem">Ordenar por:</label>
                        <div className="selectgroup" >
                            <select id={"ordem"} defaultValue={sortBy} className="form-control" onChange={(e)=> handleSort(e)} style={{cursor:"pointer"}}>
                                <option value={'createdAt'}>Data de criação</option>
                                <option value={'title'}>Ordem alfabética</option>
                                <option value={'difficulty'}>Dificuldade</option>
                                {/*<option value={'isCorrect'}>Resolvidas por mim</option>
                                <option value={'accessCount'}>N° de acessos</option>
                                <option value={'submissionsCount'}>N° de Submissões</option>
                                <option value={'submissionsCorrectsCount'}>N° de Submissões corretas</option>*/}
                            </select>
                            <label className="selectgroup-item">
                                <input type="radio" 
                                    value="DESC"
                                    checked={radioDesc}
                                    className="selectgroup-input"
                                    onChange={(e)=>handleRadio(e)}
                                />
                                <span className="selectgroup-button selectgroup-button-icon">
                                    <i className="fa fa-sort-amount-desc"/>
                                </span>
                            </label>
                            <label className="selectgroup-item">
                                <input type="radio" 
                                    value="ASC"
                                    checked={radioAsc}
                                    onChange={(e)=>handleRadio(e)}
                                    className="selectgroup-input"
                                />
                                <span className="selectgroup-button selectgroup-button-icon">
                                    <i className="fa fa-sort-amount-asc"/>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group  col-4 col-lg-2">
                        <label htmlFor="pag">N° de ítems por página:</label>
                        <select id="pag" defaultValue={docsPerPage} className="form-control" onChange={(e)=>handleDocsPerPage(e)}>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={40}>40</option>
                            <option value={60}>60</option>
                        </select>
                    </div>
                    <div className="form-group  col-12">
                        <label>Tags </label>
                        <Select
                            style={{boxShadow: "white"}}
                            placeholder="informe as tags"
                            options={tags || []}
                            isMulti
                            isLoading={loadingTags}
                            isClearable={false}
                            onChange={handleTagsChangeTags}
                        />
                    </div>
                    <div className="form-group  col-12">
                        <button type='submit' className={`btn btn-primary ${loadingExercicios && 'btn-loading'}`}>
                            Aplicar filtro <i className="fe fe-search" />
                        </button>
                        
                    </div>
                </div>
            </form>
            </CardBody>
                :null
            }
        </Card>
        <Row mb={15}>
            <Col xs={12}>
            <table className="table table-hover table-responsive">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Código</th>
                        
                        <th>N° de acessos</th>
                        <th>N° de Submissões corretas</th>
                        <th>N° de Submissões</th>
                        <th>Dificuldade</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loadingExercicios || loadingTags
                        ?
                            <tr>
                                <td>
                                    <div className="loader" />
                                </td>
                                <td>                                        
                                    <div className="loader" />
                                </td>
                                <td>
                                    <div className="loader"/>
                                </td>                                        
                                <td>
                                    <div className="loader"/>
                                </td>
                                <td>
                                    <div className="loader"/>
                                </td>
                                <td>
                                    <div className="loader"/>
                                </td>
                                <td>
                                    <div className="loader"/>
                                </td>

                            </tr>           
                        :
                            exercicios.map((exercicio, index) => (
                                <tr key={exercicio.id}>
                                    <td>
                                        {exercicio.isCorrect ? (
                                            <i
                                                className="fa fa-check"
                                                style={{ color: "#0f0" }}
                                            />  
                                        ) :exercicio.wasTried?(
                                            <i
                                                className="fa fa-remove"
                                                style={{ color: "#f00" }}
                                            />  
                                        ):<>&nbsp;</>}
                                    </td>
                                    <td> {exercicio.title}</td>
                                    <td>{exercicio.code}</td>
                                    <td>{exercicio.accessCount}</td>
                                    <td>{exercicio.submissionsCorrectsCount}</td>
                                    <td>{exercicio.submissionsCount}</td>
                                    <td>{arrDifficulty[parseInt(exercicio.difficulty)]}</td>
                                    
                                    <td className="d-inline-flex">
                                        {(profile==="aluno")?(
                                            <>
                                            <Link to={`/aluno/exercicio/${exercicio.id}`} >
                                                <button className="btn btn-success mr-2">
                                                    Acessar <i className="fa fa-wpexplorer" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-primary mr-2" onClick={()=>handleShowModalInfo(exercicio)}>
                                                <i className="fa fa-info"/>
                                            </button>
                                            </>
                                        )
                                        :
                                        (profile==="professor")?(
                                            <>
                                            <Link to={`/professor/exercicio/${exercicio.id}`} >
                                                <button className="btn btn-success mr-2">
                                                    Acessar <i className="fa fa-wpexplorer" />
                                                </button>
                                            </Link>
                                            <button className="btn btn-primary mr-2" onClick={()=>handleShowModalInfo(exercicio)}>
                                                    <i className="fa fa-info"/>
                                            </button>
                                            <Link to={`/professor/exercicios/${exercicio.id}/editar`}>
                                                <button className={`btn btn-info ${(email!==exercicio.author.email)?"d-none":""}`}>
                                                    <i className="fe fe-edit" />
                                                </button>
                                            </Link>
                                            </>
                                        )
                                        :
                                            null
                                        }
                                        
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Col>
        </Row>
        <Row>
            <Col xs={12} textCenter>
                <NavPagination
                    totalPages={totalPages}
                    pageAtual={numPageAtual}
                    handlePage={handlePage}
                />
            </Col>
        </Row>
    </>
    )
}
