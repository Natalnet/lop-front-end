import exportRoutes from 'util/routes/exportRoutes.util';
import NovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import TurmasScreen from 'screens/sistema/Professor/turmas.screen';
import ListasScreen from 'screens/sistema/Professor/listas.screen'
import ExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import CriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import CriarExercicioScreen from 'screens/sistema/Professor/criarExercicios.screen'


const routes = [
    {
        path: '/Professor/novasturmas',
        component: NovasTurmasScreen,
        private: true
    },
    {
        path: '/professor/turmas',
        component: TurmasScreen,
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
    }
]

export default exportRoutes(routes);