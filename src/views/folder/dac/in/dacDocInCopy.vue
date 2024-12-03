<template>
    <!-- <Button text="Open Modal" @click="toggleModal" /> -->
    <Modal
      :title="$t('Document-In')"
      label="Modal title"
      :activeModal="show"
      @close="show = false"
    >
    <Textinput
      label="Document No"
      name="pn"
      type="text"
      placeholder="Document No"
    />
    <br>
    <Textarea
      label="Title"
      name="pd"
      placeholder="Title"
    />
    <br>
    <!-- <Select
      label="Document Type"
      name="dt"
      :options="options"
      placeholder="Document Type"
    /> -->
    <Fileinput label="Document" @change="onFileChange" />
    <br>
    <Button icon="heroicons-outline:plus-sm" text="Save" btnClass=" btn-success font-normal btn-sm "
            iconClass="text-lg" @click="$emit(uploadFile())" />
  </Modal>
  <div class="space-y-5 profile-page">

    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12 ">
        <Card :title="$t('Document-In')">
          
          <div class="py-4">
          <!-- <Button icon="heroicons-outline:plus-sm" :text="$t('create_new')" btnClass=" btn-success font-normal btn-sm "
            iconClass="text-lg" @click="$emit(createFile())" /> -->
            <Button icon="heroicons-outline:plus-sm" :text="$t('create_new')" btnClass=" btn-success font-normal btn-sm "
            iconClass="text-lg" @click="toggleModal" />
          </div>
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
                <!-- <button type="button" class="btn btn-warning" v-on:click="edit(props.row.id)"><i
              class="fas fa-edit"></i></button> -->
                <Button icon="heroicons:book-open" :text="$t('view')" btnClass=" btn-primary font-normal btn-sm "
                  iconClass="text-ls" @click="viewFile(props.row._id)" />

              </span>
              <span v-if="props.column.field == 'action'" class="ml-2">
                <!-- <button type="button" class="btn btn-warning" v-on:click="edit(props.row.id)"><i
              class="fas fa-edit"></i></button> -->
                <Button icon="heroicons:pencil-square" :text="$t('edit')" btnClass=" btn-warning font-normal btn-sm "
                  iconClass="text-ls" @click="editFile(props.row._id)" />

              </span>
              <span v-if="props.column.field == 'action'" class="ml-2">
                <!-- <button type="button" class="btn btn-danger " v-on:click="remove(props.row.id)"><i
              class="fas fa-trash-alt"></i></button> -->
                <Button icon="heroicons-outline:trash" :text="$t('delete')" btnClass=" btn-danger font-normal btn-sm "
                  iconClass="text-ls" @click="deleteFile(props.row._id)" />
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
import Card from "@/components/Card";
import { useToast } from "vue-toastification";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Fileinput from "@/components/Fileinput"
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import { ref } from "vue";
import axios from "axios";
const show = ref(false);

// import { onMounted, ref } from 'vue';
// import profileImg from "@/assets/images/avatar/avatar.png"
export default {
  components: {
    Card,
    Icon,
    Button,
    VueGoodTable,
    Fileinput,
    Modal,
    Select,
  },
  setup() {



    const toast = useToast();
    return { toast, }

    // const userProfile = ref({})
    // const urlProfile = ref(profileImg)
    // const spLevelOption = ref(
    //   {
    //     "01": "ខេត្ត/ក្រុង",
    //     "02": "ខណ្ឌ/ស្រុក",
    //     "03": "សង្កាត់/ឃុំ",
    //     "04": "ភូមិ/ឃុំ",
    //   }
    // }
  },
  data() {
    return {
      imageUrl: null, // URL for the fetched image
      errorMessage: "", // Error message if the request fails
      files: [],
      file_id: '',
      token: JSON.parse(localStorage.getItem('activeUser')),
      selectedFile: null,
      validExtensions: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
      maxSize: 2 * 1024 * 1024, // 2 MB,
      columns: [
        {
          label: "ID",
          field: "_id",
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
  mounted() {
    this.getFiles()
    
  },

  computed: {
      
    },
  methods: {
    async getFiles() {
      //const token = JSON.parse(localStorage.getItem('activeUser'))
      //this.token = token.accessToken
      //console.log(token.accessToken)
      try {

        const response = await axios.get(`http://localhost:3000/v1/files?type=In`,
          {
            headers: {
              authorization: `Bearer ${this.token.accessToken}`
            },
          });
        const files = response.data;
        console.log(files)
        this.files = files;

      } catch (error) {
        console.log(error)
      }
    },
    createFile() {
      this.$router.push('dac-docin-create')
    },
    editFile(file_id) {
      console.log(file_id)
      this.$router.push('dac-docin-edit')
    },
    async viewFile(file_id) {
      console.log(file_id)
      localStorage.setItem('file_id', file_id)
      
    //   try {
    //     const response = await axios.get(`http://localhost:3000/v1/files/${file_id}`, {
    //       responseType: "blob", // Important for binary data
    //       headers: {
    //         authorization: `Bearer ${this.token.accessToken}`, // Replace with your token
    //       },
        
         
    //     });
       
    // // Create a URL for the file blob
    //     const fileBlob = new Blob([response.data]);
    //     const imageUrl = URL.createObjectURL(fileBlob);
    //     this.imageUrl =imageUrl
    //     console.log(imageUrl)
    //   } catch (error) {
    //     console.error("Error fetching image:", error);
    //     this.errorMessage = "Failed to fetch the image. Please try again.";
    //   }

      this.$router.push('dac-docin-view')
    },
    async deleteFile(file) {
      // console.log("Helloo")
      // console.log(file)
      try {
        await axios.delete(`http://localhost:3000/v1/files/${file}`,
          {
            headers: {
              authorization: `Bearer ${this.token.accessToken}`
            },
          });
        //location.reload()  
      }
      //console.log(response.data)
      catch (error) {
        console.error('Error delete file:', error);
        return this.toast.warning(error);

      }

      this.toast.success("File deleted success")
      this.getFiles()

    },

    onFileChange(event) {

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
      if (!this.selectedFile) {
        this.toast.warning("Please select a valid file first!");
        return;
      }
      // Create a FormData instance
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      // console.log(formData)
      try {
        const response = await axios.post('http://localhost:3000/v1/files/upload-single/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log(response.data)
        // console.log("hhhhhhhhhhhhh")
      } catch (error) {
        console.error('Error uploading file:', error);
        return this.toast.warning(error);

      }
      this.getFiles()
      //location.reload()


      return this.toast.success("File upload success");

    },



  }

}

</script>
<style lang="scss" scoped></style>
