import exportRoutes from "../util/routes/exportRoutes.util";
import HomeAlunoScreen from "../screens/sistema/aluno/home.screen";
import HomeListaExercicios from "../screens/sistema/aluno/exercicio.screen";
import TurmaAluno from "../screens/sistema/aluno/telaTurmaParticipantes.screen";
import Exercicios from "../screens/sistema/aluno/exercicios.screen";
import Exercicio from "../screens/sistema/aluno/exercicio.screen";
import TurmaLista from "../screens/sistema/aluno/telaTurmaListas.screen";
import TurmaExercicio from "../screens/sistema/aluno/telaTurmaExercicio.screen";
import TurmaExercicios from "../screens/sistema/aluno/telaTurmaExercicios.screen";
import DashBoardAluno from "../screens/sistema/aluno/telaTurmaDashBoard.screen";
import TurmasAbertasAlunoScreen from "../screens/sistema/aluno/turmasAbertas.screen";
import TelaProvas from "../screens/sistema/aluno/telaTurmaProvas.screen";
import QuestoesProva from "../screens/sistema/aluno/telaTurmasAcessarProva.screen";
import RealizarQuestao from "../screens/sistema/aluno/telaTurmasAcessarQuestaoProva.screen";
import Courses from '../screens/sistema/aluno/courses.screen'
import Lessons from '../screens/sistema/aluno/lessons.screen'
import Lesson from '../screens/sistema/aluno/lesson.screen'

const routes = [
  {
    path: "/aluno",
    component: HomeAlunoScreen,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/exercicio",
    component: HomeListaExercicios,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turmasAbertas",
    component: TurmasAbertasAlunoScreen,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/exercicios/",
    component: Exercicios,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/listas",
    component: TurmaLista,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/lista/:idLista/exercicio/:idExercicio",
    component: TurmaExercicio,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/lista/:idLista",
    component: TurmaExercicios,
    private: true,
    perfil: "ALUNO"
  },

  {
    path: "/aluno/turma/:id/participantes",
    component: TurmaAluno,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/dashboard",
    component: DashBoardAluno,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/exercicio/:idQuestion",
    component: Exercicio,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/provas",
    component: TelaProvas,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/prova/:idTest",
    component: QuestoesProva,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/turma/:id/prova/:idTest/questao/:idExercicio",
    component: RealizarQuestao,
    private: true,
    perfil: "ALUNO"
  },
  {
    path: "/aluno/cursos",
    component: Courses,
    private: true,
    perfil: "ALUNO",
  },
  {
    path: "/aluno/curso/:IdCourse/aulas",
    component: Lessons,
    private: true,
    perfil: "ALUNO",
  },
  {
    path: "/aluno/curso/:IdCourse/aulas/:idLesson",
    component: Lesson,
    private: true,
    perfil: "ALUNO",
  },
];

export default exportRoutes(routes);
