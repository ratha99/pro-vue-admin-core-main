<template>
  <div>
    <Card noborder>
      <div class="-mt-6 -mr-6 -mb-6 -ml-6">
        <div class="mx-6 my-6 md:flex items-center">
          <h6 class="flex-1 md:mb-0 mb-3">{{ $t("menu") }}</h6>
          <div
            class="md:flex md:space-x-3 items-center flex-none rtl:space-x-reverse"
            :class="window.width < 768 ? 'space-x-rb' : ''"
          >
            <InputGroup
              v-model="searchTerm"
              placeholder="Search"
              type="text"
              prependIcon="heroicons-outline:search"
              merged
              trigger="enter"
            />
            <Button
              v-if="perAction.add"
              icon="heroicons-outline:plus-sm"
              :text="$t('create_new')"
              btnClass=" btn-primary font-normal btn-sm "
              iconClass="text-lg"
              @click="menuModal(null)"
            />
          </div>
        </div>
        <vue-good-table
          :columns="columns"
          styleClass="vgt-table bordered centered lesspadding2 table-head"
          mode="remote"
          :rows="rows"
          :pagination-options="{
            enabled: true,
            perPage: perpage,
          }"
          :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
          :sort-options="{
            enabled: false,
          }"
        >
          <template v-slot:table-row="props">
            <span v-if="props.column.field == 'action'">
              <div class="flex justify-center space-x-3 rtl:space-x-reverse">
                <Tooltip v-if="perAction.edit" placement="top" arrow theme="success-500">
                  <template #button>
                    <div
                      class="action-btn btn-outline-success"
                      @click="menuModal(props.row)"
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </div>
                  </template>
                  <span>{{ $t("edit") }}</span>
                </Tooltip>
                <Tooltip v-if="perAction.delete" placement="top" arrow theme="danger-500">
                  <template #button>
                    <div
                      class="action-btn btn-outline-danger"
                      @click="deleteMenuModal(props.row)"
                    >
                      <Icon icon="heroicons:trash" />
                    </div>
                  </template>
                  <span>{{ $t("delete") }}</span>
                </Tooltip>
              </div>
            </span>
          </template>
          <template #pagination-bottom="props">
            <div class="py-4 px-3 flex justify-center">
              <Pagination
                :total="totalRecords"
                :current="current"
                :per-page="perpage"
                :pageRange="pageRange"
                @page-changed="current = $event"
                :pageChanged="props.pageChanged"
                :perPageChanged="props.perPageChanged"
                enableSearch
              >
                >
              </Pagination>
            </div>
          </template>
        </vue-good-table>
      </div>
    </Card>

    <Modal
      :title="modalTitle"
      label="Modal title"
      :activeModal="show"
      @close="show = false"
      :themeClass="modalHeader"
    >
      <form ref="form" @submit.prevent="onSubmit" class="space-y-4">
        <Textinput
          :label="$t('menu_kh')"
          type="text"
          placeholder=""
          name="nameKH"
          v-model="nameKH"
          :error="nameKhError"
        />
        <Textinput
          :label="$t('menu_en')"
          type="text"
          placeholder=""
          name="nameEN"
          v-model="nameEN"
          :error="nameEnError"
        />
        <div class="text-right">
          <Button :text="$t('save')" :btnClass="modalButton"></Button>
        </div>
      </form>
    </Modal>
    <Modal
      :title="modalTitle"
      :activeModal="showDelete"
      @close="showDelete = false"
      :themeClass="modalHeader"
    >
      <h4 class="font-medium text-lg mb-3 text-slate-900">
        {{ $t("delete_confirm_message") }}
      </h4>
      <div class="text-right">
        <Button
          :text="$t('o_k')"
          btnClass="btn-danger"
          @click="deleteRole()"
        ></Button>
      </div>
    </Modal>
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
import { inject, ref, onMounted, watch, triggerRef } from "vue";
import Modal from "@/components/Modal";
import Textinput from "@/components/Textinput";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { perSlug } from "../../../constant/permission";

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
    perSlug,
  },
  setup() {
    const services = inject("services");
    const show = ref(false);
    const showDelete = ref(false);
    const { t } = useI18n();
    const rows = ref([]);
    const perpage = ref(10);
    const current = ref(1);
    const searchTerm = ref("");
    const totalRecords = ref(0);
    const pageRange = ref(5);
    const manuID = ref(0);
    const toast = useToast();
    const modalHeader = ref("");
    const modalTitle = ref("");
    const modalButton = ref("");
    const perAction = ref({
      add: services.checkPermission(perSlug[0].ADD_NEW_MENU),
      edit: services.checkPermission(perSlug[0].EDIT_MENU),
      delete: services.checkPermission(perSlug[0].DELETE_MENU),
    })

    const getMenu = async () => {
      await services
        .get(
          `form?perPage=${perpage.value}&page=${current.value}&search=${searchTerm.value}`
        )
        .then((response) => {
          rows.value = response.data.data;
          totalRecords.value = response.data.total;
        })
        .catch((error) => console.log(error));
    };

    // Define a validation schema
    const schema = yup.object({
      nameKH: yup.string().required("Name (KH) is a required field"),
      nameEN: yup.string().required("Name (En) is a required field"),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: nameKH, errorMessage: nameKhError } = useField("nameKH");
    const { value: nameEN, errorMessage: nameEnError } = useField("nameEN");

    const menuModal = (row) => {
      resetForm();
      modalHeader.value =
        "bg-primary-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("create_new");
      modalButton.value = "btn inline-flex justify-center btn-primary";
      manuID.value = 0;
      if (row != null) {
        modalHeader.value =
          "bg-success-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
        modalTitle.value = t("edit");
        modalButton.value = "btn inline-flex justify-center btn-success";

        manuID.value = row.id;
        nameKH.value = row.name_kh;
        nameEN.value = row.name_en;
      }
      show.value = !show.value;
    };

    const deleteMenuModal = (row) => {
      manuID.value = row.id;
      modalHeader.value =
        "bg-danger-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("delete");
      modalButton.value = "btn inline-flex justify-center btn-danger";
      showDelete.value = !showDelete.value;
    };

    const deleteRole = () => {
      services
        .remove("form", manuID.value)
        .then((response) => {
          showDelete.value = !showDelete.value;
          console.log(1111);
          toast.success("Success", {
            timeout: 2000,
          });
          manuID.value = 0;
          getMenu();
        })
        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
          showDelete.value = !showDelete.value;
        });
    };

    const onSubmit = handleSubmit((values, { resetForm }) => {
      services
        .post("form/store", {
          name_kh: values.nameKH,
          name_en: values.nameEN,
          id: manuID.value,
        })

        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          show.value = !show.value;
          resetForm();
          getMenu();
        })

        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
          show.value = !show.value;
        });
    });

    onMounted(() => {
      getMenu();
    });

    watch([current, searchTerm], async () => {
      getMenu();
    });

    return {
      totalRecords,
      current,
      perpage,
      pageRange,
      searchTerm,
      columns: [
        {
          label: t("menu_kh"),
          field: "name_kh",
        },
        {
          label: t("menu_en"),
          field: "name_en",
        },
        {
          label: t("action"),
          field: "action",
        },
      ],
      getMenu,
      rows,
      show,
      showDelete,
      nameKH,
      nameKhError,
      nameEN,
      nameEnError,
      manuID,
      menuModal,
      deleteMenuModal,
      deleteRole,
      onSubmit,
      resetForm,
      modalHeader,
      modalTitle,
      modalButton,
      perAction,
    };
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded;
}
</style>
