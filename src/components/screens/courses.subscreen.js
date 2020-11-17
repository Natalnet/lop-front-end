import React from 'react';
import Row from "../ui/grid/row.component";
import Col from "../ui/grid/col.component";
import { Link } from "react-router-dom";

const CoursesSubScreenComponent = () => {
    return (
        <>
            <Row mb={15}>
                <Col xs={12}>
                    <h5 className='m-0'>Cursos</h5>
                </Col>
            </Row>
            <Row mb={15}>
                <Col xs={3}>
                    <Link to="/professor/criarCurso">
                        <button className="btn btn-primary w-100" type="button">
                            Criar Curso <i className="fe fe-file-plus" />
                        </button>
                    </Link>
                </Col>
                <Col xs={9}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder='Título ou código'
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={''}
                            onChange={(e) => null}
                        />
                        <button
                            className={`btn btn-secondary btn-outline-secondary `}
                            type="button"
                            id="button-addon2"
                            onClick={() => null}
                        >
                            <i className="fe fe-search" />
                        </button>
                        <button
                            className={`btn btn-secondary btn-outline-secondary ${undefined /*loading && 'btn-loading'*/}`}
                            type="button"
                            id="button-addon3"
                            onClick={() => null}
                        >
                            <i className="fe fe-refresh-cw" />
                        </button>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default CoursesSubScreenComponent;