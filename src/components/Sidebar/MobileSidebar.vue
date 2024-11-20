<template>
  <div
    :class="`mobile-sidebar bg-white dark:bg-slate-800  ${
      this.$store.themeSettingsStore.theme === 'bordered'
        ? 'border border-gray-5002'
        : 'shadow-base'
    }   `"
  >
    <div class="logo-segment flex justify-between items-center px-4 py-6">
      <router-link :to="{ name: 'home' }">
        <img
          src="@/assets/images/logo/mptc_logo_Small.png"
          alt=""
          v-if="!this.$store.themeSettingsStore.isDark"
        />

        <img
          src="@/assets/images/logo/mptc_logo_Small.png"
          alt=""
          v-if="this.$store.themeSettingsStore.isDark"
        />
      </router-link>
      <span
        class="cursor-pointer text-white dark:text-white text-2xl"
        @click="toggleMsidebar"
        ><Icon icon="heroicons:x-mark"
      /></span>
    </div>

    <!-- menu footer -->
    <div class="sidebar-menu px-4 h-[calc(100%-220px)]" data-simplebar>
      <Navmenu :items="menuItems" />
      <div
        class="bg-slate-900 mb-[100px] mt-14 relative text-center rounded-2xl text-white"
        v-if="!this.$store.themeSettingsStore.sidebarCollasp"
      >
        <!-- <img
          src="@/assets/images/svg/rabit.svg"
          alt=""
          class="mx-auto relative -mt-[73px]"
        />
        <div class="max-w-[160px] mx-auto mt-6">
          <div class="widget-title">Unlimited Access</div>
          <div class="text-xs font-light">
            Upgrade your system to business plan
          </div>
        </div>
        <div class="mt-6">
          <button
            class="btn bg-white hover:bg-opacity-80 text-slate-900 btn-sm w-full block"
          >
            Upgrade
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { Icon } from "@iconify/vue";
import { defineComponent, inject, onMounted, ref } from "vue";
// import { menuItems } from "../../constant/data";
import Navmenu from "./Navmenu";
import { useThemeSettingsStore } from "@/store/themeSettings";
import { perSlug } from "../../constant/permission";
const themeSettingsStore = useThemeSettingsStore();

export default defineComponent({
  components: {
    Icon,
    Navmenu,
  },
  data() {
    return {
      openClass: "w-[248px]",
      closeClass: "w-[72px] close_sidebar",
    };
  },
  methods: {
    toggleMsidebar() {
      themeSettingsStore.toggleMsidebar()
    },
  },

  setup() {
    const services = inject("services");
    const menuItems = ref([
      {
        title: "dashboard",
        icon: "heroicons-outline:home",
        link: "home",
      },
    ]);

    const childMenuItem = ref([])

    const getMenu = async () => {

      menuItems.value.push({
        isHeadr: true,
        title: "user management",
      });

      if (services.checkPermission(perSlug[0].VIEW_USER_LIST)) {
        menuItems.value.push({
          title: "user",
          icon: "mdi:users-group-outline",
          link: "user",
        });
      }

      if (services.checkPermission(perSlug[0].VIEW_ROLE_LIST)) {
        menuItems.value.push({
          title: "role",
          icon: "bx:user-pin",
          link: "role",
        });
      }

      if (services.checkPermission(perSlug[0].VIEW_MENU_LIST)) {
        menuItems.value.push({
          title: "menu",
          icon: "dashicons:welcome-widgets-menus",
          link: "menu",
        });
      }

      if (services.checkPermission(perSlug[0].VIEW_PERMISSION_LIST)) {
        menuItems.value.push({
          title: "permission",
          icon: "fa6-solid:list-check",
          link: "permission",
        });
      }

    };

    onMounted(() => {
      getMenu();
    });


    return {
      menuItems,
      getMenu,
    };
  },
});
</script>
<style lang="scss" scoped>
.mobile-sidebar {
  @apply fixed ltr:left-0 rtl:right-0 top-0   h-full   z-[9999]  w-[280px];
}
</style>
