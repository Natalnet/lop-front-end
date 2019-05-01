import exportRoutes from 'util/routes/exportRoutes.util';
import HomeProfessorScreen from 'screens/sistema/professor/home.screen';

const routes = [
    {
        path: '/sistema/professor',
        component: HomeProfessorScreen
    }
]

export default exportRoutes(routes);