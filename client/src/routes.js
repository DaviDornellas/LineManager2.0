/**
Todas as rotas para o Material Dashboard 2 React são adicionadas aqui,
Você pode adicionar uma nova rota, personalizar as rotas e excluí-las aqui.

Depois de adicionar uma nova rota neste arquivo, ela ficará visível automaticamente no
Sidenav.

Para adicionar uma nova rota, você pode seguir as rotas existentes na matriz de rotas.
1. A chave `type` com o valor `collapse` é usada para uma rota.
2. A chave `type` com o valor `title` é usada para um título dentro do Sidenav.
3. A chave `type` com o valor `divider` é usada para um divisor entre itens do Sidenav.
4. A chave `name` é usada para o nome da rota no Sidenav.
5. A chave `key` é usada para a chave da rota (ela ajudará você com a prop key dentro de um loop).
6. A chave `icon` é usada para o ícone da rota no Sidenav, você tem que adicionar um nó.
7. A chave `collapse` é usada para fazer um item recolhível no Sidenav que tem outras rotas
dentro (rotas aninhadas), você precisa passar as rotas aninhadas dentro de uma matriz como um valor para a chave `collapse`.
8. A chave `route` é usada para armazenar o local da rota que é usado para o roteador react.
9. A chave `href` é usada para armazenar o local dos links externos.
10. A chave `title` é apenas para o item com o tipo de `title` e é usada para o texto do título no Sidenav.
10. A chave `component` é usada para armazenar o componente de sua rota.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Division from "layouts/division";
import CostCenter from "layouts/costCenter";
import Tablelines from "layouts/tablelines";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Editline from "layouts/editline";
import Report from "layouts/report";
import Cati from "layouts/GAATI/C.A.T.I";
import Compor from "layouts/GAATI/90compor";
import Consultar from "layouts/GAATI/consultar";
import Senhavpn from "layouts/GAATI/senha-vpn";
import Primavera from "layouts/GAATI/primavera";
import HomePage from "layouts/HomePage";
import SignUpAdm from "layouts/authentication/sign-upadm";
import TransferHistory from "layouts/TransferHistory";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "group",
    name: "SGL",
    key: "SGL",
    icon: <Icon fontSize="small">call_add</Icon>,
    roles: ["admin", "editor", "reader"],
    collapse: [
      {
        type: "collapse",
        name: "Linhas",
        key: "Linhas",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/Linhas",
        roles: ["admin", "editor", "reader"],
        component: <Tablelines />,
      },
      {
        type: "collapse",
        name: "Editar Linha",
        key: "Editar Linha",
        icon: <Icon fontSize="small">edit</Icon>,
        route: "/Editar-Linha",
        roles: ["admin", "editor"],
        component: <Editline />,
      },
      {
        type: "collapse",
        name: "Linha",
        key: "dashboard",
        icon: <Icon fontSize="small">add</Icon>,
        route: "/dashboard",
        roles: ["admin", "editor", "reader"],
        component: <Dashboard />,
      },
      {
        type: "collapse",
        name: "Transferências",
        key: "Transferências",
        icon: <Icon fontSize="small">move_down</Icon>,
        route: "/transferencias",
        roles: ["admin", "editor", "reader"],
        component: <TransferHistory />,
      },
      {
        type: "collapse",
        name: "Rateio",
        key: "Rateio",
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: "/Rateio",
        roles: ["admin", "editor", "reader"],
        component: <Billing />,
      },
      {
        type: "collapse",
        name: "Relatórios",
        key: "Relatórios",
        icon: <Icon fontSize="small">description</Icon>,
        route: "/relatorios",
        roles: ["admin", "editor", "reader"],
        component: <Report />,
      },
    ],
  },
  {
    type: "group",
    name: "GAATI",
    key: "GAATI",
    icon: <Icon fontSize="small">person_add</Icon>,
    roles: ["admin"],
    collapse: [
      {
        type: "collapse",
        name: "C.A.T.I",
        key: "cati",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/C.A.T.I",
        roles: ["admin"],
        component: <Cati />,
      },
      {
        type: "collapse",
        name: "90 Compor",
        key: "compor90",
        icon: <Icon fontSize="small">person_add</Icon>,
        route: "/90Compor",
        roles: ["admin"],
        component: <Compor />,
      },
      {
        type: "collapse",
        name: "Primavera",
        key: "Primavera",
        icon: <Icon fontSize="small">person_add</Icon>,
        route: "/primavera",
        roles: ["admin"],
        component: <Primavera />,
      },
      {
        type: "collapse",
        name: "Gerador de Senha",
        key: "Gerador de Senha",
        roles: ["admin"],
        icon: <Icon fontSize="small">https</Icon>,
        route: "/password-generator",
        component: <Senhavpn />,
      },
    ],
  },
  {
    type: "divider",
  },
  // {
  //   type: "collapse",
  //   name: "Notificações",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "group",
    name: "Administração",
    key: "AdministraçãoSGL",
    icon: <Icon fontSize="small">lock</Icon>,
    roles: ["admin"],
    collapse: [
      {
        type: "collapse",
        name: "Obras",
        key: "Obras",
        icon: <Icon fontSize="small">add_home_work</Icon>,
        route: "/Obras",
        roles: ["admin"],
        component: <Division />,
      },
      {
        type: "collapse",
        name: "Centro de Custo",
        key: "Centro de Custo",
        icon: <Icon fontSize="small">add_home_work</Icon>,
        route: "/Centro-de-Custo",
        roles: ["admin"],
        component: <CostCenter />,
      },
      {
        type: "collapse",
        name: "Usuarios",
        key: "Usuarios",
        icon: <Icon fontSize="small">group</Icon>,
        route: "/Usuarios",
        roles: ["admin"],
        component: <Tables />,
      },
      {
        type: "collapse",
        name: "Adicionar Usuário",
        key: "Adicionar Usuário",
        icon: <Icon fontSize="small">person_add</Icon>,
        route: "/Adicionar-Usuario",
        roles: ["admin"],
        component: <SignUpAdm />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    name: "HomePage",
    key: "HomePage",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/",
    component: <HomePage />,
  },
  {
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    roles: ["admin"],
    component: <SignUp />,
  },
];

export default routes;
