<template>
  <div class="space-y-5 profile-page">

    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12 ">
        <Card :title="$t('Document-Out')">
          <Fileinput @change="onFileChange" />
          <div class="mt-5">
          <Button icon="heroicons-outline:plus-sm" :text="$t('create_new')" btnClass=" btn-success font-normal btn-sm "
            iconClass="text-lg" @click="$emit(uploadFile())" />
         
          <span class="ml-2">
            <Button icon="heroicons-outline:arrow-left" :text="$t('Back')" btnClass=" btn-primary font-normal btn-sm "
            iconClass="text-lg" @click="$emit(backFile())" />
          </span>
          </div>
        </Card>
      </div>

    </div>


  </div>
</template>
<script>
import Card from "@/components/Card";
import { useToast } from "vue-toastification";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Fileinput from "@/components/Fileinput"
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import axios from "axios";

// import { onMounted, ref } from 'vue';
// import profileImg from "@/assets/images/avatar/avatar.png"
export default {
  components: {
    Card,
    Icon,
    Button,
    VueGoodTable,
    Fileinput
  },
  setup() {
  

   
    const toast = useToast();
    return { toast,  }

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
      files: [],
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
 
  methods: {
    backFile(){
      this.$router.push('dac-docout')
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
     
      //location.reload()


      return this.toast.success("File upload success");
      
    },



  }

}

</script>
<style lang="scss" scoped></style>
