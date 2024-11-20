<template>
  <div>
    <Card noborder>
      <div class="-mt-6 -mr-6 -mb-6 -ml-6">
        <div class="mx-6 my-6 md:flex items-center">
          <h6 class="flex-1 md:mb-0 mb-3">{{ $t("role") }}</h6>
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
              @click="roleModal(null)"
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
                <Tooltip
                  v-if="perAction.setRolePer"
                  placement="top"
                  arrow
                  theme="info-500"
                >
                  <template #button>
                    <div
                      class="action-btn btn-outline-info"
                      @click="rolePermission(props.row)"
                    >
                      <Icon icon="ri:list-check-3" />
                    </div>
                  </template>
                  <span> {{ $t("permission_setting") }}</span>
                </Tooltip>
                <Tooltip
                  v-if="perAction.edit"
                  placement="top"
                  arrow
                  theme="success-500"
                >
                  <template #button>
                    <div
                      class="action-btn btn-outline-success"
                      @click="roleModal(props.row)"
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </div>
                  </template>
                  <span> {{ $t("edit") }}</span>
                </Tooltip>
                <Tooltip
                  v-if="perAction.delete"
                  placement="top"
                  arrow
                  theme="danger-500"
                >
                  <template #button>
                    <div
                      class="action-btn btn-outline-danger"
                      @click="deleteModal(props.row)"
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
      :activeModal="show"
      @close="show = false"
      :themeClass="modalHeader"
    >
      <form ref="form" @submit.prevent="onSubmit" class="space-y-4">
        <Textinput
          :label="$t('role_kh')"
          type="text"
          placeholder=""
          name="nameKh"
          v-model="nameKh"
          :error="nameKhError"
        />
        <Textinput
          :label="$t('role_en')"
          type="text"
          placeholder=""
          name="nameEn"
          v-model="nameEn"
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
          :btnClass="modalButton"
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
import { inject, ref, onMounted, watch } from "vue";
import Modal from "@/components/Modal";
import Textinput from "@/components/Textinput";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
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
    const router = useRouter();
    const show = ref(false);
    const showDelete = ref(false);

    const rows = ref([]);
    const perpage = ref(10);
    const current = ref(1);
    const searchTerm = ref("");
    const totalRecords = ref(0);
    const pageRange = ref(5);

    const roleId = ref(0);
    const toast = useToast();
    const { t } = useI18n();

    const modalHeader = ref([]);
    const modalTitle = ref([]);
    const modalButton = ref([]);
    const perAction = ref({
      add: services.checkPermission(perSlug[0].ADD_NEW_ROLE),
      edit: services.checkPermission(perSlug[0].EDIT_ROLE),
      delete: services.checkPermission(perSlug[0].DELETE_ROLE),
      setRolePer: services.checkPermission(perSlug[0].SET_ROLE_PERMISSION),
    });

    const getRole = () => {
      services
        .get(
          `role?perPage=${perpage.value}&page=${current.value}&search=${searchTerm.value}`
        )
        .then((response) => {
          rows.value = response.data.data;
          totalRecords.value = response.data.total;
        })
        .catch((error) => console.log(error));
    };

    // Define a validation schema
    const schema = yup.object({
      nameKh: yup.string().required("Name (KH) is a required field"),
      nameEn: yup.string().required("Name (En) is a required field"),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: nameKh, errorMessage: nameKhError } = useField("nameKh");
    const { value: nameEn, errorMessage: nameEnError } = useField("nameEn");

    const roleModal = (row) => {
      modalHeader.value =
        "bg-primary-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("create_new");
      modalButton.value = "btn inline-flex justify-center btn-primary";
      resetForm();
      roleId.value = 0;
      if (row != null) {
        modalHeader.value =
          "bg-success-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
        modalTitle.value = t("edit");
        modalButton.value = "btn inline-flex justify-center btn-success";
        roleId.value = row.id;
        nameEn.value = row.name_en;
        nameKh.value = row.name_kh;
      }
      show.value = !show.value;
    };

    const deleteModal = (row) => {
      modalHeader.value =
        "bg-danger-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("delete");
      modalButton.value = "btn inline-flex justify-center btn-danger";
      roleId.value = row.id;
      showDelete.value = !showDelete.value;
    };

    const deleteRole = () => {
      services
        .remove("role", roleId.value)
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          showDelete.value = !showDelete.value;
          roleId.value = 0;
          getRole();
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
        .post("role/store", {
          name_kh: values.nameKh,
          name_en: values.nameEn,
          id: roleId.value,
        })
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          show.value = !show.value;
          resetForm();
          getRole();
        })
        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
          show.value = !show.value;
        });
    });

    const rolePermission = (row) => {
      router.push({
        path: "/role-permission",
        name: "role_permission",
        params: {
          id: row.id,
        },
      });
    };

    onMounted(() => {
      getRole();
    });
    watch([current, searchTerm], async () => {
      getRole();
    });
    return {
      rolePermission,
      totalRecords,
      current,
      perpage,
      pageRange,
      searchTerm,
      columns: [
        {
          label: t("role_kh"),
          field: "name_kh",
        },
        {
          label: t("role_en"),
          field: "name_en",
        },
        {
          label: t("action"),
          field: "action",
        },
      ],
      getRole,
      rows,
      show,
      showDelete,
      nameKh,
      nameKhError,
      nameEn,
      nameEnError,
      roleId,
      roleModal,
      deleteModal,
      deleteRole,
      onSubmit,
      resetForm,
      modalHeader,
      modalTitle,
      modalButton,
      router,
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
