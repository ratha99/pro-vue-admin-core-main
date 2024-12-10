<template>
  <div> 
    <Card noborder>
      <div class="-mt-6 -mr-6 -mb-6 -ml-6">
        <div class="mx-6 my-6 md:flex items-center">
          <h6 class="flex-1 md:mb-0 mb-3">{{ $t("permission_setting") }}</h6>
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
              @click="permissionModal(null)"
            />
          </div>
        </div>
         <!-- mode="remote" property to use external search -->
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
                <Tooltip placement="top" arrow theme="success-500">
                  <template #button>
                    <div
                      class="action-btn btn-outline-success"
                      @click="permissionModal(props.row)"
                    >
                      <Icon icon="heroicons:pencil-square" />
                    </div>
                  </template>
                  <span>{{ $t("edit") }}</span>
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
      label="Modal Create"
      :activeModal="show"
      @close="show = false"
      :themeClass="modalHeader"
    >
      <form ref="form" @submit.prevent="onSubmit" class="space-y-4">
        <Textinput
          :label="$t('permission_kh')"
          type="text"
          placeholder=""
          name="nameKH"
          v-model="nameKH"
          :error="nameKhError"
        />
        <Textinput
          :label="$t('remark_slug')"
          type="text"
          placeholder=""
          name="slug"
          v-model="slug"
          :error="slugError"
        />
        <Textinput
          :label="$t('description')"
          type="text"
          placeholder=""
          name="desc"
          v-model="desc"
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
import Select from "@/components/Select";
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
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
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
    Select,
    Modal,
    Textinput,
    VueSelect,
    vSelect,
    perSlug,
  },

  setup() {
    const services = inject("services");
    const showDelete = ref(false);
    const show = ref(false);
    const rows = ref([]);
    const perpage = ref(10);
    const current = ref(1);
    const searchTerm = ref("");
    const totalRecords = ref(0);
    const pageRange = ref(5);
    const toast = useToast();
    const { t } = useI18n();
    const modalHeader = ref("");
    const modalTitle = ref("");
    const modalButton = ref("");
    const listMenu = ref([]);
    const perAction = ref({
      
    })

    const listPermissionActionSelect = ref([
      {
        value: "1",
        label: t("view"),
      },
      {
        value: "2",
        label: t("add"),
      },
      {
        value: "3",
        label: t("edit"),
      },
      {
        value: "4",
        label: t("delete"),
      },
      {
        value: "5",
        label: t("other"),
      },
    ]);

    const getMenu = async () => {
      listMenu.value = [];
      await services
        .get("form_all")
        .then((res) => {
          res.data.forEach((element) => {
            listMenu.value.push({
              value: element.id,
              label: element.name_kh,
            });
          });
        })
        .catch((error) => console.log(error));
    };

    const getPermission = () => {
      services
        .get(
          `permissions`
        )
        .then((response) => {
          rows.value = response.data;
          totalRecords.value = response.data.length;
        })
        .catch((error) => console.log(error));
    };

    // Define a validation schema
    const schema = yup.object({
      nameKH: yup.string().required("Name (KH) is a required field"),
      slug: yup.string().required("slug (En) is a required field"),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields
    const permissionID = ref(0);
    const { value: desc } = useField("desc");
    const { value: nameKH, errorMessage: nameKhError } = useField("nameKH");
    const { value: slug, errorMessage: slugError } = useField("slug");

    const permissionModal = (row) => {
      modalTitle.value = t("create_new");
      modalHeader.value =
        "bg-primary-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalButton.value = "btn inline-flex justify-center btn-primary";
      if (row != null) {
        modalTitle.value = t("edit");
        modalHeader.value =
          "bg-success-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
        modalButton.value = "btn inline-flex justify-center btn-success";
      }

      resetForm();
      permissionID.value = 0;
      if (row != null) {
        permissionID.value = row._id;
        nameKH.value = row.permissionName;
        desc.value=row.description;
        slug.value = row.slug;
      }
      show.value = !show.value;
    };

    const deleteModal = (row) => {
      modalHeader.value =
        "bg-danger-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      modalTitle.value = t("delete");
      modalButton.value = "btn inline-flex justify-center btn-danger";
      permissionID.value = row._id;
      showDelete.value = !showDelete.value;
    };

    const deleteRole = () => {
      services
        .remove("permissions/", permissionID.value)
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          showDelete.value = !showDelete.value;
          permissionID.value = "";
          getPermission();
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
      if(permissionID.value !=""){
        url = `permissions/${permissionID.value}`;
        
      } else{
        url = `permissions`;
      }
      services
        .post(url, {
          permissionName: values.nameKH,
          slug: values.slug,
          description: values.desc,
        })

        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          show.value = !show.value;
          resetForm();
          getPermission();
        })

        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
          show.value = !show.value;
        });
    });

    onMounted(() => {
      getPermission();
    });

    watch([current, searchTerm], async () => {
      getPermission();
    });

    return {
      deleteRole,
      showDelete,
      deleteModal,
      totalRecords,
      current,
      perpage,
      pageRange,
      searchTerm,
      columns: [
        {
          label: t("menu_kh"),
          field: "permissionName",
        },
      
       
        {
          label: t("remark_slug"),
          field: "slug",
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
      rows,
      show,
      getPermission,
      permissionModal,
      onSubmit,
      resetForm,
      modalHeader,
      modalTitle,
      modalButton,
      listMenu,
      nameKH,
      nameKhError,
      slug,
      slugError,
      desc,
      listPermissionActionSelect,
      perAction,
    };
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded;
  .vgt-table th.line-numbers,
  .vgt-table th.vgt-checkbox-col {
    background-color: unset !important;
  }
}
</style>
