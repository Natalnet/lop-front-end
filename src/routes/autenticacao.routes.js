import LoginScreen from 'screens/autenticacao/login.screen';

import exportRoutes from 'util/routes/exportRoutes.util';

const routes = [
    {
        path: '/',
        component: LoginScreen
    }
]

export default exportRoutes(routes);