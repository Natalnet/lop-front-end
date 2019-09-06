import exportRoutes from "util/routes/exportRoutes.util";
import HomeAlunoScreen from "screens/sistema/aluno/home.screen";

import HomeListaExercicios from "../screens/sistema/aluno/execicio.screen";


import TurmasAbertasAlunoScreen from "screens/sistema/aluno/turmasAbertas.screen"
const routes = [
  {
    path: "/aluno",
    component: HomeAlunoScreen,
    private: true,
  },
  {
    path: "/aluno/exercicio",
    component: HomeListaExercicios,
    private: true
  },
  {
    path: "/aluno/turmasAbertas",
    component: TurmasAbertasAlunoScreen,
    private: true
  }
];

export default exportRoutes(routes);
