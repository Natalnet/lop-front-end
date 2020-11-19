import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useCourse = () => {

    const [paginedCourses, setPaginedCourse] = useState(null);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    const getCourses = useCallback(async (page=1)=>{
        setIsLoadingCourses(true);
        try{
            const response = await api.get(`/course/page/${page}`)
            console.log(response.data);
            setPaginedCourse(response.data);
        }
        catch(err){

        }
        setIsLoadingCourses(false);
    }, []);

    const createCourse = useCallback(async ({title, description})=>{
        const request = {
            title, 
            description
        }
        Swal.fire({
            title: "Criando curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
          Swal.showLoading();
        try{
            await api.post('/course', request);
            Swal.hideLoading();
            Swal.fire({
              type: "success",
              title: "Curso criado com sucesso!",
            });
            return true;
        }
        catch(err){
            Swal.fire({
                type: "error",
                title: "ops... Curso não pôde ser criado",
              });
            return false;
        }
    })

    const updateCourse = useCallback(async (id, {title, description})=>{
        const request = {
            title, 
            description
        }
        Swal.fire({
            title: "Editando curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
          });
          Swal.showLoading();
        try{
            await api.put(`/course/${id}`, request);
            Swal.hideLoading();
            Swal.fire({
              type: "success",
              title: "Curso editado com sucesso!",
            });
            return true;
        }
        catch(err){
            Swal.fire({
                type: "error",
                title: "ops... Curso não pôde ser editado",
              });
            return false;
        }
    })

    return {paginedCourses, isLoadingCourses, createCourse, updateCourse, getCourses};
}

export default useCourse;