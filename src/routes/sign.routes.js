import SignScreen from 'screens/autenticacao/sign.screen';

import exportRoutes from 'util/routes/exportRoutes.util';

const routes = [
    {
        path: '/autenticacao/cadastro',
        component: SignScreen
    }
]

export default exportRoutes(routes);