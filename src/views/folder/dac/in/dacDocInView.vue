<template>
  <div class="space-y-5 profile-page">

    <div class="grid grid-cols-12 gap-6">
      <div class="lg:col-span-12 col-span-12 ">
        <Card :title="$t('Document-In')">
          <h2>View Image</h2>

          <div v-if="imageUrl" class="py-4">
            
            <img :src="imageUrl" alt="Fetched Image" style="max-width: 100%;" />
          </div>
          <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
          <div  class="py-4">
          <span class="ml-2 ">
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
//import 'vue-good-table-next/dist/vue-good-table-next.css'
//import { VueGoodTable } from 'vue-good-table-next';
import axios from "axios";

// import { onMounted, ref } from 'vue';
// import profileImg from "@/assets/images/avatar/avatar.png"
export default {
  components: {
    Card,
    Icon,
    Button,

    Fileinput
  },
  setup() {



    const toast = useToast();
    return { toast, }


  },
  data() {
    return {

      token: JSON.parse(localStorage.getItem('activeUser')),
      file_id: localStorage.getItem('file_id'),
      imageUrl: null, // URL for the fetched image
      errorMessage: "", // Error message if the request fails
     


    };
  },
  mounted() {
    this.fetchFile()
    this.getFile()
  },
  methods: {
    backFile(){
      this.$router.push('dac-docin')
    },
    async fetchFile() {
      console.log(this.file_id)
      try {
        const response = await axios.get(`http://localhost:3000/v1/files/${this.file_id}`, {
          responseType: "blob", // Important for binary data
          headers: {
            authorization: `Bearer ${this.token.accessToken}`, // Replace with your token
          },


        });
        const data = response.data
        //console.log(data)
        // Create a URL for the file blob
        const fileBlob = new Blob([response.data]);
        const imageUrl = URL.createObjectURL(fileBlob);
        this.imageUrl = imageUrl
        console.log(imageUrl)
      } catch (error) {
        console.error("Error fetching image:", error);
        this.errorMessage = "Failed to fetch the image. Please try again.";
      }
    },
    async getFile() {
      console.log(this.file_id)
      try {
        const response = await axios.get(`http://localhost:3000/v1/files/text/${this.file_id}`, {
          
          headers: {
            authorization: `Bearer ${this.token.accessToken}`, // Replace with your token
          },


        });
        const data = response.data
        console.log(data)
       
      } catch (error) {
        console.error("Error fetching image:", error);
        this.errorMessage = "Failed to fetch the image. Please try again.";
      }
    },




  }

}

</script>
<style lang="scss" scoped></style>
