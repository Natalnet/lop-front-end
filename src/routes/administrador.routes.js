import exportRoutes from "util/routes/exportRoutes.util";
import InstituicaoScreen from "screens/sistema/administracao/instituicoes.screen";
import UsuariosScreen from "screens/sistema/administracao/usuarios.screen";
import DisciplinasScreen from "screens/sistema/administracao/disciplinas.screen";
import CursosScreen from "screens/sistema/administracao/cursos.screen";
/*{
  path: "/sistema/administracao/",
  component: HomeAdministracaoScreen
}*/
const routes = [
  {
    path: "/sistema/administrador/instituicoes",
    component: InstituicaoScreen
  },
  {
    path: "/sistema/administrador/usuarios",
    component: UsuariosScreen
  },
  {
    path: "/sistema/administrador/disciplinas",
    component: DisciplinasScreen
  },
  {
    path: "/sistema/administrador/cursos",
    component: CursosScreen
  }
];

export default exportRoutes(routes);
