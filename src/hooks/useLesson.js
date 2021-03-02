import { useCallback, useState } from 'react';
import api from '../services/api';
import Swal from "sweetalert2";
// import { Container } from './styles';

const useLesson = () => {
    const [isLoadingLessons, setIsLoadingLessons] = useState(false);
    const [isLoadingLesson, setIsLoadingLesson] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [lesson, setLesson] = useState([]);

    const getLesson = useCallback(async (id, queryParams = {}) => {
        try {
            setIsLoadingLesson(true);
            const response = await api.get(`/lesson/${id}`,{
                params: queryParams
            })
            setLesson(response.data)
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar aula",
            });
        }
        setIsLoadingLesson(false);
    }, [])

    const createLesson = useCallback(async ({ title, description, course_id, selectedQuestions }) => {
        const request = {
            title,
            description,
            course_id,
            questions: selectedQuestions.map((q) => q.id),

        }
        Swal.fire({
            title: "criando aula",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.post('/lesson', request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Aula criado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Aula não pôde ser criado",
            });
            return false;
        }
    }, [])

    const getLessonsByCourse = useCallback(async (courseId) => {
        setIsLoadingLessons(true);
        try {
            const response = await api.get(`/lesson/course/${courseId}`)
            setLessons(response.data);
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... erro ao carregar aulas",
            });
        }
        setIsLoadingLessons(false);
    }, []);

    const updateLesson = useCallback(async (id, { title, description, selectedQuestions }) => {
        const request = {
            title,
            description,
            questions: selectedQuestions.map((q) => q.id),
        }
        Swal.fire({
            title: "Editando curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.put(`/lesson/${id}`, request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: "Aula editado com sucesso!",
            });
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Aula não pôde ser editado",
            });
            return false;
        }
    }, []);

    const updateVisibilidadeLesson = useCallback(async (isVisible, idLesson) => {
        const request = {
            isVisible
        }
        Swal.fire({
            title: "Editando curso",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();
        try {
            await api.put(`/lesson/${idLesson}/visibility`, request);
            Swal.hideLoading();
            Swal.fire({
                icon: "success",
                title: `O curso agora${isVisible?' ':' não '}está visível`,
            });
            const index = lessons.findIndex(l => l.id === idLesson);
            const tempLessons = [...lessons];
            tempLessons[index].isVisible = isVisible;
            setLessons(tempLessons);
            return true;
        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "ops... Visibilidade do curso não pôde ser editada",
            });
            return false;
        }
    }, [lessons])

    return { isLoadingLessons, lesson, lessons, isLoadingLesson, getLesson, getLessonsByCourse, createLesson, updateLesson, updateVisibilidadeLesson };
}

export default useLesson;