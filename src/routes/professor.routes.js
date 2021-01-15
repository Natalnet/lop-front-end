import exportRoutes from "../util/routes/exportRoutes.util";
import NovasTurmasScreen from "../screens/sistema/professor/novasTurmas.screen";
import HomeProfessorScreen from "../screens/sistema/professor/HomeProfessor.screen";
import ListasScreen from "../screens/sistema/professor/listas.screen";
import ProvaScreen from "../screens/sistema/professor/provas.screen";
import ExerciciosScreen from "../screens/sistema/professor/exercicios.screen";
import Exercicio from "../screens/sistema/professor/exercicio.screen";
import AtualizarexercicioScreen from "../screens/sistema/professor/exercicios.editar.screen";
import CreateListScreen from "../screens/sistema/professor/createList.screen";
import UpdateListScreen from "../screens/sistema/professor/updateList.screen";
import UpdateTest from "../screens/sistema/professor/updateTest.screen";
import CreateTest from "../screens/sistema/professor/createTest.screen";
import CriarExercicioScreen from "../screens/sistema/professor/criarExercicios.screen";
import Erro401 from "../screens/erros/error401.screen";
import TelaTurmaParticipantes from "../screens/sistema/professor/telaTurmaParticipantes.screen";
import TelaTurmaParticipantesListas from "../screens/sistema/professor/telaTurmaParticipantesListas.screen.js";
import TelaTurmaParticipantesLista from "../screens/sistema/professor/telaTurmaParticipantesLista.screen.js";
import TelaTurmaParticipantesProva from "../screens/sistema/professor/telaTurmaParticipantesProva.screen.js";
import TelaTurmaParticipantesListaSubmissoes from "../screens/sistema/professor/telaTurmaParticipantesListaSubmissoes.screen.js";
import TelaTurmaParticipantesProvaSubmissoes from "../screens/sistema/professor/telaTurmaParticipantesProvaSubmissoes.screen.js";
import TelaTurmaProvas from "../screens/sistema/professor/telaTurmaProvas.screen";
import TelaTurmaSolicitacoes from "../screens/sistema/professor/telaTurmasSolicitacoes.screen";
import TelaTurmaLista from "../screens/sistema/professor/telaTurmaListas.screen";
import TurmaExercicio from "../screens/sistema/professor/telaTurmaExercicio.screen";
import TurmaExercicioSubmissoes from "../screens/sistema/professor/telaTurmaExercicioSubmissoes.screen";
import TurmaExercicioProvaSubmissoes from "../screens/sistema/professor/telaTurmaExercicioProvaSubmissoes.screen";
import TurmaExercicioPlagio from "../screens/sistema/professor/telaTurmaExercicioPlagio.screen";
import TurmaExercicioProvaPlagio from "../screens/sistema/professor/telaTurmaExercicioProvaPlagio.screen";
import TurmaExercicios from "../screens/sistema/professor/telaTurmaExercicios.screen";
import TelaTurmasDashboard from "../screens/sistema/professor/telaTurmasDashboard.screen";
import TelaTurmasSubmissoes from "../screens/sistema/professor/telaTurmasSubmissoes.screen";
import EditarTurma from "../screens/sistema/professor/editarTurma.screen";
import RealizarQuestao from "../screens/sistema/professor/telaTurmasAcessarQuestaoProva.screen";
import QuestoesProva from "../screens/sistema/professor/telaTurmasAcessarProva.screen";
import ProvasAlunos from "../screens/sistema/professor/provasAlunos";
import CorrecaoProvas from "../screens/sistema/professor/correcaoProva.screen";
import Courses from '../screens/sistema/professor/courses.screen'
import createLesson from '../screens/sistema/professor/createLesson.screen'
import editLesson from '../screens/sistema/professor/editLesson.screen'
import Lessons from '../screens/sistema/professor/lessons.screen'
import Lesson from '../screens/sistema/professor/lesson.screen'
import ClassCourses from '../screens/sistema/professor/classCourses.screen'
import ClassLessons from '../screens/sistema/professor/classLessons.screen'
import ClassLesson from '../screens/sistema/professor/classLesson.screen'
import CreateObjectiveQuestion from '../screens/sistema/professor/createObjectiveQuestion.screen'
import UpdateObjectiveQuestion from '../screens/sistema/professor/updateObjectiveQuestion.screen'
import CreatediscursiveQuestion from '../screens/sistema/professor/createDiscursiveQuestion.screen'
import UpdateDiscursiveQuestion from '../screens/sistema/professor/updateDiscursiveQuestion.screen'
import ClassLessonQuestion from '../screens/sistema/professor/classLessonQuestion.screen'
import LessonQuestions from '../screens/sistema/professor/lessonQuestions.screen';

