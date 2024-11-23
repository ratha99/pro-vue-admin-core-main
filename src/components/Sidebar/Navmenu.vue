<template>
  <ul>
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="`
      ${item.child ? 'item-has-children' : ''}
      ${activeSubmenu === i ? 'open' : ''}
      ${this.$route.name === item.link ? 'menu-item-active' : this.$route.nam}
      
      `"
      class="single-sidebar-menu"
    >
      <!-- ?? single menu with no childred !!  -->

      <router-link
        :to="`/app/${item.link}`"
        class="menu-link"
        v-if="!item.child && !item.isHeadr"
      >
        <span class="menu-icon" v-if="item.icon">
          <Icon :icon="item.icon"
        /></span>
        <div class="text-box" v-if="item.title">{{ $t(item.title) }}</div>
      </router-link>

      <!-- ?? only for menulabel ??  -->
      <div v-else-if="item.isHeadr && !item.child" class="menulabel">
        {{ $t(item.title) }}
      </div>
      <!-- !!sub menu parent li !! -->
      <div
        class="menu-link"
        v-else
        :class="
          activeSubmenu === i ? 'parent_active not-collapsed' : 'collapsed'
        "
        @click="toggleSubmenu(i)"
      >
        <div class="flex-1 flex items-start">
          <span class="menu-icon" v-show="item.icon">
            <Icon :icon="item.icon"
          /></span>
          <div class="text-box" v-if="item.title">{{ $t(item.title) }}</div>
        </div>
        <div class="flex-0">
          <div
            class="menu-arrow transform transition-all duration-300"
            :class="
              activeSubmenu === i
                ? ' ltr:rotate-90 rtl:rotate-90'
                : 'rtl:rotate-180'
            "
          >
            <Icon icon="heroicons-outline:chevron-right" />
          </div>
        </div>
      </div>
      <Transition
        enter-active-class="submenu_enter-active"
        leave-active-class="submenu_leave-active"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <!-- !! SubMenu !! -->
        <ul class="sub-menu" v-if="i === activeSubmenu">
          <li
            v-for="(ci, index) in item.child"
            :key="index"
            class="block ltr:pl-4 rtl:pr-4 ltr:pr-1 rtl:-l-1 mb-4 first:mt-4"
          >
            <router-link :to="ci.childlink" v-slot="{ isActive }">
              <span
                class="text-sm flex space-x-3 rtl:space-x-reverse items-center transition-all duration-150"
                :class="
                  isActive
                    ? 'text-white bg-[#003a8a] dark:bg-[#003a8a] font-medium rounded-lg'
                    : 'text-[#003a8a] bg-transparent dark:text-[#003a8a]'
                "
              >
                <span class="menu-icon" v-show="ci.icon">
                  <Icon :icon="ci.icon" />
                </span>
                <span class="flex-1">
                  {{ ci.childtitle }}
                </span>
              </span>
            </router-link>
          </li>
        </ul>
      </Transition>
    </li>
  </ul>
</template>
<script>
import { useRouter } from "vue-router";
import Icon from "../Icon";
export default {
  components: {
    Icon,
  },

  data() {
    return {
      activeSubmenu: null,
    };
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    items: { type: Array, required: true },
    childrenLinks: { type: Array, default: null },
  },

  methods: {
    beforeEnter(element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = "0px";
        }

        element.style.display = null;
      });
    },
    enter(element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = `${element.scrollHeight}px`;
        });
      });
    },
    afterEnter(element) {
      element.style.height = null;
    },
    beforeLeave(element) {
      requestAnimationFrame(() => {
        if (!element.style.height) {
          element.style.height = `${element.offsetHeight}px`;
        }
      });
    },
    leave(element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.style.height = "0px";
        });
      });
    },
    afterLeave(element) {
      element.style.height = null;
    },
    toggleSubmenu(index) {
      if (this.activeSubmenu === index) {
        this.activeSubmenu = null;
      } else {
        this.activeSubmenu = index;
      }
    },
  },

  watch: {
    $route() {
      if (this.$store.themeSettingsStore.mobielSidebar) {
        this.$store.themeSettingsStore.mobielSidebar = false;
      }

      this.items.map((item) => {
        if (item.link === this.$route.name) {
          this.activeSubmenu = null;
        }
      });
    },
  },

  created() {
    const router = useRouter();
    this.items.map((item, i) => {
      item.child?.map((ci) => {
        if (ci.childlink === router.currentRoute.value.name) {
          this.activeSubmenu = i;
        }
      });
    });
  },
  // update if route chnage then activesubmenu null

  updated() {},
};
</script>
<style lang="scss">
.submenu_enter-active,
.submenu_leave-active {
  overflow: hidden;
  transition: all 0.34s linear;
}

.not-collapsed .has-icon {
  transition: all 0.34s linear;
}
.not-collapsed .has-icon {
  @apply transform rotate-180;
}

// single sidebar menu css
.single-sidebar-menu {
  @apply relative;
  .menulabel {
    @apply text-white font-thin mb-4 mt-4;
    font-family: "KantumruyPro-Bold" !important;
    color: #003a8a;
  }
  > .menu-link {
    @apply flex font-medium dark:text-slate-300 text-sm capitalize px-[10px] py-3 rounded-[4px] cursor-pointer;
    color: #003a8a;
  }
  .menu-icon {
    @apply icon-box inline-flex items-center text-white dark:text-slate-300 text-lg ltr:mr-3 rtl:ml-3;
    color: #003a8a;
  }
}
// menu item has chilren
.item-has-children {
  .menu-arrow {
    @apply h-5 w-5 text-base text-slate-300 bg-slate-100 dark:bg-[#334155] dark:text-slate-300 rounded-full flex justify-center items-center;
  }
}

// close sidebar css
.close_sidebar .menulabel {
  @apply hidden;
}

.close_sidebar:not(.sidebar-hovered) {
  .menu-arrow {
    @apply hidden;
  }
  .single-sidebar-menu {
    .text-box {
      @apply absolute left-full ml-5 w-[180px] top-0 px-4 py-3 bg-white shadow-dropdown rounded-[4px] dark:bg-slate-800 z-[999] invisible opacity-0 transition-all duration-150;
    }
    &:hover {
      .text-box {
        @apply visible opacity-100;
      }
    }
  }
  .item-has-children {
    .text-box {
      @apply hidden;
    }

    > ul {
      @apply ml-4 absolute left-full top-0 w-[230px] bg-white shadow-dropdown rounded-[4px] dark:bg-slate-800 z-[999] px-4 pt-3 transition-all duration-150 invisible opacity-0;
      display: block !important;
    }
    &:hover {
      > ul {
        @apply visible opacity-100;
      }
    }
  }
}

// active menu
.item-has-children {
  .parent_active {
    @apply bg-white;
    .icon-box,
    .menu-icon,
    .text-box {
      @apply dark:text-slate-200;
      color: #003a8a;
    }
    .menu-arrow {
      @apply bg-secondary-500 text-slate-600 text-opacity-70 bg-opacity-30 dark:text-white;
    }
  }
}
.menu-item-active {
  .menu-link {
    @apply shadow-md dark:bg-slate-700;
    .icon-box,
    .menu-icon,
    .text-box {
      @apply dark:text-slate-300;
      color: #ffffff;
    }
    background-color: #003a8a;
  }
  .menu-badge {
    @apply bg-slate-100  text-slate-900;
  }
}
.sub-menu .router-link-active {
  color: #003a8a !important;
  font-weight: 600;
}
</style>
