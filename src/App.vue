<template>
  <router-view />
</template>

<script>
import { useThemeSettingsStore } from "@/store/themeSettings";

export default {
  mounted() {
    this.$store.themeSettingsStore = useThemeSettingsStore();
    if (localStorage.i18n === undefined) {
      localStorage.setItem("i18n", "kh");
    } else {
      this.$i18n.locale = localStorage.i18n;
    }

  },
};
</script>

<style>
@font-face {
  font-family: "Times New Roman";
  src: url(@/assets/fonts/TimesNewRoman.ttf);
}
@font-face {
  font-family: "KhmerOSMoul";
  src: url("@/assets/fonts/KhmerOSMuol.ttf");
}
@font-face {
  font-family: "KhmerOSMoulLight";
  src: url("@/assets/fonts/KhmerOSMuollight.ttf");
}
@font-face {
  font-family: "KantumruyPro";
  src: url("@/assets/fonts/KantumruyPro-Regular.ttf");
}

@font-face {
  font-family: "KantumruyPro-Bold";
  src: url("@/assets/fonts/KantumruyPro-Bold.ttf");
}

:lang(kh) 	{
  font-family: "KantumruyPro" !important;
}

:lang(en) 	{
  font-family: "Times New Roman" !important;
}

</style>
