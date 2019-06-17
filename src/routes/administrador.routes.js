import exportRoutes from "util/routes/exportRoutes.util";
import InstituicaoScreen from "screens/sistema/administracao/instituicoes.screen";
import UsuariosScreen from "screens/sistema/administracao/usuarios.screen";
import DisciplinasScreen from "screens/sistema/administracao/disciplinas.screen";
import CursosScreen from "screens/sistema/administracao/cursos.screen";

const routes = [
  {
    path: "/sistema/administrador/instituicoes",
    component: InstituicaoScreen,
    private: true
  },
  {
    path: "/sistema/administrador/usuarios",
    component: UsuariosScreen,
    private: true
  },
  {
    path: "/sistema/administrador/disciplinas",
    component: DisciplinasScreen,
    private: true
  },
  {
    path: "/sistema/administrador/cursos",
    component: CursosScreen,
    private: true
  }
];

export default exportRoutes(routes);
