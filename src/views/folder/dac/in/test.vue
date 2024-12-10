<template>
    <Modal_delete :title="modalTitle" :activeModal="showDelete" @close="showDelete = false" :themeClass="modalHeader">
      <h4 class="font-medium text-lg mb-3 text-slate-900">
        {{ $t("delete_confirm_message") }}
      </h4>
      <div class="text-right">
        <Button :text="$t('o_k')" :btnClass="modalButton" @click="deleteFile()"></Button>
      </div>
    </Modal_delete>
    <!-- <Button text="Open Modal" @click="toggleModal" /> -->
    <Modal :title="$t('Document-In-Create')" label="Modal Create" :activeModal="show" @close="show = false" >
      <Textinput label="Document No" name="num" type="text" placeholder="Document No" v-model="num" />
      <br>
      <Textarea label="Title" name="title" placeholder="Title" v-model="title" />
      <br>

      <Fileinput label="Document" @change="onFileChange" />
      <br>
      <template #footer>
        <Button icon="heroicons-outline:inbox-arrow-down" text="Save" btnClass=" btn-success font-normal btn-sm top-0 right-0"
        iconClass="text-lg" @click="uploadFile" />
        <Button icon="heroicons-outline:x-mark" text="Close" btnClass=" btn-warning font-normal btn-sm "
        iconClass="text-lg" @click="show = false" />
      </template>
      

      <!-- <Button icon="heroicons-outline:plus-sm" text="Close" btnClass=" btn-warning font-normal btn-sm "
        iconClass="text-lg" @click="show = false" /> -->
    </Modal>
 <!-- <Button text="Open Modal" @click="toggleModal" /> -->
    <Modal_eidt :title="$t('Document-In-Edit')" label="Modal Edit" :activeModal="show1" @close="show1 = false">
      <Textinput label="Document No" name="num" type="text" placeholder="Document No" v-model="numEdit"
        :disabled="isDisabled" />
      <br>
      <Textarea label="Title" name="title" placeholder="Title" v-model="titleEdit" :disabled="isDisabled" />
      <br>

      <!-- <Fileinput label="Document" @change="onFileChange" /> -->
      <br>
      <div v-if="image" class="py-4">

        <img :src="image" alt="Fetched Image" style="max-width: 100%;" />
      </div>
      <!-- <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p> -->
      <template #footer>
        <Button icon="heroicons-outline:pencil-square" text="Edit" btnClass=" btn-success font-normal btn-sm "
        iconClass="text-lg" @click="editFile" v-if="btnUpdate" />
      <Button icon="heroicons-outline:inbox-arrow-down" text="Update" btnClass=" btn-success font-normal btn-sm "
        iconClass="text-lg" @click="updateFile" v-if="isVisible" />
      <Button icon="heroicons-outline:x-mark" text="Close" btnClass=" btn-warning font-normal btn-sm "
        iconClass="text-lg" @click="show1 = false && isDisabled" />
      </template>
     
    </Modal_eidt>

  <div class="space-y-5 profile-page">

    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12 ">
        <Card :title="$t('Document-In')">
          <template #header> 
            <Button icon="heroicons-outline:plus-sm" :text="$t('create_new')"
              btnClass="font-normal btn-sm  bg-cyan-800 text-white" iconClass="text-lg" @click="toggleModal" />
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
</template>


<script>
import Modal from "@/components/Modal";
import Modal_eidt from "@/components/Modal";
import Modal_delete from "@/components/Modal";
import Select from "@/components/Select";

import Card from "@/components/Card";
import { useToast } from "vue-toastification";
// import Modal from "@/components/Modal/Modal.vue";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Fileinput from "@/components/Fileinput"
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import axios from "axios";
import Textinput from "@/components/Textinput";
import Textarea from "@/components/Textarea";
import { inject, onMounted, ref, watch } from 'vue';
import  Tooltip  from "@/components/Tooltip";
// import { ref } from 'vue';
// import profileImg from "@/assets/images/avatar/avatar.png"

