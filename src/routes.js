/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Category from "views/Category";
import Login from "views/Login";
import Add from "views/Add.js"
import Logout from "views/Logout";


var routes = [
  { 
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-single-02",
    component: Login,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "Category",
    icon: "nc-icon nc-tile-56",
    component: Category,
    layout: "/admin",
  },
  {
    path: "/add",
    name: "Add",
    icon: "nc-icon nc-simple-add",
    component: Add,
    layout: "/admin",
  },
  {
    pro: true,
    path: "/Logout",
    name: "Log out",
    icon: "nc-icon nc-button-power",
    component: Logout,
    layout: "/admin",
  },
];
export default routes;
