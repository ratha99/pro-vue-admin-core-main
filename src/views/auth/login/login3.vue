<template>
  <!-- <div class="loginwrapper bg-cover bg-no-repeat bg-center" :style="{
    backgroundImage: 'url(' + loginBg + ')',
  }"> -->
  <div class="loginwrapper bg-cover bg-no-repeat bg-center">
    <div class="lg-inner-column">
      <div class="left-columns lg:w-1/2 lg:block hidden">
        <div class="logo-box-3">
          <router-link to="/" class="">
            <img :src="logoWhite" alt="" class="max-w-[256px]"/>
          </router-link>
        </div>
      </div>
      <div class="lg:w-1/2 w-full flex flex-col items-center justify-center">
        <div class="auth-box-3">
          <div class="mobile-logo text-center mb-6 lg:hidden block">
            <router-link to="/"><img :src="logo" alt="" class="max-h-[128px]" /></router-link>
          </div>
          <div class="text-center 2xl:mb-10 mb-10">
            <p class="font-medium app_title">
              {{ $t("application_title") }}
            </p>
          </div>
          <Signin />
          <!-- <div
            className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6"
          >
            <div
              className=" absolute inline-block  bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal "
            >
              Or continue with
            </div>
          </div>
          <div class="max-w-[242px] mx-auto mt-8 w-full">
            <Social />
          </div> -->

          <div class="font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 text-sm flex items-center justify-center">
            <Icon icon="uil:copyright" class="mr-1" /> {{ $t("copy_right") }}
          </div>
        </div>
        <div class="auth-footer mt-4"> V 1.0.0 </div>
      </div>
    </div>
  </div>
</template>
<script>
import Signin from "../common/Signin";
import Social from "../common/Social";
import loginBg from "@/assets/images/all-img/page-bg.png";
import logoWhite from "@/assets/images/logo/mptc_logo.png";
import logo from "@/assets/images/logo/mptc_logo.png";
import Icon from "@/components/Icon";

export default {
  data() {
    return {
      logoWhite,
      logo,
      loginBg,
    };
  },
  components: {
    Social,
    Signin,
    Icon,
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    if (user) {
      this.$router.push("/app/home");
    }
  },
};
</script>
<style lang="scss">
.app_title {
  font-family: "KhmerOSMoulLight" !important;
  color: #003A8A !important;
  font-size: 20px;
}
</style>