const routes = [
  {
    path: "/professor/novasturmas",
    component: NovasTurmasScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor",
    component: HomeProfessorScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/listas",
    component: ListasScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/provas",
    component: ProvaScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/exercicios",
    component: ExerciciosScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/exercicio/:idQuestion",
    component: Exercicio,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/exercicios/:id/editar",
    component: AtualizarexercicioScreen,
    private: true,
    perfil: "PROFESSOR",
  },

  {
    path: "/professor/criarLista",
    component: CreateListScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/listas/:idList/editar",
    component: UpdateListScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/provas/:idTest/editar",
    component: UpdateTest,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/criarProva",
    component: CreateTest,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/criarExercicio",
    component: CriarExercicioScreen,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/401",
    component: Erro401,
    private: true,
  },
  {
    path: "/professor/turma/:id/listas",
    component: TelaTurmaLista,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/lista/:idList",
    component: TurmaExercicios,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/lista/:idList/exercicio/:idQuestion",
    component: TurmaExercicio,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/lista/:idLista/exercicio/:idExercicio/submissoes",
    component: TurmaExercicioSubmissoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/prova/:idTest/exercicio/:idExercicio/submissoes",
    component: TurmaExercicioProvaSubmissoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/lista/:idLista/exercicio/:idExercicio/submissoes/plagio",
    component: TurmaExercicioPlagio,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/prova/:idTest/exercicio/:idQuestion/submissoes/plagio",
    component: TurmaExercicioProvaPlagio,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/participantes",
    component: TelaTurmaParticipantes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/participantes/:idUser/listas",
    component: TelaTurmaParticipantesListas,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path:
      "/professor/turma/:idClass/participantes/:idUser/listas/:idList/exercicios",
    component: TelaTurmaParticipantesLista,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path:
      "/professor/turma/:id/participantes/:idUser/provas/:idProva/exercicios",
    component: TelaTurmaParticipantesProva,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path:
      "/professor/turma/:id/participantes/:idUser/listas/:idLista/exercicio/:idExercicio",
    component: TelaTurmaParticipantesListaSubmissoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path:
      "/professor/turma/:id/participantes/:idUser/provas/:idProva/exercicio/:idExercicio",
    component: TelaTurmaParticipantesProvaSubmissoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/provas",
    component: TelaTurmaProvas,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/correcaoprovas/:idProva",
    component: ProvasAlunos,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/prova/:idProva/aluno/:idAluno/page/:idQuestion",
    component: CorrecaoProvas,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/solicitacoes",
    component: TelaTurmaSolicitacoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/submissoes",
    component: TelaTurmasSubmissoes,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/dashboard",
    component: TelaTurmasDashboard,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:id/editar",
    component: EditarTurma,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/prova/:idTest/questao/:idQuestion",
    component: RealizarQuestao,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/prova/:idTest",
    component: QuestoesProva,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/cursos",
    component: Courses,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/cursos",
    component: ClassCourses,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/cursos/:IdCourse/aulas",
    component: ClassLessons,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/curso/:IdCourse/aulas/:idLesson",
    component: ClassLesson,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/curso/:IdCourse/criarAulas",
    component: createLesson,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/curso/:IdCourse/editarAulas/:idLesson",
    component: editLesson,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/curso/:IdCourse/aulas",
    component: Lessons,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/curso/:IdCourse/aulas/:idLesson",
    component: Lesson,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/criarExercicioObjetvo",
    component: CreateObjectiveQuestion,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/editarExercicioObjetvo/:idObjectiveQuestion",
    component: UpdateObjectiveQuestion,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/criarExercicioDiscursivo",
    component: CreatediscursiveQuestion,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/editarExercicioDiscursivo/:idDiscursiveQuestion",
    component: UpdateDiscursiveQuestion,
    private: true,
    perfil: "PROFESSOR",
  },
  {
    path: "/professor/turma/:idClass/aula/:idLesson/exercicio/:idQuestion",
    component: ClassLessonQuestion,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/aula/:idLesson/exercicio/:idQuestion",
    component: LessonQuestions,
    private: true,
    perfil: "PROFESSOR"
  },
];

export default exportRoutes(routes);
