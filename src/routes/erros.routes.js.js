import Error404 from 'screens/erros/error404.screen';
import Erro from '../screens/erros/errorBoundary.screen';

import exportRoutes from 'util/routes/exportRoutes.util';

const routes = [
    {
        path: '*',
        component: Error404
    },
    {
        path: '/hello',
        component: Erro
    }
];

export default exportRoutes(routes);

