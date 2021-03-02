import React, { useCallback, useState, useEffect, useMemo } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import katex from 'katex';
import { Col, Row } from '../ui/grid';
import { Card, CardBody } from '../ui/card';
import { Load } from '../ui/load';
import 'katex/dist/katex.min.css';
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import useDiscursiveQuestion from '../../hooks/useDiscursiveQuestion';
import useTag from '../../hooks/useTag';
import Select from "react-select";

const FormDiscursiveQuestionSubscreen = props => {
  const history = useHistory();
  const { 
    infoDiscursiveQuestion, 
    isLoadingInfoDiscursiveQuestion,
    createDiscursiveQuestion, 
    getInfoDiscursiveQuestion,
    updateDiscursiveQuestion
  } = useDiscursiveQuestion();
  const { isLoadingTags, tags, getTags } = useTag();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('1');
  const [status, setStatus] = useState('PÚBLICA');
  const [selectedTags, setSelectedTags] = useState([]);

  const tagsOptions = useMemo(() => tags.map(tag => ({
    value: tag.id,
    label: tag.name
  })), [tags]);

  useEffect(() => {
    const { idDiscursiveQuestion } = props.match.params;
    getTags();
    if (idDiscursiveQuestion) {
      getInfoDiscursiveQuestion(idDiscursiveQuestion);
    }
  }, [])

  useEffect(() => {
    if (infoDiscursiveQuestion) {
      setTitle(infoDiscursiveQuestion.title);
      setDescription(infoDiscursiveQuestion.description);
      setDifficulty(infoDiscursiveQuestion.difficulty);
      setStatus(infoDiscursiveQuestion.status);
      setSelectedTags(infoDiscursiveQuestion.tags.map(tag => ({
        value: tag.id,
        label: tag.name
      })));
    }
  }, [infoDiscursiveQuestion])

  const handleImageUploadBefore = useCallback(() => {
    Swal.fire({
      icon: "error",
      title: "Não é permitido o upload de imagens, carregue-as a partir de um link 😃",
    });
    return false;
  }, [])

  const handleVideoUploadBefore = useCallback(() => {
    Swal.fire({
      icon: "error",
      title: "Não é permitido o upload de vídeos, carregue-os a partir de um link 😃",
    });
    return false;
  }, [])

  const handlesaveSubmitQuestion = useCallback(async e => {
    e.preventDefault();
    const isCreated = await createDiscursiveQuestion({
      title,
      description,
      difficulty,
      status,
      tags: selectedTags.map((tag) => tag.value)
    });
    isCreated && history.push('/professor/exercicios', {
      tab: 2
    })
  }, [title, description, difficulty, status, selectedTags]);

  const handleUpdateSubmitQuestion = useCallback(async e => {
    e.preventDefault();
    const { idDiscursiveQuestion } = props.match.params;
    const isUpdated = await updateDiscursiveQuestion(idDiscursiveQuestion, {
      title,
      description,
      difficulty,
      status,
      tags: selectedTags.map((tag) => tag.value)
    });
    isUpdated && history.push('/professor/exercicios', {
      tab: 2
    })
  }, [title, description, difficulty, status, selectedTags]);

  if (isLoadingTags) {
    return <Load />
  }
  if(props.match.params.idDiscursiveQuestion){
    if(!infoDiscursiveQuestion || isLoadingInfoDiscursiveQuestion){
      return <Load />
    }
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
                {
                  props.match.params.idDiscursiveQuestion?
                    <>
                      {infoDiscursiveQuestion.title}
                    </>
                  :
                    'Criar exercício discursivo'
                }
            
          </h5>
            </Col>
          </Row>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            props.match.params.idDiscursiveQuestion?
              handleUpdateSubmitQuestion(e)
            :
              handlesaveSubmitQuestion(e)
            }}>
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

export default FormDiscursiveQuestionSubscreen;