export default {
  components: {
    Card,
    Icon,
    Button,
    VueGoodTable,
    Fileinput,
    Modal,
    Textinput,
    Textarea,
    Modal,
    Modal_eidt,
    Select,
    Modal_delete,
    Tooltip,
  },
  setup() {

    const services = inject('services')
    //const selectedId = ref(null);
    const show = ref(false);
    const show1 = ref(false);
    const showDelete = ref(false);
    const toast = useToast();
    //testing
    const image = ref("");

    const fileID = ref("");


    const titleEdit = ref("")
    const numEdit = ref("")

    const files = ref([]);
    const btnUpdate = ref(true);
    const isVisible = ref(false);

    const isDisabled = ref(true);
    const token = JSON.parse(localStorage.getItem('activeUser'))


    const toggleModal = () => {
      show.value = !show.value;
    };
    onMounted(async () => {
      /** load data select */
      getFiles()

    });

    const getFiles = async () => {
      console.log("ok")
      files.value = []
      try {
        const response = await services.get(`files`)
        files.value = response.data
        console.log(files.value)
      } catch (error) {
        console.log(error)
      }
    };
    const editFile = () => {
      isVisible.value = !isVisible.value; // Toggle visibility
      btnUpdate.value = !btnUpdate.value; // Toggle visibility
      isDisabled.value = !isDisabled.value; // Toggle visibility


    };
    const updateFile = async () => {


      const ID = fileID.value
      console.log(numEdit.value)
      console.log(titleEdit.value)
      try {
        console.log(ID)
        await services.update(`files/text/${ID}`,
          {
            num: numEdit.value,
            title: titleEdit.value
          }


        )


      } catch (error) {
        console.error('Error update file:', error);
        return toast.warning(error);
      }
      toast.success("File update success")
      getFiles()
      show1.value = !show1.value
    }
    const deleteModal = (id) => {
      fileID.value = id
      // modalHeader.value =
      //   "bg-d anger-500 bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700";
      // modalTitle.value = t("delete");
      // modalButton.value = "btn inline-flex justify-center btn-danger";
      // permissionID.value = row._id;
      showDelete.value = !showDelete.value;
    };
    const deleteFile = async () => {
      const ID = fileID.value
      try {
        services.common_remove(`files/${ID}`)
      }
      //console.log(response.data)
      catch (error) {
        console.error('Error delete file:', error);
        return toast.warning(error);
      }

      toast.success("File deleted success")
      showDelete.value = !showDelete.value;
      getFiles()
    }
    const toggleModalEdit = async (id) => {
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
    };

    return {
      toggleModal, toggleModalEdit, editFile, getFiles, deleteFile, updateFile, deleteModal,
      show, show1, toast, isDisabled, files, token, numEdit, titleEdit,
      image, isVisible, btnUpdate, showDelete,
    }
  },
  data() {
    return {
      //token: JSON.parse(localStorage.getItem('activeUser')),
      services: inject('services'),
      file_id: '',
      type: 'In',
      file: [],
      userRole: '',
      num: '',
      title: '',
      file_id: '',
      selectedFile: null,
      validExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
      maxSize: 2 * 1024 * 1024, // 2 MB,
      columns: [
        {
          label: "ID",
          field: "_id",
        },
        {
          label: "Number",
          field: "num",

        },
        {
          label: "Title",
          field: "title",
          type: "string",
        },
        {
          label: "Name",
          field: "originalname",
          type: "string",
        },
        {
          label: "Created On",
          field: "createdDate",
        },
        {
          label: 'Action',
          field: 'action',
          tdClass: 'text-center',
          thClass: 'text-center',
          sortable: false,
        },

      ],

    };
  },

  methods: {
    onFileChange(event) {
      console.log('event')
      const file = event.target.files[0];
      if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!this.validExtensions.includes(fileExtension)) {
          this.toast.warning("Invalid file type. Only jpg, jpeg, png, and gif files are allowed.");
          //alert("Invalid file type. Only jpg, jpeg, png, and gif files are allowed.");
          this.selectedFile = null;
          return;
        }
        if (file.size > this.maxSize) {
          alert("File size exceeds the 2 MB limit.");
          this.selectedFile = null;
          return;
        }
        //console.log(file)
        this.selectedFile = file;
      }
    },
    async uploadFile() {
      //console.log(this.num)     
      if (!this.selectedFile) {
        this.toast.warning("Please select a valid file first!");
        return;
      }
      // Create a FormData instance
      const userRole = JSON.parse(localStorage.getItem('userData'))
      this.userRole = userRole.role._id

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('role', this.userRole);
      formData.append('type', this.type);
      formData.append('num', this.num);
      formData.append('title', this.title);
      // console.log(formData)
      console.log(this.title)
      try {
        const response = await this.services.common_post('files/upload-single/', formData)

        // //const response = await axios.post('http://localhost:3000/v1/files/upload-single/', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     authorization: `Bearer ${this.token.accessToken}`, // Add your here
        //   }
      }
      //console.log(response.data)
      // console.log("hhhhhhhhhhhhh")
      catch (error) {
        console.error('Error uploading file:', error);
        return this.toast.warning(error);

      }

      this.getFiles()
      this.show = false
      //location.reload()


      return this.toast.success("File upload success");

    },



  }

}

</script>
<style lang="scss" scoped></style>