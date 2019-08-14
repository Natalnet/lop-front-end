import exportRoutes from "util/routes/exportRoutes.util";
import UsuariosScreen from "screens/sistema/administracao/usuarios.screen";

const routes = [
  {
    path: "/sistema/administrador/usuarios",
    component: UsuariosScreen,
    private: true
  }
];

export default exportRoutes(routes);
