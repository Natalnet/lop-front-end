import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";

const useCourse = () => {

    const [paginedCourses, setPaginedCourse] = useState(null);
    const [course, setCourse] = useState(null);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [paginedCourseToAddInClass, setPaginedCourseToAddInClass] = useState(false);
    const [isLoadingCourse, setIsLoadingCourse] = useState(false);
    const [isLoadingCoursesToAddInClass, setIsLoadingCoursesToAddInClass] = useState(false);

    const getCourse = useCallback(async (id) => {
        try {
            setIsLoadingCourse(true);
            const response = await api.get(`/course/${id}`)
            setCourse(response.data)
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar curso",
            });
        }
        setIsLoadingCourse(false);
    }, [])

    const getCourses = useCallback(async (page = 1, queryParams) => {
        setIsLoadingCourses(true);
        try {
            const response = await api.get(`/course/page/${page}`, {
                params: queryParams
            })
            setPaginedCourse(response.data);
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar cursos",
            });
        }
        setIsLoadingCourses(false);
    }, []);

    const getCoursesToAddInClass = useCallback(async (page = 1, queryParams) => {
        setIsLoadingCoursesToAddInClass(true);
        try {
            const response = await api.get(`/course/page/${page}`, {
                params: queryParams
            })
            setPaginedCourseToAddInClass(response.data);
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar cursos",
            });
        }
        setIsLoadingCoursesToAddInClass(false);
    }, []);

    const getCoursesByClass = useCallback(async (idClass, page = 1, queryParams) => {
        setIsLoadingCourses(true);
        try {
            const response = await api.get(`/course/class/${idClass}/page/${page}`, {
                params: queryParams
            })
            setPaginedCourse(response.data);
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar cursos",
            });
        }
        setIsLoadingCourses(false);
    }, []);

    const createCourse = useCallback(async ({ title, description }) => {
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
        try {
            await api.post('/course', request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Curso criado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Curso não pôde ser criado",
            });
            return false;
        }
    }, [])

    const addCourse = useCallback(async ({ class_id, course_id }) => {
        const request = {
            class_id,
            course_id
        }
        Swal.fire({
            title: "Adicionando curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.post('/classHasCourse', request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Curso adicionado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Curso não pôde ser adicionado",
            });
            return false;
        }
    }, [])
    const removeCourse = useCallback(async (queryParams) => {
         Swal.fire({
            title: "removendo curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.delete('/classHasCourse', {
                params: queryParams
            });
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Curso removido com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Curso não pôde ser removido",
            });
            return false;
        }
    }, []);


    const updateCourse = useCallback(async (id, { title, description }) => {
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
        try {
            await api.put(`/course/${id}`, request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Curso editado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Curso não pôde ser editado",
            });
            return false;
        }
    }, [])

    return { paginedCourses, course, paginedCourseToAddInClass, isLoadingCourses, isLoadingCourse, isLoadingCoursesToAddInClass, createCourse, getCourse, updateCourse, getCourses, getCoursesByClass, getCoursesToAddInClass, addCourse, removeCourse };
}

export default useCourse;