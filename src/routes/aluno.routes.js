import exportRoutes from "util/routes/exportRoutes.util";
import HomeAlunoScreen from "screens/sistema/aluno/home.screen";
import TurmasAbertasAlunoScreen from "screens/sistema/aluno/turmasAbertas.screen"
const routes = [
  {
    path: "/sistema/aluno",
    component: HomeAlunoScreen,
    private: true
  },
  {
    path: "/sistema/aluno/turmasAbertas",
    component: TurmasAbertasAlunoScreen,
    private: true
  }
];

export default exportRoutes(routes);
