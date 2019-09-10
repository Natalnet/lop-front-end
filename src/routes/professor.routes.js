import exportRoutes from 'util/routes/exportRoutes.util';
import NovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import TurmasScreen from 'screens/sistema/Professor/turmas.screen';
import ListasScreen from 'screens/sistema/Professor/listas.screen'
import ExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import CriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import CriarExercicioScreen from 'screens/sistema/Professor/criarExercicios.screen'
import Erro401 from '../screens/erros/error401.screen';

import TelaTurmaLista from '../screens/sistema/Professor/telaTurmaListas.screen'

const routes = [
    {
        path: '/Professor/novasturmas',
        component: NovasTurmasScreen,
        private: true,
        perfil: 'PROFESSOR'
    },
    {
        path: '/professor/turmas',
        component: TurmasScreen,
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
        path: '/professor/turma/1234',
        component: TelaTurmaLista,
        private: true,
        perfil: 'PROFESSOR'
    }
]

export default exportRoutes(routes);