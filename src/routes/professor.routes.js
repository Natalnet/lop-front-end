import exportRoutes from 'util/routes/exportRoutes.util';
import NovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import HomeProfessorScreen from 'screens/sistema/Professor/HomeProfessor.screen';
import ListasScreen from 'screens/sistema/Professor/listas.screen'
import ExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import AtualizarexercicioScreen from 'screens/sistema/Professor/exercicios.editar.screen'

import CriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import CriarExercicioScreen from 'screens/sistema/Professor/criarExercicios.screen'
import Erro401 from '../screens/erros/error401.screen';
import TelaTurmaParticipantes from '../screens/sistema/Professor/telaTurmaParticipantes.screen'
import TelaTurmaProvas from '../screens/sistema/Professor/telaTurmaProvas.screen'
import TelaTurmaSolicitacoes from '../screens/sistema/Professor/telaTurmasSolicitacoes.screen'
import TelaTurmaLista from '../screens/sistema/Professor/telaTurmaListas.screen'
import TelaTurmasDashboard from '../screens/sistema/Professor/telaTurmasDashboard.screen'
import EditarTurma from '../screens/sistema/Professor/editarTurma.screen'
const routes = [
    {
        path: '/professor/novasturmas',
        component: NovasTurmasScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor',
        component: HomeProfessorScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/listas',
        component: ListasScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/exercicios',
        component: ExerciciosScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/exercicios/:id/editar',
        component: AtualizarexercicioScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    
    {
        path: '/professor/criarLista',
        component: CriarListaScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/criarExercicio',
        component: CriarExercicioScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/401',
        component: Erro401,
        private: true
    },
    {
        path: '/professor/turma/:id/listas',
        component: TelaTurmaLista,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turma/:id/participantes',
        component: TelaTurmaParticipantes,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turma/:id/provas',
        component: TelaTurmaProvas,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turma/:id/solicitacoes',
        component: TelaTurmaSolicitacoes,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turma/:id/dashboard',
        component: TelaTurmasDashboard,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turma/:id/editar',
        component: EditarTurma,
        private: true,
        perfil: 'PROFESSOR'
    }
]

export default exportRoutes(routes);