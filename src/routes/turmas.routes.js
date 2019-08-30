import exportRoutes from 'util/routes/exportRoutes.util';
import HomeNovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import HomeTurmasScreen from 'screens/sistema/Professor/turmas.screen';
import HomeListasScreen from 'screens/sistema/Professor/listas.screen'
import HomeExerciciosScreen from 'screens/sistema/Professor/exercicios.screen'
import HomeCriarListaScreen from 'screens/sistema/Professor/criarLista.screen'
import HomeCriarExercicioScreen from 'screens/sistema/Professor/sistemaProfessorExercicioCriar'

const routes = [
    {
        path: '/sistema/turmas/novasturmas',
        component: HomeNovasTurmasScreen
    },
    {
        path: '/sistema/turmas',
        component: HomeTurmasScreen
    },
    {
        path: '/sistema/professor/listas',
        component: HomeListasScreen
    },
    {
        path: '/sistema/professor/exercicios',
        component: HomeExerciciosScreen
    },
    {
        path: '/sistema/professor/criarLista',
        component: HomeCriarListaScreen
    },
    {
        path: '/sistema/professor/criarExercicio',
        component: HomeCriarExercicioScreen
    }
]

export default exportRoutes(routes);