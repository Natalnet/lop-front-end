import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom'
import api from '../services/api';
import Swal from "sweetalert2";

const useTest = () => {
  const profile = useMemo(() => sessionStorage.getItem("user.profile") && sessionStorage.getItem("user.profile").toLowerCase(), []);
  const history = useHistory();
  const [test, setTest] = useState(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const [countTests, setCountTests] = useState(sessionStorage.getItem('countTests') || 0);


  const isValidTest = useCallback(({ title, selectedQuestions }) => {
    let msg = "";
    msg += !title ? "Informe o título da prova<br/>;" : "";
    msg +=
      selectedQuestions.length === 0 ? "Escolha pelo menos um exercício<br/>;" : "";
    if (msg) {
      Swal.fire({
        icon: "error",
        title: "Erro: Não foi possivel salvar prova",
        html: msg,
      });
      return false;
    }
    return true;
  }, []);

  const getTest = useCallback(async (id, queryParams) => {
    setIsLoadingTest(true);
    try {
      const response = await api.get(`/test/${id}`, {
        params: queryParams
      });
      if(profile === "aluno"){
        if(response.data.classHasTest.status === "FECHADA"){
          history.push(`/aluno/turma/${queryParams && queryParams.idClass}/provas`);
        }
        try{
          const password = sessionStorage.getItem(
            `passwordTest-${response.data.id}`
          );
          console.log('chammoouuuu')
          await api.get('/test/check/password',{
            params: {
              idTest: id,
              password
            }
          });
        }
        catch(err){
          history.push(`/aluno/turma/${queryParams && queryParams.idClass}/provas`);
        }
      }

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
  }, [profile, history]);

  const getCountTests = useCallback(async ()=>{
    setIsLoadingTest(true);
    try{    
        const response = await api.get('/test/count');
        setCountTests(response.data.countTests);
        sessionStorage.setItem('countTests', response.data.countTests);
    }
    catch(err){
        console.error(err)
    }
    setIsLoadingTest(false);
},[]);

  const createTest = useCallback(async ({ title, selectedQuestions }) => {
    if (!isValidTest({ title, selectedQuestions })) {
      return;
    }

    const requestInfo = {
      title,
      questions: selectedQuestions.map((q) => q.id),
    };
    try {
      Swal.fire({
        title: "Criando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.post("/test/store", requestInfo);
      Swal.hideLoading();
      Swal.fire({
        icon: "success",
        title: "Prova criada com sucesso!",
      });
      return true;
      //history.push("/professor/provas");
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        icon: "error",
        title: "Erro: Não foi possivel criar prova",
      });
      return false;

    }
  }, [isValidTest]);

  const updateTest = useCallback(async (id, { title, selectedQuestions }) => {
    if (!isValidTest({ title, selectedQuestions })) {
      return;
    }
    const requestInfo = {
      title,
      questions: selectedQuestions.map((q) => q.id),
    };
    try {
      Swal.fire({
        title: "Editando prova",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();
      await api.put(`/test/${id}/update`, requestInfo);
      Swal.hideLoading();
      Swal.fire({
        icon: "success",
        title: "Testa editada com sucesso!",
      });
      return true;
    } catch (err) {
      Swal.hideLoading();
      Swal.fire({
        icon: "error",
        title: "Erro: Não foi possivel salvar prova",
      });
      return false;
    }
  }, [isValidTest]);

  return { 
    createTest, 
    updateTest, 
    getTest, 
    getCountTests,
    test, 
    isLoadingTest,
    countTests
  };
}

export default useTest;