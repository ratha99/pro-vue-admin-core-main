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
              icon="heroicons-outline:plus-sm"
              :text="$t('create_new')"
              btnClass=" btn-primary font-normal btn-sm "
              iconClass="text-lg"
              @click="roleModal(null)"
            />
          </div>
        </div>
            <!-- mode="remote" property to use external search-->
        <vue-good-table
          :columns="columns"
          styleClass="vgt-table bordered centered lesspadding2 table-head"
        
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
          name="rolenameKh"
          v-model="rolenameKh"
          :error="roleError"
        />
        <Textinput
          :label="$t('role_en')"
          type="text"
          placeholder=""
          name="description"
          v-model="description"
        />
        <VueSelect :label="$t('permission')" :error="permissionError">
          <vSelect
            :options="listPermission"
            :reduce="(options) => options.value"
            multiple
            name="permissionID"
            v-model="permissionID"
          />
        </VueSelect>
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
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
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
    VueSelect,
    vSelect,
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

    const listPermission = ref([]);
    // const permissionID = ref("");

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
          `roles`
        )
        .then((response) => {
          rows.value = response.data;
          totalRecords.value = response.data.length;
        })
        .catch((error) => console.log(error));
    };

    // Define a validation schema
    const schema = yup.object({
      rolenameKh: yup.string().required("Name (KH) is a required field"),
      permissionID: yup.mixed().nullable().required(t("please_choose_one")),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: rolenameKh, errorMessage: roleError } = useField("rolenameKh");
    const { value: description } = useField("description");
    const { value: permissionID, errorMessage: permissionError } = useField("permissionID");

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
        roleId.value = row._id;
        description.value = row.description;
        rolenameKh.value = row.roleName;
        permissionID.value=row.permissions;
        
      }
      show.value = !show.value;
    };

    const deleteModal = (row) => {
      modalHeader.value =
        "bg-danger-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("delete");
      modalButton.value = "btn inline-flex justify-center btn-danger";
      roleId.value = row._id;
      showDelete.value = !showDelete.value;
    };

    const deleteRole = () => {
      services
        .remove("roles", roleId.value)
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
      let url ="";
      if(roleId.value !=""){
        url = `roles/${roleId.value}`;
      } else{
        url = `roles`;
      }
      console.log("url",url)
      services
        .post(url, {
          roleName: values.rolenameKh,
          description: values.description,
          permissions: values.permissionID,
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

    const getPermission = async () => {
      listPermission.value = [];
      await services
        .get("permissions")
        .then((res) => {
          res.data.forEach((element) => {
            listPermission.value.push({
              value: element._id,
              label: element.permissionName,
            });
          });
        })
        .catch((error) => console.log(error));
    };

    onMounted(() => {
      getRole();
      getPermission();
    });
    watch([current, searchTerm], async () => {
      getRole();
    });
    return {
      getPermission,
      rolePermission,
      totalRecords,
      current,
      perpage,
      pageRange,
      searchTerm,
      columns: [
        {
          label: t("role_kh"),
          field: "roleName",
        },
        {
          label: t("description"),
          field: "description",
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
      rolenameKh,
      roleError,
      description,
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
      listPermission,
      permissionID,
      permissionError
    };
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded;
}
</style>
