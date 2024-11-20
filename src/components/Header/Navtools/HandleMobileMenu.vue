<template>
  <div
    class="cursor-pointer text_primary_app dark:text-white text-2xl"
    @click="toggleMsidebar"
  >
    <Icon icon="heroicons-outline:menu-alt-3" />
  </div>
</template>
<script setup>
import Icon from "@/components/Icon";
import { useThemeSettingsStore } from "@/store/themeSettings";

const themeSettingsStore = useThemeSettingsStore()

// dispath toggleMsidebar
const toggleMsidebar = () => {
  themeSettingsStore.toggleMsidebar()
};
</script>
<style lang="scss"></style>
