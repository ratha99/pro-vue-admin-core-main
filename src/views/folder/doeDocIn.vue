<template>
  <div class="space-y-5 profile-page">
    
    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12">
        <Card :title="$t('Document-In')">
          
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
        dob: userData.dob,
        phone: userData.phone,
        email: userData.email,
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
