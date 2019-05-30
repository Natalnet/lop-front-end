import exportRoutes from "util/routes/exportRoutes.util";
import HomeProfessorScreen from "screens/sistema/professor/relatorio.screen";

const routes = [
  {
    path: "/sistema/professor/relatorio",
    component: HomeProfessorScreen
  }
];

export default exportRoutes(routes);
