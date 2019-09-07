import exportRoutes from 'util/routes/exportRoutes.util';
import NovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import HomeProfessorScreen from 'screens/sistema/Professor/HomeProfessor.screen';
import ListasScreen from 'screens/sistema/Professor/listas.screen'
import ExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import CriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import CriarExercicioScreen from 'screens/sistema/Professor/criarExercicios.screen'
import Erro401 from '../screens/erros/error401.screen';

const routes = [
    {
        path: '/professor',
        component: HomeProfessorScreen,
        private: true
    },
    {
        path: '/Professor/novasturmas',
        component: NovasTurmasScreen,
        private: true
    },
    {
        path: '/professor/listas',
        component: ListasScreen,
        private: true
    },
    {
        path: '/professor/exercicios',
        component: ExerciciosScreen,
        private: true
    },
    {
        path: '/professor/criarLista',
        component: CriarListaScreen,
        private: true
    },
    {
        path: '/professor/criarExercicio',
        component: CriarExercicioScreen,
        private: true
    },
    {
        path: '/401',
        component: Erro401
    }
]

export default exportRoutes(routes);