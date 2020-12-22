import React from 'react';
import Card from "../card/card.component";
import Row from "../grid/row.component";
import Col from "../grid/col.component";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { MdExpandMore } from 'react-icons/md'
export default ({
    titleOrCodeInput, tagSelect, sortBySelect, descRadio, tagsSelect, loading, ascRadio, docsPerPage,
    handlleFilter, handleTitleOrCodeInput, handleTagSelect, handleSortRadio, handleDocsPerPage, handleSortBySelect
}) => {

    return (
        <Card>
            <Accordion>
                <AccordionSummary
                    expandIcon={<MdExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <h3 className='card-title m-auto'>Filtro</h3>
                </AccordionSummary>
                <AccordionDetails>
                    <Row mb={10}>
                        <Col xs={12} md={6} lg={7}>
                            <label htmlFor="nome">Título/Código do exercício </label>
                            <div className="input-group">
                                <input
                                    id="nome"
                                    type="text"
                                    disabled={loading}
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
                                <select id="ordem"
                                    defaultValue={sortBySelect}
                                    className="form-control"
                                    disabled={loading}
                                    onChange={handleSortBySelect}
                                    style={{ cursor: "pointer" }}
                                >
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                            <select id="pag"
                                defaultValue={docsPerPage}
                                className="form-control"
                                onChange={handleDocsPerPage}
                                disabled={loading}
                            >
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
                                disabled={loading}
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
                                className={`form-control btn btn-primary ${loading && 'btn-loading'}`}
                            >
                                Aplicar filtro <i className="fe fe-search" />
                            </button>
                        </Col>
                    </Row>
                </AccordionDetails>
            </Accordion>
        </Card>
    )
}

