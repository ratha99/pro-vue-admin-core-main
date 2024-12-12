
import auth from "@/middleware/auth";
import { perSlug } from "../constant/permission";
const routes = [
  {
    path: "/",
    name: "",
    redirect: "/app/home",
    component: () => import("@/Layout/index.vue"),
    // component: () => import("@/views/auth/login/login3.vue")
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/login/login3.vue"),
  },
  {
    path: "/app",
    name: "Layout",
    redirect: "/app/home",
    slug: perSlug[0].VIEW_DASHBOARD,
    component: () => import("@/Layout/index.vue"),
    meta: {
      middleware: [auth],
      slug: "1",
    },

   
    
    children: [
      {
        path: "dac-docout",
        name: "docOut",
        component: () => import("@/views/folder/dac/dacDocOut.vue"),
        meta: {
          groupParent: "dac",
          slug: perSlug[0].DAC,
          hide: false,
        },
      },
      // {
      //   path: "dac-docout-create",
      //   name: "docOut-create",
      //   component: () => import("@/views/folder/dac/out/dacDocOutCreate.vue"),
      //   meta: {
      //     groupParent: "dac",
      //     slug: perSlug[0].DAC,
      //     hide: false,
      //   },
      // },
      // {
      //   path: "dac-docout-eidt",
      //   name: "docOut-edit​",
      //   component: () => import("@/views/folder/dac/out/dacDocOutEdit.vue"),
      //   meta: {
      //     groupParent: "dac",
      //     slug: perSlug[0].DAC,
      //     hide: false,
      //   },
      // },
      //DAC
      {
        path: "dac-docin",
        name: "dac-docin",
        component: () => import("@/views/folder/dac/dacDocIn.vue"),
        meta: {
          groupParent: "dac",
          slug: perSlug[0].DAC,
          hide: false,
          isAuth: false,
        },
      },
      // {
      //   path: "dac-docin-view",
      //   name: "ឯកសារចូល-view​",
      //   component: () => import("@/views/folder/dac/in/dacDocInView.vue"),
      //   meta: {
      //     groupParent: "dac",
      //     slug: perSlug[0].DAC,
      //     hide: false,
      //   },
      // },
      // {
      //   path: "dac-docin-create",
      //   name: "ឯកសារចូល-create​",
      //   component: () => import("@/views/folder/dac/in/dacDocInCreate.vue"),
      //   meta: {
      //     groupParent: "dac",
      //     slug: perSlug[0].DAC,
      //     hide: false,
      //   },
        
      // },
      // {
      //   path: "dac-docin-edit",
      //   name: "ឯកសារចូល-edit",
      //   component: () => import("@/views/folder/dac/in/dacDocInEdit.vue"),
      //   meta: {
      //     groupParent: "dac",
      //     slug: perSlug[0].DAC,
      //     hide: false,
      //   },
        
      // },
      {
        path: "doe-docOut",
        name: "ឯកសារចេញ",
        component: () => import("@/views/folder/doe/doeDocOut.vue"),
        meta: {
          groupParent: "doe",
          slug: perSlug[0].DOE,
          hide: false,
        },
      },
      {
        path: "doe-docin",
        name: "ឯកសារចូល",
        component: () => import("@/views/folder/doe/doeDocIn.vue"),
        meta: {
          groupParent: "doe",
          slug: perSlug[0].DOE,
          hide: false,
        },
      },
      {
        path: "home",
        name: "home",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          slug: perSlug[0].VIEW_DASHBOARD,
          hide: true,
        },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/views/profile.vue"),
        meta: {
          slug: perSlug[0].VIEW_DASHBOARD,
        }
      },
      {
        path: "change_password",
        name: "change_password",
        component: () => import("@/views/change_password_profile.vue"),
        meta: {
          slug: perSlug[0].VIEW_DASHBOARD,
        }
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/user_management/user/index.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].VIEW_USER_LIST,
        },
      },
      {
        path: "adduser",
        name: "adduser",
        component: () => import("@/views/user_management/user/user_form.vue"),
        meta: {
          slug: perSlug[0].ADD_NEW_USER,
        },
      },
      {
        path: "edituser/:id",
        name: "edituser",
        component: () => import("@/views/user_management/user/user_form.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].EDIT_USER,
        },
      },
      {
        path: "role",
        name: "role",
        component: () => import("@/views/user_management/role/index.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].VIEW_ROLE_LIST,
        },
      },
      {
        path: "role-permission/:id",
        name: "role_permission",
        component: () => import("@/views/user_management/role/role_permission.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].SET_ROLE_PERMISSION,
        },
      },

      {
        path: "permission",
        name: "permission",
        component: () => import("@/views/permission/index.vue"),
        meta: {
          slug: perSlug[0].PERMISSION,
          groupParent: "user management1",
        },
      },
      {
        path: "menu",
        name: "menu",
        component: () => import("@/views/user_management/menu/index.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].VIEW_MENU_LIST,
        },
      },
      {
        path: "permission",
        name: "permission",
        component: () => import("@/views/user_management/permission/index.vue"),
        meta: {
          groupParent: "user management",
          slug: perSlug[0].VIEW_PERMISSION_LIST,
        },
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/",
    name: "403",
    component: () => import("@/views/403.vue"),
  },

];

export default routes;