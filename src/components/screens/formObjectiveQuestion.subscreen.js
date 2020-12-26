import React, { useCallback, useState, useEffect, useMemo } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex'
import { Col, Row } from '../ui/grid';
import { Card, CardBody } from '../ui/card';
import { Load } from '../ui/load'
import Radio from '@material-ui/core/Radio';
import 'katex/dist/katex.min.css'
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useObjectiveQuestion from '../../hooks/useObjectveQuestion';
import useTag from '../../hooks/useTag';
import Select from "react-select";

const FormObjectiveQuestionSubscreen = () => {
  const history = useHistory();
  const { createObjectveQuestion } = useObjectiveQuestion();
  const { isLoadingTags, tags, getTags } = useTag();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [status, setStatus] = useState('PÚBLICA');
  const [selectedTags, setSelectedTags] = useState([]);
  const [alternatives, setAlternatives] = useState([{
    description: '',
    isCorrect: false
  }]);

  const tagsOptions = useMemo(() => tags.map(tag => ({
    value: tag.id,
    label: tag.name
  })), [tags]);

  useEffect(() => {
    getTags();
  }, [])

  const handleImageUploadBefore = useCallback(() => {
    Swal.fire({
      type: "error",
      title: "Não é permitido o upload de imagens, carregue-as a partir de um link 😃",
    });
    return false;
  }, [])

  const handleVideoUploadBefore = useCallback(() => {
    Swal.fire({
      type: "error",
      title: "Não é permitido o upload de vídeos, carregue-os a partir de um link 😃",
    });
    return false;
  }, [])

  const handlesaveSubmitQuestion = useCallback(async e => {
    e.preventDefault();
    const isCreated = await createObjectveQuestion({
      title,
      description,
      difficulty,
      alternatives,
      status,
      tags: selectedTags.map((tag) => tag.value)
    });
    isCreated && history.push('/professor/exercicios', {
      tab: 1
    })
  }, [title, description, difficulty, alternatives, status, selectedTags]);

  const handleChangeContentEditor = useCallback((content, i) => {
    setAlternatives(oldAlternatives => {
      const tmpAlternatives = [...oldAlternatives];
      tmpAlternatives[i].description = content;
      return tmpAlternatives;
    });

  }, []);

  useEffect(() => {
    console.log(alternatives)
  }, [alternatives]);

  const handleChangeRadioAlternative = useCallback((e) => {
    setAlternatives(oldAlternatives => {
      const tmpAlternatives = [...oldAlternatives];
      tmpAlternatives.forEach((tmpAlternative, i) => {
        tmpAlternative.isCorrect = i === Number(e.target.value);
      })
      return tmpAlternatives;
    })
  }, []);

  const addAlternative = useCallback(() => {
    setAlternatives(oldAlternatives => [...oldAlternatives, {
      description: '',
      isCorrect: false
    }]);
  }, []);

  const removeAlternative = useCallback(() => {
    setAlternatives(oldAlternatives => {
      if (oldAlternatives.length > 1) {
        const tmpAlternatives = [...oldAlternatives];
        tmpAlternatives.pop();
        return tmpAlternatives;
      }
    })
  }, []);

  if (isLoadingTags) {
    return <Load />
  }

  return (
    <>
      <Card>
        <CardBody>
          <Row className='mb-4'>
            <Col className='col-12'>
              <h5 className='m-0'>
                <Link to="/professor/exercicios">Exercícios</Link>
                <i className="fa fa-angle-left ml-2 mr-2" />
            Criar exercício de múltipla escolha
          </h5>
            </Col>
          </Row>
          <form onSubmit={(e) => { e.preventDefault(); handlesaveSubmitQuestion(e); }}>
            <Row className='mb-4'>
              <Col className="col-12">
                <label>Título: </label>
                <input
                  type="text"
                  onChange={e => setTitle(e.target.value)}
                  className={`form-control`}
                  placeholder="Título"
                  value={title}
                  required
                />
              </Col>
            </Row>
            <Row className='mb-4'>
              <Col className="col-12">
                <label>Enunciado: </label>
                <SunEditor
                  lang="pt_br"
                  height='auto'
                  minHeight="800px"
                  onChange={content => setDescription(content)}
                  setContents={description}
                  onImageUploadBefore={handleImageUploadBefore}
                  onVideoUploadBefore={handleVideoUploadBefore}
                  setDefaultStyle="font-size: 15px; text-align: justify"
                  setOptions={{
                    toolbarContainer: '#toolbar_container',
                    // resizingBar : false,
                    //charCounter : true,
                    //maxCharCount : 720,
                    katex: katex,
                    buttonList: [
                      ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat', 'textStyle', 'paragraphStyle'],
                      ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table', 'codeView', 'math'],
                      ['link', 'image', 'video', 'audio', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save']
                    ],
                  }}
                />
              </Col>
            </Row>

            <Row className='mb-4'>
              <Col className="col-3">
                <label htmlFor="selectDifficulty">Dificuldade: </label>
                <select
                  className="form-control"
                  defaultValue={difficulty}
                  id="selectDifficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="1">Muito fácil</option>
                  <option value="2">Fácil</option>
                  <option value="3">Médio</option>
                  <option value="4">Difícil</option>
                  <option value="5">Muito difícil</option>
                </select>
              </Col>
              <Col className="col-3">
                <label htmlFor="selectStatus">Status do exercício: </label>
                <select
                  className="form-control"
                  defaultValue={status}
                  id="selectStatus"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PÚBLICA">
                    Pública (para uso em listas)
                    </option>
                  <option value="PRIVADA">Oculta (para uso em provas)</option>
                </select>
              </Col>
            </Row>
            <Row className='mb-4'>
              <Col className="col-12">
                <label>Tags: </label>
                <Select
                  style={{ boxShadow: "white" }}
                  defaultValue={selectedTags}
                  options={tagsOptions || []}
                  isMulti
                  isLoading={isLoadingTags}
                  closeMenuOnSelect={true}
                  onChange={newTagsOptions => setSelectedTags(newTagsOptions || [])}
                />
              </Col>
            </Row>
            <hr />
            <label className='mr-2'>Alternativas: </label>
            <button
              onClick={addAlternative}
              type="button"
              className="btn btn-primary btn-sm mr-2"
            >
              <i className="fe fe-plus" />
            </button>
            <button
              disabled={alternatives.length <= 1}
              onClick={removeAlternative}
              type="button"
              className="btn btn-sm btn-danger"
            >
              <i className="fe fe-minus" />
            </button>
            <table className="table ">
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                </tr>

                {alternatives.map((alternative, i) => (
                  <tr key={i} className=''>
                    <td className='h-100 w-100 d-flex justify-content-center align-items-center mb-2 table-info'
                    // style={{ border: "1px solid #467fcf" }}
                    >
                      <Row>
                        <Col className="col-11">
                          <div
                            className='h-100 w-100 d-flex justify-content-center align-items-center'
                          >
                            <span className='h-100 align-items-top mr-2'>
                              {`${String.fromCharCode(65+i)})`}
                            </span> 
                            <SunEditor
                              lang="pt_br"
                              height='auto'
                              minHeight="800px"
                              class='olaola'
                              onChange={(content) => handleChangeContentEditor(content, i)}
                              setContents={alternative.description}
                              onImageUploadBefore={handleImageUploadBefore}
                              onVideoUploadBefore={handleVideoUploadBefore}
                              setDefaultStyle="font-size: 15px; text-align: justify;"
                              setOptions={{
                                toolbarContainer: '#toolbar_container',
                                resizingBar: true,
                                //charCounter : true,
                                //maxCharCount : 720,
                                katex: katex,
                                buttonList: [
                                  ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat', 'textStyle', 'paragraphStyle'],
                                  ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table', 'codeView', 'math'],
                                  ['link', 'image', 'video', 'audio', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save']
                                ],
                              }}
                            />
                          </div>
                        </Col>
                        <Col className="col-1">
                          <div
                            className='h-100 w-100 d-flex justify-content-center align-items-center'
                          >
                            <Radio
                              value={i}
                              checked={alternative.isCorrect}
                              onChange={handleChangeRadioAlternative}
                              inputProps={{ 'aria-label': i }}
                              color="primary"
                            />
                          </div>
                        </Col>
                      </Row>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Row>
              <Col className='col-12'>
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg btn-block ${'' && "btn-loading"}`}
                >
                  <i className="fa fa-save"></i> Salvar
              </button>
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default FormObjectiveQuestionSubscreen;