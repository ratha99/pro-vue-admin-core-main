<template>
  <div>

    <ErrorBoundary>
      <!-- <Card>
      <div>
        <h2>PDF</h2>
        <div v-if="loading">Loading PDF...</div>
        <div v-if="error" style="color: red;">{{ error }}</div>
        <PDFViewer :src="pdfUrl" v-if="pdfUrl" :page="1" :scale="1.5" :width="'100%'" :height="'500px'">
          <template #downloadTool="{ onClick }">
            <button @click="onClick">download</button>
          </template>
</PDFViewer>
</div>
</Card> -->
      <!-- Delete Model -->
      <Modal :title="$t('delete')" :activeModal="showDelete" @close="showDelete = false" :themeClass="modalHeader">
        <h4 class="font-medium text-lg mb-3 text-slate-900">
          {{ $t("delete_confirm_message") }}
        </h4>
        <div class="text-right">
          <Button :text="$t('o_k')" :btnClass="modalButton" @click="deleteFile()"></Button>
        </div>
      </Modal>
      <!-- Create Model -->
      <Modal :title="$t('Document-Out-Create')" label="Modal Create" :activeModal="show" @close="show = false">
        <form @submit.prevent="uploadFile" class="space-y-4">
          <Textinput :label="$t('Document No')" name="num" type="text" :placeholder="$t('Document No')" v-model="num"
            :error="numError" />
          <br>
          <Textarea :label="$t('Title')" name="title" :placeholder="$t('Title')" v-model="title" :error="titleError" />
          <br>

          <Fileinput :label="$t('Document')" @change="onFileChange" accept="application/pdf" required />
          <!-- <vue-file-agent 
      v-model="files"
      
      @input="onFilesChange"
    >
      <template #drop-label>
        Drag and drop files here or click to upload
      </template>
    </vue-file-agent> -->
          <br>

          <div class="text-right">
            <Button icon="heroicons-outline:pencil-square" :text="$t('save')"
              btnClass=" btn-success font-normal btn-sm " iconClass="text-lg"></Button>
            <Button icon="heroicons-outline:x-mark" :text="$t('close')" btnClass=" btn-warning font-normal btn-sm "
              iconClass="text-lg" @click="show = false" class="ml-4" />
          </div>
        </form>
      </Modal>
      <!--Modal Edit -->
      <Modal :title="$t('Document-In-Edit')" label="Modal Edit" :activeModal="show1" @close="show1 = false">
        <form @submit.prevent="updateFile" class="space-y-4">
          <Textinput :label="$t('Document No')" name="num" type="text" :placeholder="$t('Document No')" v-model="numEdit"
            :disabled="isDisabled" :error="numEditError" />
          <br>
          <Textarea :label="$t('Title')" name="title" :placeholder="$t('Title')" v-model="titleEdit" :disabled="isDisabled"
            :error="titleEditError" />

          <!-- <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p> -->
          <div class="text-right">
            <Button icon="heroicons-outline:pencil-square" :text="$t('save')"
              btnClass=" btn-success font-normal btn-sm " iconClass="text-lg" v-if="isVisible"></Button>
            <Button icon="heroicons-outline:pencil-square" text="Edit" btnClass=" btn-success font-normal btn-sm "
              iconClass="text-lg" @click="editFile" v-if="btnUpdate" />

            <!-- <Button icon="heroicons-outline:inbox-arrow-down" text="Update" btnClass=" btn-success font-normal btn-sm "
        iconClass="text-lg" v-if="isVisible" /> -->
            <Button icon="heroicons-outline:x-mark" text="Close" btnClass=" btn-warning font-normal btn-sm "
              iconClass="text-lg" @click="show1 = false && isDisabled" class="ml-4" />
          </div>
          <br>

          <!-- <Fileinput label="Document" @change="onFileChange" /> -->
          <br>

          <div v-if="loading" class="py-4">

            <img :src="image" v-if="image" alt="Fetched Image" style="max-width: 100%;" />
          </div>
          <div v-if="loading">Loading PDF...</div>
          <div v-if="error" style="color: red;">{{ error }}</div>
          <PDFViewer :src="pdfUrl" v-if="pdfUrl" :width="'100%'" :height="'300px'">

          </PDFViewer>


        </form>
      </Modal>

      <div class="space-y-5 profile-page">

        <div class="grid grid-cols-12 gap-6">
          <div class="lg:col-span-12 col-span-12 ">
            <Card :title="$t('Document-Out')">
              <template #header>
                <Button icon="heroicons-outline:plus-sm" :text="$t('create_new')"
                  btnClass="font-normal btn-sm  bg-cyan-800 text-white" iconClass="text-lg" @click="toggleCreate" />
              </template>
              <vue-good-table :columns="columns" :rows="files" styleClass=" vgt-table bordered centered"
                :sort-options="{ enabled: ture }" :pagination-options="{
                  enabled: true,
                  perPage: perpage,
                }" :search-options="{
                enabled: true,
                externalQuery: searchTerm,
              }" :select-options="{
                enabled: true,
                selectOnCheckboxOnly: true, // only select when checkbox is clicked instead of the row
                selectioninfoClass: 'custom-class',
                selectionText: 'rows selected',
                clearSelectionText: 'clear',
                disableSelectinfo: true, // disable the select info-500 panel on top
                selectAllByGroup: true, // when used in combination with a grouped table, add a checkbox in the header row to check/uncheck the entire group
              }">
                <template #table-row="props">
                  <span v-if="props.column.field == 'action'" class="ml-2">

                    <div class="flex justify-center space-x-3 rtl:space-x-reverse">
                      <!-- <Tooltip placement="top" arrow theme="success-500">
                      <template #button>
                        <div class="action-btn btn-outline-success" @click="PdfViewer(props.row._id)">
                          <Icon icon="heroicons:pencil-square" />
                        </div>
                      </template>
          <span>{{ $t("view") }}</span>
          </Tooltip> -->
                      <Tooltip placement="top" arrow theme="success-500">
                        <template #button>
                          <div class="action-btn btn-outline-success" @click="toggleModalEdit(props.row._id)">
                            <Icon icon="heroicons:pencil-square" />
                          </div>
                        </template>
                        <span>{{ $t("edit") }}</span>
                      </Tooltip>
                      <Tooltip placement="top" arrow theme="danger-500">
                        <template #button>
                          <div class="action-btn btn-outline-danger" @click="deleteModal(props.row._id)">
                            <Icon icon="heroicons:trash" />
                          </div>
                        </template>
                        <span>{{ $t("delete") }}</span>
                      </Tooltip>
                    </div>

                  </span>
                  <span v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </span>
                </template>

              </vue-good-table>

            </Card>
          </div>

        </div>


      </div>
    </ErrorBoundary>
  </div>
