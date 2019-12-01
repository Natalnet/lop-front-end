import exportRoutes from "util/routes/exportRoutes.util";
import NovasTurmasScreen from "screens/sistema/Professor/novasTurmas.screen";
import HomeProfessorScreen from "screens/sistema/Professor/HomeProfessor.screen";
import ListasScreen from "screens/sistema/Professor/listas.screen";
import ProvaScreen from "screens/sistema/Professor/provas.screen";

import ExerciciosScreen from "screens/sistema/Professor/exercicios.screen";
import AtualizarexercicioScreen from "screens/sistema/Professor/exercicios.editar.screen";

import CriarListaScreen from "screens/sistema/Professor/criarLista.screen";

import CriarProvaScreen from "screens/sistema/Professor/criarProva.screen";

import CriarExercicioScreen from "screens/sistema/Professor/criarExercicios.screen";
import Erro401 from "../screens/erros/error401.screen";
import TelaTurmaParticipantes from "../screens/sistema/Professor/telaTurmaParticipantes.screen";
import TelaTurmaProvas from "../screens/sistema/Professor/telaTurmaProvas.screen";
import TelaTurmaSolicitacoes from "../screens/sistema/Professor/telaTurmasSolicitacoes.screen";
import TelaTurmaLista from "../screens/sistema/Professor/telaTurmaListas.screen";
import TurmaExercicio from "../screens/sistema/Professor/telaTurmaExercicio.screen";

import TurmaExercicios from "../screens/sistema/Professor/telaTurmaExercicios.screen";
import TelaTurmasDashboard from "../screens/sistema/Professor/telaTurmasDashboard.screen";

import TelaTurmasSubmissoes from "../screens/sistema/Professor/telaTurmasSubmissoes.screen";

import EditarTurma from "../screens/sistema/Professor/editarTurma.screen";

import RealizarQuestao from "../screens/sistema/Professor/telaTurmasAcessarQuestaoProva.screen";

import QuestoesProva from "../screens/sistema/Professor/telaTurmasAcessarProva.screen";

const routes = [
  {
    path: "/professor/novasturmas",
    component: NovasTurmasScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor",
    component: HomeProfessorScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/listas",
    component: ListasScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/provas",
    component: ProvaScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/exercicios",
    component: ExerciciosScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/exercicios/:id/editar",
    component: AtualizarexercicioScreen,
    private: true,
    perfil: "PROFESSOR"
  },

  {
    path: "/professor/criarLista",
    component: CriarListaScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/criarProva",
    component: CriarProvaScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/criarExercicio",
    component: CriarExercicioScreen,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/401",
    component: Erro401,
    private: true
  },
  {
    path: "/professor/turma/:id/listas",
    component: TelaTurmaLista,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/lista/:idLista",
    component: TurmaExercicios,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/lista/:idLista/exercicio/:idExercicio",
    component: TurmaExercicio,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/participantes",
    component: TelaTurmaParticipantes,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/provas",
    component: TelaTurmaProvas,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/solicitacoes",
    component: TelaTurmaSolicitacoes,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/submissoes",
    component: TelaTurmasSubmissoes,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/dashboard",
    component: TelaTurmasDashboard,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/editar",
    component: EditarTurma,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/prova/:idTest/questao/:idExercicio",
    component: RealizarQuestao,
    private: true,
    perfil: "PROFESSOR"
  },
  {
    path: "/professor/turma/:id/prova/:idTest",
    component: QuestoesProva,
    private: true,
    perfil: "PROFESSOR"
  }
];

export default exportRoutes(routes);
