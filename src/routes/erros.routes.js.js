import Error404 from 'screens/erros/error404.screen';


import exportRoutes from 'util/routes/exportRoutes.util';

const routes = [
    {
        path: '/404',
        component: Error404
    },
    {
        path: '*',
        component: Error404
    }
    
];

export default exportRoutes(routes);

