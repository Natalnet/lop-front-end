import exportRoutes from 'util/routes/exportRoutes.util';
import HomeTurmasScreen from 'screens/sistema/Professor/turmas.screen';

const routes = [
    {
        path: '/sistema/turmas/novasturmas',
        component: HomeTurmasScreen
    }
]

export default exportRoutes(routes);