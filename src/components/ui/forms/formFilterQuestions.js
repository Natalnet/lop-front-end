import React, { useState } from 'react';
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";

export default ({
    titleOrCodeInput, tagSelect,  sortBySelect, descRadio, tagsSelect, loading, ascRadio, docsPerPage,
    handlleFilter, handleTitleOrCodeInput, handleTagSelect, handleSortRadio, handleDocsPerPage,handleSortBySelect
}) => {

    const [showFilter, setShowFilter] = useState(true);

    return (
        <Card>
            <CardHead
                onClick={() => setShowFilter(oldShowfilter => !oldShowfilter)}
                style={{ cursor: "pointer" }}>
                <CardTitle center>
                    {showFilter ? 'Ocultar ' : 'Exibir '} filtro &nbsp;
                    <i
                        className="fa fa-chevron-down"
                        style={{ color: "#00f" }}
                    />
                </CardTitle>
            </CardHead>
            {showFilter
                ?
                <CardBody className="card-filter-exercicio" overflow="visible">
                    {/* <form onSubmit={handlleFilter} onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}> */}
                        <Row mb={10}>
                            <Col xs={12} md={6} lg={7}>
                                <label htmlFor="nome">Título/Código do exercício </label>
                                <div className="input-group">
                                    <input
                                        id="nome"
                                        type="text"
                                        className="form-control"
                                        placeholder={'Perquise pelo Título/Código do exercício'}
                                        aria-label="Recipient's username"
                                        aria-describedby="button-addon2"
                                        value={titleOrCodeInput}
                                        onChange={handleTitleOrCodeInput}
                                    />
                                    {/* <div className="selectgroup" >
                                        <select style={{ cursor: "pointer" }} defaultValue={fieldSelect} onChange={handleFieldSelect} className="selectize-input items has-options full has-items form-control">
                                            <option value={'title'}>Título</option>
                                            <option value={'code'}>Código</option>
                                        </select>
                                    </div> */}
                                </div>
                            </Col>

                            <Col xs={12} md={6} lg={3}>
                                <label htmlFor="ordem">Ordenar por:</label>
                                <div className="selectgroup" style={{ display: 'flex', width: '100%' }}>
                                    <select id="ordem" defaultValue={sortBySelect} className="form-control" onChange={handleSortBySelect} style={{ cursor: "pointer" }}>
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
                                            checked={descRadio}
                                            className="selectgroup-input"
                                            onChange={handleSortRadio}
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-sort-amount-desc" />
                                        </span>
                                    </label>
                                    <label className="selectgroup-item">
                                        <input type="radio"
                                            value="ASC"
                                            checked={ascRadio}
                                            onChange={handleSortRadio}
                                            className="selectgroup-input"
                                        />
                                        <span className="selectgroup-button selectgroup-button-icon">
                                            <i className="fa fa-sort-amount-asc" />
                                        </span>
                                    </label>
                                </div>
                            </Col>

                            <Col xs={6} lg={2}>
                                <label htmlFor="pag">N° de itens por página:</label>
                                <select id="pag" defaultValue={docsPerPage} className="form-control" onChange={handleDocsPerPage}>
                                    <option value={15}>15</option>
                                    <option value={25}>25</option>
                                    <option value={40}>40</option>
                                    <option value={60}>60</option>
                                </select>
                            </Col>

                            <Col xs={6} lg={3}>
                                <label>Tag: </label>
                                <select
                                    onChange={handleTagSelect}
                                    className="form-control"
                                    defaultValue={tagSelect}
                                >
                                    {tagsSelect.map(tag => (
                                        <option
                                            key={tag.id}
                                            value={tag.id}
                                        >
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                                {/* <Select
                                    style={{boxShadow: "white"}}
                                    defaultValue={tagSelecionada}
                                    placeholder="informe as tags"
                                    options={tags || []}
                                    isMulti
                                    isLoading={loadingTags}
                                    isClearable={false}
                                    onChange={handleTagsChangeTags}
                                /> */}
                            </Col>

                            <Col xs={4}>
                                <label htmlFor="app">&nbsp;</label>
                                <button 
                                    type='button'
                                    onClick={handlleFilter} 
                                    className={`form-control btn btn-primary ${loading && 'btn-loading'}`}>
                                    Aplicar filtro <i className="fe fe-search" />
                                </button>
                            </Col>
                        </Row>
                    {/* </form> */}
                </CardBody>
                : null
            }
        </Card>
    )
}

