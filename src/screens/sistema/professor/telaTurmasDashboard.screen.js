import React, { useEffect, useMemo, useState, useCallback } from "react";
import TemplateSistema from "../../../components/templates/sistema.template";
// import api from "../../../services/api";
import { Row, Col } from '../../../components/ui/grid';
import { Load } from '../../../components/ui/load';
import useClass from "src/hooks/useClass";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import { Tab } from '../../../components/ui/tabs/Tab';
import TabPanel from '../../../components/ui/tabs/TabPanel';
import useDataScience from "src/hooks/useDataScience";
import { ButtonMaterial } from "../../../components/ui/buttons/buttonMaterial";
import VerticalBar from "../../../components/ui/charts/verticalBar";

const DashBoardClass = (props) => {

  const { classRoon, isLoadingClass, getClass } = useClass();
  const {
    csvListStudents,
    isLoadingCsvListStudents,
    getCsvListStudents,
    handleSetcsvListStudents
  } = useDataScience();

  const [tabIndex, setTabIndex] = useState(0);

  const idClass = useMemo(() => props.match.params.idClass, [props]);

  useEffect(() => {
    getClass(idClass);
    getCsvListStudents(idClass)
  }, [])

  const tableHeaders = useMemo(() => {
    if (csvListStudents.length > 0) {
      return [...csvListStudents[0].lists].map(({ id, title }) => ({
        id,
        title
      }))
    }
    return [];
  }, [csvListStudents]);

  const handleTabeIndex = useCallback((e, newValue) => {
    const oldTabindex = tabIndex;
    setTabIndex(newValue);
    switch (newValue) {
      case 0:
        if (tabIndex === oldTabindex) {
          break;
        }
        getCsvListStudents(idClass);
        break;
      default:
        break;
    }
  }, [tabIndex, getCsvListStudents]);

  const getPercentageFormat = useCallback((numerator, denominator) => {
    return Number(((numerator / denominator) * 100).toFixed(2))
  }, []);

  const sortCsvListStudents = useCallback((indexList) => {
    let csvListStudentsTmp = [...csvListStudents];
    csvListStudentsTmp = csvListStudentsTmp.sort((studant1, studant2) => {
      const list1 = studant1.lists[indexList]
      const list2 = studant2.lists[indexList]
      const percentage1 = list1.score;
      const percentage2 = list2.score;
      return percentage1 > percentage2 ? -1 : 1;
    })
    handleSetcsvListStudents(csvListStudentsTmp);
  }, [csvListStudents, getPercentageFormat, handleSetcsvListStudents]);

  const color = useCallback((percentage) => {
    if (percentage === 100) {
      return "text-success font-weight-bold";
    } else {
      return "";
    }
  }, []);

  return (
    <TemplateSistema
      {...props}
      active={"dashboard"}
      submenu={"telaTurmas"}
    >
      {
        isLoadingClass || !classRoon ?
          <Load />
          :
          <>
            <Row className='mb-4'>
              <Col className='col-12'>
                <h5 className='m-0' >
                  <i className="fa fa-users mr-2" aria-hidden="true" />
                  {classRoon.name} - {classRoon.year}.{classRoon.semester}
                  <i className="fa fa-angle-left ml-2 mr-2" /> Dashboard
            </h5>
              </Col>
            </Row>
            <Paper>
              <Tabs
                value={tabIndex}
                onChange={handleTabeIndex}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab
                  label='Listas'
                  // icon={<BiCodeAlt />}
                  id='scrollable-force-tab-0'
                  aria-controls='scrollable-force-tabpanel-0'
                />
                {/* <Tab
                  label='Gráficos'
                  // icon={<BiCodeAlt />}
                  id='scrollable-force-tab-1'
                  aria-controls='scrollable-force-tabpanel-1'
                /> */}
              </Tabs>
            </Paper>
            <TabPanel value={tabIndex} index={0}>
              <Row>
                <Col className='col-12'>
                  {
                    isLoadingCsvListStudents ?
                      <Load />
                      :
                      <table className={'table table-hover table-responsive'}>
                        <thead>
                          <tr>
                            <th></th>
                            {
                              tableHeaders.map((tableHeader, i) => (
                                <th
                                  key={tableHeader.id}
                                  style={{
                                    paddingLeft: 0
                                  }}

                                >
                                  <ButtonMaterial
                                    style={{
                                      paddingLeft: '0.75rem',
                                    }}
                                    onClick={() => sortCsvListStudents(i)}
                                  >
                                    <p
                                      className='m-0 text-left'
                                      style={{
                                        fontSize: 12,
                                        textTransform: 'lowercase'
                                      }}
                                    >
                                      {tableHeader.title}
                                    </p>
                                  </ButtonMaterial>
                                </th>
                              ))
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {
                            csvListStudents.map((studant) => (
                              <tr key={studant.id}>
                                <td>{studant.name}</td>
                                {
                                  studant.lists.map((list) => (
                                    <td key={list.id}>
                                      <p className={`${color(list.score)}`}>
                                        {list.score}%
                                        </p>
                                    </td>

                                  ))
                                }
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                  }
                </Col>
              </Row>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <VerticalBar />
            </ TabPanel>
          </>
      }
    </TemplateSistema>
  );
}


export default DashBoardClass;
