import exportRoutes from "util/routes/exportRoutes.util";
import HomeAlunoScreen from "screens/sistema/aluno/home.screen";

import HomeListaExercicios from "../screens/sistema/aluno/execicio.screen";
import Exercicios from "../screens/sistema/aluno/exercicios.screen";

import TurmasAbertasAlunoScreen from "screens/sistema/aluno/turmasAbertas.screen";

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
  },
  {
    path: "/aluno/exercicios",
    component: Exercicios,
    private: true
  },
];

export default exportRoutes(routes);
