import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useList = () => {

  const [list, setList] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const isValidList = useCallback(({ title, selectedQuestions }) => {
    let msg = "";
    msg += !title ? "Informe o título da lista<br/>;" : "";
    msg +=
      selectedQuestions.length === 0 ? "Escolha pelo menos um exercício<br/>;" : "";
    if (msg) {
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar lista",
        html: msg,
      });
      return false;
    }
    return true;
  }, []);

  const getList = useCallback(async (id, queryParams) => {
    setIsLoadingList(true);
    try {
      const response = await api.get(`/listQuestion/${id}`, {
        params: queryParams
      });
      if(queryParams.idUser){
        setList(response.data.list);
      }
      else{
        setList(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
    setIsLoadingList(false);
  }, []);

  const createList = useCallback(async ({ title, selectedQuestions }) => {
    if (!isValidList({ title, selectedQuestions })) {
      return;
    }

    const requestInfo = {
      title,
      questions: selectedQuestions.map((q) => q.id),
    };
    try {
      Swal.fire({
        title: "Criando lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.post("/listQuestion/store", requestInfo);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista criada com sucesso!",
      });
      return true;
      //history.push("/professor/listas");
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel criar lista",
      });
      //this.setState({ msg: "Erro: Não foi possivel Criar a lista" });
      return false;

    }
  }, [isValidList]);

  const addSubmissionDeadline = useCallback(async (idList, idClass, submissionDeadline) => {
    const request = {
      submissionDeadline,
      idClass
    };
    try {
      Swal.showLoading();
      await api.put(`/classHasListQuestion/${idList}/update`, request);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Data limite para submissões adicionada com sucesso!",
      });
      return true;
    } catch (err) {
      console.log(err);
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "ops... data limite não pôde ser adicionada",
      });
      return false;
    }

  }, []);

  const updateList = useCallback(async (id, { title, selectedQuestions }) => {
    if (!isValidList({ title, selectedQuestions })) {
      return;
    }
    const requestInfo = {
      title,
      questions: selectedQuestions.map((q) => q.id),
    };
    try {
      Swal.fire({
        title: "Editando lista",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/listQuestion/${id}/update`, requestInfo);
      Swal.hideLoading();
      Swal.fire({
        type: "success",
        title: "Lista editada com sucesso!",
      });
      return true;
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        type: "error",
        title: "Erro: Não foi possivel salvar lista",
      });
      return false;
    }
  }, [isValidList]);

  return { createList, updateList, getList, addSubmissionDeadline, list, isLoadingList };
}

export default useList;