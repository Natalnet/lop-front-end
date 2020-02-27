import React from "react"
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";
import Table from 'components/ui/tables/tableType1.component'
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import profileImg from "assets/perfil.png"

export default props =>{
    const {participantes,loadingParticipantes,numPageAtual,totalPages} = props
    const {handlePage,removerParticipante} = props
    const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase()
    return (
    <>
    <Row mb={15}>
        <Col xs={12}>
            <Table>
            <thead> 
                <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Matrícula</th>
                    <th>Função</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {loadingParticipantes
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

                    </tr>           
                :
                    participantes.map((user, index) => (
                        <tr key={index}>
                            <td className='text-center'>
                                <div 
                                    className="avatar d-block" 
                                    style={{
                                        backgroundImage: `url(${user.urlImage || profileImg})`                    
                                    }}
                                />
                            </td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.enrollment}</td>
                            <td>{user.profile}</td>
                            <td>
                                {(profile==="professor") && (user.profile!=="PROFESSOR") && (
                                    <>
                                    <Link to={`/professor/turma/${props.match.params.id}/participantes/${user.id}/listas`}>
                                    <button className="btn btn-primary mr-2">
                                        <i className="fa fa-info"/>
                                    </button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={()=>removerParticipante(user)}>
                                        <i className="fa fa-trash "/>
                                    </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
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