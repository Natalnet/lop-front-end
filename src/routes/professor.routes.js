import exportRoutes from 'util/routes/exportRoutes.util';
import HomeNovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import HomeTurmasScreen from 'screens/sistema/Professor/turmas.screen';
import HomeListasScreen from 'screens/sistema/Professor/listas.screen'
import HomeExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import HomeCriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import HomeCriarExercicioScreen from 'screens/sistema/Professor/criarExercicios.screen'

const routes = [
    {
        path: '/Professor/novasturmas',
        component: HomeNovasTurmasScreen
    },
    {
        path: '/professor/turmas',
        component: HomeTurmasScreen
    },
    {
        path: '/professor/listas',
        component: HomeListasScreen
    },
    {
        path: '/professor/exercicios',
        component: HomeExerciciosScreen
    },
    {
        path: '/professor/criarLista',
        component: HomeCriarListaScreen
    },
    {
        path: '/professor/criarExercicio',
        component: HomeCriarExercicioScreen
    }
]

export default exportRoutes(routes);