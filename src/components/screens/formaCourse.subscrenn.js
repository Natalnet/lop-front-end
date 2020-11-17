import React from 'react';
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import { Link } from "react-router-dom";
import Card from "../ui/card/card.component";
import CardBody from "../ui/card/cardBody.component";
import { IoIosAddCircleOutline} from 'react-icons/io'
const FormCourseSunscreen = () => {
    return (
        <>
            <Row mb={15}>
                <Col xs={12}>
                    <h5 className='m-0'>
                        <Link to="/professor/cursos">Cursos</Link>
                        <i className="fa fa-angle-left ml-2 mr-2" />
                        Criar Curso
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <span className="alert-danger">{''}</span>
                </Col>
                <Col xs={12}>
                    <Card>
                        <CardBody>
                            <form>
                                <div className="form-row">
                                    <div className="form-group col-12">
                                        <label htmlFor="title">Título: </label>
                                        <input
                                            id="title"
                                            type="text"
                                            required
                                            className="form-control"
                                            placeholder="Título do curso"
                                            value={''}
                                            onChange={(e) => ''}
                                        />
                                    </div>
                                    <div className="form-group col-12">
                                        <label htmlFor="description">Descrição: </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            placeholder="Descrição do curso"
                                            rows="5"
                                            required
                                            value={''}
                                            onChange={(e) => ''}
                                        ></textarea>
                                    </div>
                                    <div className="form-group col-12">
                                        <button
                                            className='btn btn-success m-auto d-flex'
                                            type='button'
                                        >
                                            Adicionar aula <IoIosAddCircleOutline size={25} className='ml-1'/>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default FormCourseSunscreen;