/**
==========================================================
* Material Dashboard 2 React - v2.2.0
=============================================================

* Página do produto: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Codificado por www.creative-tim.com

==========================================================

* O aviso de direitos autorais acima e este aviso de permissão devem ser incluídos em todas as cópias ou partes substanciais do Software.
*/

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
import Tablelines from "layouts/tablelines";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Painel",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Linhas",
    key: "Tablelines",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/Tablelines",
    component: <Tablelines />,
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "tables",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notificações",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
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
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
