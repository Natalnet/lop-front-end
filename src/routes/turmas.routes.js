import exportRoutes from 'util/routes/exportRoutes.util';
import HomeNovasTurmasScreen from 'screens/sistema/Professor/novasTurmas.screen';
import HomeTurmasScreen from 'screens/sistema/Professor/turmas.screen';

const routes = [
    {
        path: '/sistema/turmas/novasturmas',
        component: HomeNovasTurmasScreen
    },
    {
        path: '/sistema/turmas',
        component: HomeTurmasScreen
    }
]

export default exportRoutes(routes);