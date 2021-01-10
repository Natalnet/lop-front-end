import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useTest = () => {

  const [test, setTest] = useState(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);

  // const isValidTest = useCallback(({ title, selectedQuestions }) => {
  //   let msg = "";
  //   msg += !title ? "Informe o título da prova<br/>;" : "";
  //   msg +=
  //     selectedQuestions.length === 0 ? "Escolha pelo menos um exercício<br/>;" : "";
  //   if (msg) {
  //     Swal.fire({
  //       type: "error",
  //       title: "Erro: Não foi possivel salvar prova",
  //       html: msg,
  //     });
  //     return false;
  //   }
  //   return true;
  // }, []);

  const getTest = useCallback(async (id, queryParams) => {
    setIsLoadingTest(true);
    try {
      const response = await api.get(`/test/${id}`, {
        params: queryParams
      });
      if(queryParams.idUser){
        setTest(response.data.test);
      }
      else{
        setTest(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
    setIsLoadingTest(false);
  }, []);

  // const createTest = useCallback(async ({ title, selectedQuestions }) => {
  //   if (!isValidTest({ title, selectedQuestions })) {
  //     return;
  //   }

  //   const requestInfo = {
  //     title,
  //     questions: selectedQuestions.map((q) => q.id),
  //   };
  //   try {
  //     Swal.fire({
  //       title: "Criando prova",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       allowEnterKey: false,
  //     });
  //     Swal.showLoading();
  //     await api.post("/test/store", requestInfo);
  //     Swal.hideLoading();
  //     Swal.fire({
  //       type: "success",
  //       title: "Testa criada com sucesso!",
  //     });
  //     return true;
  //     //history.push("/professor/provas");
  //   } catch (err) {
  //     Swal.hideLoading();
  //     Swal.fire({
  //       type: "error",
  //       title: "Erro: Não foi possivel criar prova",
  //     });
  //     //this.setState({ msg: "Erro: Não foi possivel Criar a prova" });
  //     return false;

  //   }
  // }, [isValidTest]);

  // const updateTest = useCallback(async (id, { title, selectedQuestions }) => {
  //   if (!isValidTest({ title, selectedQuestions })) {
  //     return;
  //   }
  //   const requestInfo = {
  //     title,
  //     questions: selectedQuestions.map((q) => q.id),
  //   };
  //   try {
  //     Swal.fire({
  //       title: "Editando prova",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       allowEnterKey: false,
  //     });
  //     Swal.showLoading();
  //     await api.put(`/test/${id}/update`, requestInfo);
  //     Swal.hideLoading();
  //     Swal.fire({
  //       type: "success",
  //       title: "Testa editada com sucesso!",
  //     });
  //     return true;
  //   } catch (err) {
  //     Swal.hideLoading();
  //     Swal.fire({
  //       type: "error",
  //       title: "Erro: Não foi possivel salvar prova",
  //     });
  //     return false;
  //   }
  // }, [isValidTest]);

  return { /*createTest, updateTest,*/ getTest,/* addSubmissionDeadline,*/ test, isLoadingTest };
}

export default useTest;