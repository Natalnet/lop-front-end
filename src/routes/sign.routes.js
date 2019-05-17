import SignScreen from 'screens/autenticacao/registro.screen';

import exportRoutes from 'util/routes/exportRoutes.util';

const routes = [
    {
        path: '/autenticacao/cadastro',
        component: SignScreen
    }
]

export default exportRoutes(routes);