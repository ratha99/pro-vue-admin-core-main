<template>
  <Dropdown classMenuItems=" w-[180px] top-[58px] ">
    <div class="flex items-center">
      <div class="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div class="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img :src="urlProfile" alt="" class="block w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <div
        class="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span class="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">{{ fullName }}</span>
        <span class="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
    <template #menus>
      <MenuItem v-slot="{ active }" v-for="(item, i) in ProfileMenu" :key="i">
      <div type="button" :class="`${active
          ? 'bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 text-slate-900 dark:text-slate-300'
          : 'text-slate-600 dark:text-slate-300'
        } `"
        class="inline-flex items-center space-x-2 rtl:space-x-reverse w-full px-4 py-2 first:rounded-t last:rounded-b font-normal cursor-pointer"
        @click="item.link()">
        <div class="flex-none text-lg">
          <Icon :icon="item.icon" />
        </div>
        <div class="flex-1 text-sm">
          {{ item.label }}
        </div>
      </div>
      </MenuItem>
    </template>
  </Dropdown>
</template>
<script>
import { MenuItem } from "@headlessui/vue";
import Dropdown from "@/components/Dropdown";
import Icon from "@/components/Icon";
import profileImg from "@/assets/images/avatar/avatar.png"
import { inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
export default {
  components: {
    Icon,
    Dropdown,
    MenuItem,
  },
  setup() {
    const services = inject('services')
    const { t } = useI18n()
    const router = useRouter()
    const userDetail = ref([])
    const fullName = ref("")
    const urlProfile = ref(profileImg)

    const ProfileMenu = ref([
      {
        label: t("profile"),
        icon: "heroicons-outline:user",
        link: () => {
          router.push("profile");
        },
      },
      {
        label: t("change_password"),
        icon: "heroicons-outline:key",
        link: () => {
          router.push("change_password");
        },
      },
      {
        label: t("logout"),
        icon: "heroicons-outline:login",
        link: () => {
          localStorage.removeItem("activeUser");
          // localStorage.removeItem("userData");
          router.push("/login");
          window.location.reload();
        },
      },
    ])

    const getUserProfile = async () => {
      userDetail.value = await services.getUserDetail()
      if (userDetail.value != null) {
        fullName.value = userDetail.value.firstname
        //var currentDate = new Date().toISOString().slice(0, 10);
        //var profileExpired = new Date(userDetail.value.profile_expired).toISOString().slice(0, 10);

        // if(parseInt(currentDate.replace(/-/g,""),10) >= parseInt(profileExpired.replace(/-/g,""),10)){
        //   await services
        //     .get("user_role_permission", {})
        //     .then((response) => {
        //       localStorage.setItem("userRolePermission", JSON.stringify(response.data));
        //       if(response.data.user.user_detail.profile != null && response.data.user.user_detail.profile != ""){
        //         getBase64FromUrl(response.data.user.user_detail.profile).then((response) => {
        //           urlProfile.value = response
        //         })
        //       }
        //     })
        //     .catch((e) => {
        //       console.log(e);
        //     });
        // } else {
        //   /** Convert url to base64 */
        //   if(userDetail.value.profile != ""){
        //     getBase64FromUrl(userDetail.value.profile).then((response) => {
        //       urlProfile.value = response
        //     })
        //   }
        // }

      }
    }

    const getBase64FromUrl = async (url) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        }
      });
    }

    onMounted(async () => {
      await getUserProfile()
    })

    return {
      getUserProfile,
      userDetail,
      fullName,
      profileImg,
      urlProfile,
      ProfileMenu,
      getBase64FromUrl,
    }
  }
};
</script>
<style lang=""></style>
