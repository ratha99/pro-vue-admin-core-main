<template>
  <div class="space-y-5 profile-page">
    <div
      class="profiel-wrap px-[35px] pb-5  pt-5 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
      <div class="bg-slate-200 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg">
      </div>
      <div class="profile-box flex-none md:text-start text-center">
        <div class="md:flex items-end md:space-x-6 rtl:space-x-reverse">
          <div class="flex-none">
            <div
              class="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
              <img :src="urlProfile" alt="" class="w-full h-full object-cover rounded-full" />
              <!-- <router-link
                to="/app/profile-setting"
                class="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                ><Icon icon="heroicons:pencil-square" />
              </router-link> -->
            </div>
          </div>
          <div class="flex-1">
            <div class="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
              {{ userProfile.firstname }} {{userProfile.lastname}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12">
        <Card :title="$t('user_info')">
          <ul class="list space-y-5">
            <li class="flex space-x-3 rtl:space-x-reverse">
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('date_of_birth') }}
                </div>
                {{ userProfile.dob }}
              </div>
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('gender') }}
                </div>
                {{ userProfile.gender }} 
              </div>
            </li>
            <li class="flex space-x-3 rtl:space-x-reverse">
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('user_email') }}
                </div>
                {{ userProfile.email }}
              </div>
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('organization') }}
                </div>
                {{ userProfile.organization }} 
              </div>
            </li>
             <li class="flex space-x-3 rtl:space-x-reverse">
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('position') }}
                </div>
                {{ userProfile.position }}
              </div>
              <div class="flex-1">
                <div class="uppercase text-xs text-slate-500 dark:text-slate-300 mb-2 leading-[5px]">
                  {{ $t('phone') }}
                </div>
                {{ userProfile.phone }} 
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import { onMounted, ref } from 'vue';
import profileImg from "@/assets/images/avatar/avatar.png"
import moment from 'moment';
export default {
  components: {
    Card,
    Icon,
  },
  setup() {
    const userProfile = ref({})
    const urlProfile = ref(profileImg)
    const spLevelOption = ref(
      {
        "01" : "ខេត្ត/ក្រុង",
        "02" : "ខណ្ឌ/ស្រុក",
        "03" : "សង្កាត់/ឃុំ",
        "04" : "ភូមិ/ឃុំ",
      }
    )

    const getUserProfile = async () => {
      let userData = JSON.parse(localStorage.getItem("userData"));
      userProfile.value = {
        _id: userData._id,
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        dob:moment(userData.dob).format('DD/MM/YYYY'),
        gender:userData.gender,
        email: userData.email,
        phone: userData.phone,
        organization: userData.organization,
        position:userData.position,
      }

      if (userData.user.user_detail != null) {
        if (userData.user.user_detail.profile != "") {
          getBase64FromUrl(userData.user.user_detail.profile).then((response) => {
            urlProfile.value = response
          })
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

    return {
      spLevelOption,
      userProfile,
      urlProfile,
      getUserProfile,
      getBase64FromUrl,
    }
  }
};
</script>
<style lang="scss" scoped></style>
