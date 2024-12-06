<template>
  <div>
    Testing Page
    <div>
      <Card >
       
            <Button
              icon="heroicons-outline:arrow-left"
              :text="$t('Back')"
              btnClass=" btn-primary font-normal btn-sm "
              iconClass="text-lg"
              @click="$emit(backFile())"
            />
    
      </Card>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import InputGroup from "@/components/InputGroup";
import Pagination from "@/components/Pagination";
import { MenuItem } from "@headlessui/vue";
import window from "@/mixins/window";
import { inject, ref, onMounted, watch } from "vue";
import Modal from "@/components/Modal";
import Textinput from "@/components/Textinput";
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import Switch from "@/components/Switch";
export default {
  mixins: [window],
  components: {
    Pagination,
    InputGroup,
    Dropdown,
    Icon,
    Card,
    MenuItem,
    Tooltip,
    Button,
    Modal,
    Textinput,
    VueSelect,
    vSelect,
    Switch,
  },
  setup() {
    onMounted(async () => {});
    return {};
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded;
}
</style>
