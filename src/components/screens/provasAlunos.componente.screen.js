import React from "react";
import { Link } from "react-router-dom";
import NavPagination from "components/ui/navs/navPagination";
import Table from "components/ui/tables/tableType1.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import profileImg from "assets/perfil.png";

export default (props) => {
  const {
    idTurma,
    presentes,
    loadingPresentes,
    numPageAtual,
    totalPages,
    idProva,
    numQuestions,
  } = props;
  const { handlePage } = props;
  //const profile = sessionStorage.getItem("user.profile").toLocaleLowerCase();
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
                <th>Questões</th>
                <th>Nota Do sistema</th>
                <th>Nota do Professor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loadingPresentes ? (
                <tr>
                  <td>
                    <div className="loader" />
                  </td>
                  <td>
                    <div className="loader" />
                  </td>
                  <td>
                    <div className="loader" />
                  </td>
                  <td>
                    <div className="loader" />
                  </td>
                  <td>
                    <div className="loader" />
                  </td>
                </tr>
              ) : (
                presentes.map((user, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      <div
                        className="avatar d-block"
                        style={{
                          backgroundImage: `url(${
                            user.urlImage || profileImg
                          })`,
                        }}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.enrollment}</td>
                    <td>{user.triedQuestions + "/" + numQuestions}</td>
                    <td>{(user.scoreSystem / 10).toFixed(2)}</td>
                    <td>{user.scoreTeacher!==null?(user.scoreTeacher / 10).toFixed(2):""}</td>
                    <td>
                      <Link
                        to={`/professor/turma/${idTurma}/prova/${idProva}/aluno/${
                          user.id
                        }/page:${1}`}
                      >
                        <button className="btn btn-primary mr-2">
                          Corrigir
                          <i className={"fe fe-file-text"} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
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
  );
};
