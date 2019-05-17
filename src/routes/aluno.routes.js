import exportRoutes from "util/routes/exportRoutes.util";
import HomeAlunoScreen from "screens/sistema/aluno/home.screen";

const routes = [
  {
    path: "/sistema/aluno",
    component: HomeAlunoScreen
  }
];

export default exportRoutes(routes);
