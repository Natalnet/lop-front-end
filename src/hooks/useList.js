import { useCallback } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useList = () => {
    const createList = useCallback(async ({ title, selectedQuestions }) => {
        let msg = "";
        msg += !title ? "Informe o título da turma<br/>" : "";
        msg +=
            selectedQuestions.length === 0 ? "Escolha pelo menos um exercício<br/>" : "";
        if (msg) {
            Swal.fire({
                type: "error",
                title: "Erro: Não foi possivel criar lista",
                html: msg,
            });
            return false;
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
    }, [])

    const updateList = useCallback( async (id, { title, selectedQuestions })=>{
     
        let msg = "";
        msg += !title ? "Informe o título da turma<br/>" : "";
        msg +=
        selectedQuestions.length === 0 ? "Escolha pelo menos um exercício<br/>" : "";
        if (msg) {
          Swal.fire({
            type: "error",
            title: "Erro: Não foi possivel salvar lista",
            html: msg,
          });
          return false;
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
    })

    return {createList, updateList};
}

export default useList;