</template>



<script>
import Modal from "@/components/Modal";

import Select from "@/components/Select";
import Card from "@/components/Card";
import { useToast } from "vue-toastification";
import window from "@/mixins/window";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Fileinput from "@/components/Fileinput"
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import { useI18n } from "vue-i18n";
// import axios from "axios";
import Textinput from "@/components/Textinput";
import Textarea from "@/components/Textarea";
import { inject, onMounted, ref, watch } from 'vue';
import Tooltip from "@/components/Tooltip";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import PDFViewer from 'pdf-vue3';
import { perSlug } from "../../../constant/permission";
const apiUrl = import.meta.env.VITE_API_URL_PDF;

export default {
  components: {
    mixins: [window],
    Card,
    Icon,
    Button,
    VueGoodTable,
    Fileinput,
    Modal,
    Textinput,
    Textarea,
    Modal,
    Select,
    Tooltip,
    PDFViewer,
    perSlug

    // PdfApp,
  },
  setup() {
    const { t } = useI18n();
    // const pdfUrl = ref("");
    const pdfUrl = ref('');
    const loading = ref(false);
    const error = ref(null);

    const services = inject('services')
    const show = ref(false);
    const show1 = ref(false);
    const showDelete = ref(false);
    const toast = useToast();
    const image = ref("");
    const fileID = ref("");
    const files = ref([]);
    const btnUpdate = ref(true);
    const isVisible = ref(false);
    const isDisabled = ref(true);

    const type = ref("Out");
    const file = ref([]);
    const userRole = ref("")
    const roleId = ref("")

    const selectedFile = ref("")
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf']
    const maxSize = 2 * 1024 * 1024;// 2 MB,

    // Define a validation schema
    const schema = yup.object({
      num: yup.string().required(t("Number is a required field")),
      title: yup.string().required(t("Title is a required field")),
      numEdit: yup.string().required("Number is a required field"),
      titleEdit: yup.string().required("Title is a required field"),
    });

    const { handleSubmit } = useForm({
      validationSchema: schema,

    });
    const { value: num, errorMessage: numError } = useField("num");
    const { value: title, errorMessage: titleError } = useField("title");
    const { value: numEdit, errorMessage: numEditError } = useField("numEdit");
    const { value: titleEdit, errorMessage: titleEditError } = useField("titleEdit");
    //function
    const toggleCreate = () => {
      show.value = !show.value;
      titleEdit.value = "test";
      numEdit.value = "test";
      title.value = "";
      num.value = "";
    };
    // const getRoleId = async(userRole) =>{
    //   await services
    //     .get(
    //       `roles?roleName=DAC`
    //     )
    //     .then((response) => {
    //       userRole.value = response.data[0]._id
          
    //     })
    //     console.log(userRole.value)
    //     .catch((error) => console.log(error));
       
    // }
    const getFiles = async () => {
     
     
      const role = JSON.parse(localStorage.getItem('userData'))
      userRole.value = role.role.roleName
       const rol = role.role._id
      // console.log(userRole.value)
      //console.log(roleId)
      if (services.checkPermission(perSlug[0].ADMIN)){
        await services
        var slug= perSlug[0].DOE;
        var type=perSlug[0].OUT;
        const url = `files?type=${type}&slug=${slug}`;
        console.log("url",url)
        services.common_get(url)
        .then(response => {
          files.value = response.data
        })
        .catch(error => console.log(error))
          
      }else {    
               // Example string
        const url = `files/getfilesbyrole/${rol}?type=Out`;
        // files/getfilesbyrole/67603311ecfdda41ddf56fa1?type=Out
          
          console.log("url1",url)
        services.common_get(url)
        .then(response => {
          files.value = response.data
          console.log(response.data)
        })
        .catch(error => console.log(error))
      console.log(file.value)
      }
      console.log(file.value)
      // console.log(userRole.value)
      // 
    };
    const editFile = () => {
      isVisible.value = !isVisible.value; // Toggle visibility
      btnUpdate.value = !btnUpdate.value; // Toggle visibility
      isDisabled.value = !isDisabled.value; // Toggle visibility
    };
    const updateFile = handleSubmit(async () => {
      const ID = fileID.value
      console.log(numEdit.value)
      console.log(titleEdit.value)

      console.log(ID)
      services.update(`files/text/${ID}`,
        {
          num: numEdit.value,
          title: titleEdit.value
        })
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          show1.value = !show1.value;
          isVisible.value = !isVisible.value; // Toggle visibility
          btnUpdate.value = !btnUpdate.value; // Toggle visibility
          isDisabled.value = !isDisabled.value; // Toggle visibility

          getFiles();
        })
        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
        });
    });

    const deleteModal = (id) => {
      fileID.value = id
      showDelete.value = !showDelete.value;
    };
    const deleteFile = () => {
      services
        .remove("files", fileID.value)
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          showDelete.value = !showDelete.value;
          fileID.value = 0;
          getFiles();
        })
        .catch((e) => {
          toast.error(e, {
            timeout: 4000,
          });
          showDelete.value = !showDelete.value;
        });
    }
    const toggleModalEdit = async (id) => {
      loading.value = true
      image.value = ""
      pdfUrl.value = ""
      fileID.value = id
      show1.value = !show1.value;
      //get data from file
      try {
        const response = await services.get(`files/text/${id}`)
        const fileText = response.data
        numEdit.value = fileText.num
        titleEdit.value = fileText.title
      } catch (error) {
        console.log(error)
      }
      ///get file
      try {
        const response = await services.file_get(`files/${id}`)
        const fileBlob = new Blob([response.data]);
        //console.log(fileBlob)
        const Url = URL.createObjectURL(fileBlob);
        image.value = Url
      } catch (error) {
        console.log(error)
      }


      PdfViewer(id)
    };

    const PdfViewer = async (id) => {
      pdfUrl.value = ""
      try {
        const response = await services.get(`files/text/${id}`)
        const fileText = response.data
        if (fileText.mimetype == 'application/pdf') {
          loading.value = false
          pdfUrl.value = `${apiUrl}${fileText.path}`
        } else {
          loading.value = true
        }
      } catch (error) {
        console.log(error)
      }

    };
    onMounted(async () => {
      /** load data select */
      await getFiles()


    });
    // onBeforeUnmount(() => {
    //   if (pdfUrl.value) {
    //     URL.revokeObjectURL(pdfUrl.value);
    //   }
    // });
    const onFileChange = (event) => {
      console.log('event')
      const file = event.target.files[0];
      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
          toast.warning("Invalid file type. Only jpg, jpeg, png, and gif files are allowed.");
          //alert("Invalid file type. Only jpg, jpeg, png, and gif files are allowed.");
          selectedFile.value = null;
          return;
        }
        if (file.size > maxSize) {
          alert("File size exceeds the 2 MB limit.");
          selectedFile.value = null;
          return;
        }
        //console.log(file)
        selectedFile.value = file;
      }
    }
    const uploadFile = handleSubmit(async() => {
      if (!selectedFile.value) {
        toast.warning("Please select a valid file first!");
        return;
      }
    //  await services
    //     .get(
    //       `roles?roleName=DAC`
    //     )
    //     .then((response) => {
    //       userRole.value = response.data[0]._id
          
    //     })
    //     .catch((error) => console.log(error));
    
    //   console.log(userRole.value)
     const role = JSON.parse(localStorage.getItem('userData'))
    //   userRole.value = role.role.roleName
    // console.log("role",role)
       const rol = role.role._id

      const formData = new FormData();
      formData.append('file', selectedFile.value);
      formData.append('role', rol);
      formData.append('type', type.value);
      formData.append('num', num.value);
      formData.append('title', title.value);
      formData.append('slug',perSlug[0].DOE);
      // console.log(formData)
      console.log(type.value);

      services.common_post('files/upload-single/', formData,
        {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        })
        .then((response) => {
          toast.success("Success", {
            timeout: 2000,
          });
          show.value = !show.value;

          getFiles();
        })
        .catch((e) => {
          toast.error(e, {
            timeout: 2000,
          });
          show.value = !show.value;
        });
    });


    return {
      toggleCreate, toggleModalEdit, editFile, getFiles, deleteFile,
      updateFile, deleteModal, PdfViewer, onFileChange, uploadFile,
      show, show1, toast, isDisabled, files, numEdit, titleEdit,
      type, file, num, title, userRole, selectedFile, validExtensions, maxSize,
      image, isVisible, btnUpdate, showDelete, pdfUrl, loading, error,
      numError, titleError, numEditError, titleEditError,roleId,

      columns: [

        {
          label: t("Number"),
          field: "num",

        },
        {
          label: t("Title"),
          field: "title",
          type: "string",
        },
        {
           label: t("Doc Type"),
          field: "type",
          type: "string",
        },


        {
          label: t('Action'),
          field: 'action',
          tdClass: 'text-center',
          thClass: 'text-center',
          sortable: false,
        },

      ],
    }

  },
}

</script>
<style lang="scss" scoped></style>