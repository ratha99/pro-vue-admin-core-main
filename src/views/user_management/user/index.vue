<template>
  <div>
    <Card noborder>
      <div class="-mt-6 -mr-6 -mb-6 -ml-6">

      <div class="mx-6 my-6 md:flex items-center">
        <h6 class="flex-1 md:mb-0 mb-3">{{ $t('user') }}</h6>
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
          />
          <Button
            
            icon="heroicons-outline:plus-sm"
            :text="$t('create_new')"
            btnClass=" btn-primary font-normal btn-sm "
            iconClass="text-lg"
            @click="adduser()"
          />
        </div>
      </div>

      <vue-good-table
        :columns="columns" styleClass="vgt-table bordered centered lesspadding2 table-head"
        :rows="rows"
        :pagination-options="{
          enabled: true,
          perPage: perpage,
        }" :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
        :sort-options="{
          enabled: false,
        }">
        <template v-slot:table-row="props">
          <span v-if="props.column.field == 'action'">
            <div class="flex justify-center space-x-3 rtl:space-x-reverse">
              <Tooltip placement="top" arrow theme="info-500">
                <template #button>
                  <div class="action-btn btn-outline-info" @click="roleModal(props.row)">
                    <Icon icon="grommet-icons:user-settings" />
                  </div>
                </template>
                <span>{{ $t("role") }}</span>
              </Tooltip>
              <Tooltip  placement="top" arrow theme="warning-500">
                <template #button>
                  <div class="action-btn btn-outline-warning" @click="pwdModal(props.row)">
                    <Icon icon="material-symbols:history" />
                  </div>
                </template>
                <span>{{ $t("change_password") }}</span>
              </Tooltip>
              <Tooltip placement="top" arrow theme="success-500" >
                <template #button>
                  <div class="action-btn btn-outline-success" @click="editUser(props.row)">
                    <Icon icon="heroicons:pencil-square" />
                  </div>
                </template>
                <span>{{ $t("edit") }}</span>
              </Tooltip>
            </div>
          </span>
          <span v-if="props.column.field == 'status'">
            <div class="flex justify-center space-x-3 rtl:space-x-reverse">
              <Switch
                v-if="props.row.active == 1"
                active
                class="mb-5"
                activeClass="bg-primary-500"
                badge
                @click="updateStatus(props.row)"
              />
              <Switch
                v-else
                class="mb-5"
                activeClass="bg-primary-500"
                badge
                @click="updateStatus(props.row)"
              />
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
              enableSearch>
              >
            </Pagination>
          </div>
        </template>
      </vue-good-table>
    </div>
      
    </Card>
  <ChangePwd @submit="onPwdSubmit" :isOpen="isOpenPwd" :userId="userId" />
  <UserRole @submit="onUserSubmit" :isOpen="isOpenUser" :userId="userId" :roleIds="roleIds" />
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
import { inject, ref,onMounted, watch  } from "vue";
import Modal from "@/components/Modal";
import Textinput from "@/components/Textinput";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import ChangePwd from "./change_password.vue"
import UserRole from "./user_role.vue"
import Switch from '@/components/Switch';
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
    VueSelect,
    vSelect,
    ChangePwd,
    UserRole,
    Switch,
    perSlug,
  },
  setup(){
    const services = inject('services');
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter()
    const toast = useToast();

    const rows = ref([]);
    const perpage = ref(10);
    const current = ref(1);
    const searchTerm = ref('');
    const totalRecords = ref(0);
    const pageRange = ref(5);

    const isOpenPwd  = ref(false);
    const isOpenUser  = ref(false);
    const userId = ref(0);
    const roleIds = ref([])
    const perAction = ref({
      status: services.checkPermission(perSlug[0].EDIT_USER_STATUS_ACTIVE_INACTIVE) ? false : true,
      add: services.checkPermission(perSlug[0].ADD_NEW_USER),
      edit: services.checkPermission(perSlug[0].EDIT_USER),
      changePwd: services.checkPermission(perSlug[0].CHANGE_PASSWORD_USER),
      setRole: services.checkPermission(perSlug[0].SET_USER_ROLE),
    })

    const getUser = async () =>{
      services.get(`users`)
      .then(response => {
        // console.log(response.data)
        rows.value = response.data;
        totalRecords.value = response.data.length;
      })
      .catch(error => console.log(error))
    }

    const adduser = () => {
      router.push({name: 'adduser'})
    }

    const editUser = (row) => {
      router.push({
        path: '/edituser',
        name: 'edituser',
        params: {
          id: row._id
         
        }
      })
    }

    const roleModal = async (row) => {
     
      userId.value = row._id;
      // console.log(row.rol);
      // console.log(row.role.roleName);
      if (row.role!= null){
        roleIds.value = row.role._id;
      }
      
      isOpenUser.value = ! isOpenUser.value
    }

    const pwdModal = (row) => {
      userId.value = row._id
      isOpenPwd.value = ! isOpenPwd.value
    }

    const onPwdSubmit = () => {
      isOpenPwd.value = ! isOpenPwd.value
    }

    const onUserSubmit = () => {
      isOpenUser.value = ! isOpenUser.value
      getUser()
    }

    const updateStatus = async (row) => {
      await services.update(`users/switchstatus/${row._id}`)
      .then(res => {
        toast.success("Success", {
            timeout: 2000,
        });
      })
      .catch(error => console.log(error))
    }

    onMounted(async () => {
      await getUser()
    })
    watch([current, searchTerm], async () => {
      console.log("searchTerm", searchTerm);
      getUser();
    })
    return {
      totalRecords,
      current,
      perpage,
      pageRange,
      searchTerm,
      columns: [
        {
          label: t("first name"),
          field: "firstname",
        },
        {
          label: t("last name"),
          field: "lastname",
        },
        {
          label: t("gender"),
          field: "gender",
        },
        {
          label: t("phone"),
          field: "phone",
        },
        {
          label: t("email"),
          field: "email",
        },
        {
          label: t("action"),
          field: "action",
        },
        {
          label: t("status"),
          field: "status",
        },
      ],
      adduser,
      getUser,
      editUser,
      rows,
      route,
      router,
      roleModal,
      userId,
      roleIds,
      pwdModal,
      onPwdSubmit,
      onUserSubmit,
      isOpenPwd,
      isOpenUser,
      updateStatus,
      perAction,
    }
  },
};
</script>
<style lang="scss" scoped>
.action-btn {
  @apply h-6 w-6 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 rounded;
}
</style>
