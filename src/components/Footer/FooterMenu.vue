<template lang="">
  <div
    class="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4"
  >
    <!-- <router-link :to="{ name: 'chat' }" v-slot="{ isActive }">
      <span
        class="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
        :class="[
          isActive ? 'text-primary-500' : 'dark:text-white text-slate-900',
        ]"
        ><Icon icon="heroicons-outline:mail" />
        <span
          class="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]"
          >10</span
        >
      </span>
      <span
        class="block text-[11px]"
        :class="[
          isActive ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300',
        ]"
        >Messages</span
      >
    </router-link> -->
    <router-link
      v-slot="{ isActive }"
      :to="{ name: 'profile' }"
      class="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
    >
      <div
        class="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow"
      >
        <img
          :src= "urlProfile"
          alt=""
          class="w-full h-full rounded-full"
          :class="[
            isActive
              ? 'border-2 border-primary-500'
              : 'border-2 border-slate-100',
          ]"
        />
      </div>
    </router-link>
    <!-- <router-link :to="{ name: 'notifications' }" v-slot="{ isActive }">
      <span
        class="relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
        :class="[
          isActive ? 'text-primary-500' : 'dark:text-white text-slate-900',
        ]"
        ><Icon icon="heroicons-outline:bell" />
        <span
          class="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]"
          >2</span
        >
      </span>
      <span
        class="block text-[11px]"
        :class="[
          isActive ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300',
        ]"
        >Notifications</span
      >
    </router-link> -->
  </div>
</template>
<script>
import Icon from "@/components/Icon";
import profileImg from "@/assets/images/avatar/avatar.png"
import { inject, onMounted, ref } from 'vue';
export default {
  components: {
    Icon,
  },
  setup(){
    const services = inject('services')
    const userDetail = ref([])
    const urlProfile = ref(profileImg)

    const getUserProfile = async () => {
      userDetail.value = await services.getUserDetail()
      if(userDetail.value != null){
        var currentDate = new Date().toISOString().slice(0, 10);
        var profileExpired = new Date(userDetail.value.profile_expired).toISOString().slice(0, 10);

        if(parseInt(currentDate.replace(/-/g,""),10) >= parseInt(profileExpired.replace(/-/g,""),10)){
          await services
            .get("user_role_permission", {})
            .then((response) => {
              localStorage.setItem("userRolePermission", JSON.stringify(response.data));
              if(response.data.user.user_detail.profile != null && response.data.user.user_detail.profile != ""){
                getBase64FromUrl(response.data.user.user_detail.profile).then((response) => {
                  urlProfile.value = response
                })
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          /** Convert url to base64 */
          if(userDetail.value.profile != ""){
            getBase64FromUrl(userDetail.value.profile).then((response) => {
              urlProfile.value = response
            })
          }
        }

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

    return{
      getUserProfile,
      userDetail,
      profileImg,
      urlProfile,
      getBase64FromUrl,
    }
  }
};
</script>
<style lang="scss"></style>
