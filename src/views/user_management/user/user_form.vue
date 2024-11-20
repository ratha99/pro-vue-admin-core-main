<template>
  <div>
 <Card :title="$t('user_info')">
    <form ref="formuser" @submit.prevent="onSubmit">
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <div class="fromGroup">
          <label class="form-label">{{ $t('user_title') }}</label>
            <VueSelect>
              <vSelect
                  :options="listUserTitle"
                  :reduce="(option) => option.value"
                  v-model="userTitle"
              />
            </VueSelect>
        </div>
        <Textinput
          :label="$t('full_name')"
          name="fullname"
          type="text"
          :placeholder="$t('full_name')"
          v-model="fullname"
          :error="fullnameError"
        />
        <div class="fromGroup">
          <label class="form-label">{{$t('gender')}}</label>
            <VueSelect>
              <vSelect
                  :options="genderOption"
                  :reduce="(option) => option.value"
                  v-model="gender"
              />
            </VueSelect>
        </div>

        <FromGroup :label="$t('date_of_birth')">
          <flat-pickr
            v-model="dateDefault"
            class="form-control"
            id="dateOfBirth"
            placeholder="yyyy, dd M"
          />
        </FromGroup>
        <Textinput
          :label="$t('phone')"
          name="phone"
          type="number"
          :placeholder="$t('phone')"
          v-model="phone"
          :error="phoneError"
        />
        <Textinput
          :label="$t('user_email')"
          name="email"
          type="text"
          :placeholder="$t('user_email')"
          v-model="email"
          :error="emailError"
        />
        <div class="fromGroup">
          <label class="form-label">{{ $t('organization') }}</label>
            <VueSelect>
              <vSelect
                  :options="listOrg"
                  :reduce="(option) => option.value"
                  v-model="organization"
              />
            </VueSelect>
        </div>
        <div class="fromGroup">
          <label class="form-label">{{ $t('position') }}</label>
            <VueSelect>
              <vSelect
                  :options="listOrgPosition"
                  :reduce="(option) => option.value"
                  v-model="position"
              />
            </VueSelect>

        </div>
        <div class="fromGroup">
          <label class="form-label">{{ $t('position_in_organization') }}</label>
            <VueSelect :error="positionInOrganizationError">
              <vSelect
                  :options="listPartyPosition"
                  :reduce="(option) => option.value"
                  v-model="positionInOrganization"
              />
            </VueSelect>
        </div>
      </div>
      <div
        class="conten-box mt-6 border-t border-slate-100 dark:border-slate-700 -mx-6 px-6 pt-6"
      ></div>
      <h4 class="text-base text-slate-800 dark:text-slate-300 mb-6">
        {{ $t("sp_address_info") }}
      </h4>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <VueSelect :label="$t('reference_code')">
          <vSelect
              :options="listReference"
              :reduce="(option) => option.value"
              v-model="referenceCode"
          />
        </VueSelect>
        <VueSelect :label="$t('sp_level')" :error="spLevelError">
          <vSelect
              :options="spLevelOption"
              :reduce="(option) => option.value"
              v-model="spLevel"
              @update:modelValue="checkSpLevelOption"
          />
        </VueSelect>
        <VueSelect :label="$t('sp_province')" :error="spProvinceError">
          <vSelect
              :options="listProvince"
              :reduce="(option) => option.value"
              :disabled="disableProvince"
              v-model="spProvince"
              @update:modelValue="getDistrict"
          />
        </VueSelect>
        <VueSelect :label="$t('sp_district')">
          <vSelect
              :options="listDistrict"
              :reduce="(option) => option.value"
              :disabled="disableDistrict"
              v-model="spDistrict"
              @update:modelValue="getCommune"
          />
        </VueSelect>
        <VueSelect :label="$t('sp_commune')">
          <vSelect
              :options="listCommune"
              :reduce="(option) => option.value"
              :disabled="disableCommune"
              v-model="spCommune"
              @update:modelValue="getVillage"
          />
        </VueSelect>
        <VueSelect :label="$t('sp_village')">
          <vSelect
              :options="listVillage"
              :reduce="(option) => option.value"
              :disabled="disableVillage"
              v-model="spVillage"
          />
        </VueSelect>
      </div>
      <div class="mt-6 text-right">
        <Button :text="$t('save')" btnClass="btn-primary"></Button>
      </div>
    </form>
  </Card>
</div>
</template>
<script>
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import Select from "@/components/Select";
import FromGroup from "@/components/FromGroup";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { inject, onMounted, ref, watch } from 'vue';
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from 'vue-router';
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { useI18n } from 'vue-i18n';

export default {
  components: {
    Textinput,
    Button,
    Card,
    Checkbox,
    Select,
    FromGroup,
    VueSelect,
    vSelect,
  },

  setup() {
    const services = inject('services')
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter()
    const toast = useToast()

    const userId = ref(0)
    const disableProvince = ref(true)
    const disableDistrict = ref(true)
    const disableCommune = ref(true)
    const disableVillage = ref(true)

    const listUserTitle = ref([])
    const listReference = ref([])
    const listOrg = ref([])
    const listOrgPosition = ref([])
    const listPartyPosition = ref([])
    const listProvince = ref([])
    const listDistrict = ref([])
    const listCommune = ref([])
    const listVillage = ref([])

    const dateDefault = ref("")
    const genderOption = ref([{ label: "ប្រុស", value: "M" }, { label: "ស្រី", value: "F" }])
    const spLevelOption = ref([
      {value: "01", label: "ខេត្ត/ក្រុង" },
      {value: "02", label: "ខណ្ឌ/ស្រុក" },
      {value: "03", label: "សង្កាត់/ឃុំ" },
      {value: "04", label: "ភូមិ/ឃុំ" },
    ])

    // Define a validation schema
    const schema = yup.object({
      fullname: yup.string().required(t("This_field_is_required")),
      phone: yup.string().required(t("This_field_is_required")),
      email: yup.string().email(t("valid_email")),
      positionInOrganization: yup.mixed().nullable().required(t("please_choose_one")),
      spLevel: yup.mixed().nullable().required(t("please_choose_one")),
      spProvince: yup.mixed().nullable().required(t("please_choose_one")),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: fullname, errorMessage: fullnameError } = useField("fullname");
    const { value: phone, errorMessage: phoneError } = useField("phone");
    const { value: email, errorMessage: emailError } = useField("email");
    const { value: positionInOrganization, errorMessage: positionInOrganizationError } = useField("positionInOrganization");
    const { value: spLevel, errorMessage: spLevelError } = useField("spLevel");
    const { value: spProvince, errorMessage: spProvinceError } = useField("spProvince");

    const { value: userTitle } = useField("userTitle");
    const { value: gender } = useField("gender");
    const { value: organization } = useField("organization");
    const { value: position } = useField("position");
    const { value: referenceCode } = useField("referenceCode");
    const { value: spDistrict } = useField("spDistrict");
    const { value: spCommune } = useField("spCommune");
    const { value: spVillage } = useField("spVillage");

    gender.value = "M";

    const onSubmit = handleSubmit(async (values) => {
      const response = await services.post("user/store", {
        id: userId.value,
        phone : values.phone,
        email : values.email,
        fullname : values.fullname,
        user_title_id : values.userTitle,
        gender : values.gender,
        dob : dateDefault.value,
        org_id : values.organization,
        org_position_id : values.position,
        reference_id : values.referenceCode,
        userSPAddress : [{
          sp_province_cd : values.spProvince,
          sp_district_cd : values.spDistrict != null ? values.spDistrict: '',
          sp_commune_cd : values.spCommune != null ? values.spCommune : '',
          sp_village_cd : values.spVillage != null ? values.spVillage: '',
          party_position_id : values.positionInOrganization != null ? values.positionInOrganization: '',
          sp_level : values.spLevel != null ? values.spLevel : '',
        }]
      })
      .then((res) => {
          toast.success("Success", {
            timeout: 2000,
          });
          resetForm();
          return router.push({path:"/app/user"});
      })
      .catch((e) => {
        toast.error(e.response.data, {
          timeout: 2000,
        });
      });
    });

    const getUser = async () =>{
      await services.get(`user?perPage=500&page=1&search=`)
      .then(res => {
        res.data.data.forEach(element => {
          listReference.value.push({
            value: element.user_id,
            label: element.fullname,
          })
        });
      })
      .catch(error => console.log(error))
    }

    const getDataLovs = async (url) =>{
      const result = []
      await services.common_get(url)
      .then(res => {
        res.data.body.forEach(element => {
          result.push({
            value: element.id,
            label: element.name,
          })
        });
      })
      .catch(error => console.log(error))

      return result;
    }

    const getProvince = async (url) =>{
      const result = []
      await services.common_get(url)
      .then(res => {
        res.data.body.forEach(element => {
          result.push({
            value: element.address_cd,
            label: element.province_nm_kh,
          })
        });
      })
      .catch(error => console.log(error))

      return result;
    }

    const getDistrict = async (value) =>{
      if(value != null) {
        await services.common_get(`address/provinces/${value}/districts`)
        .then(res => {
          res.data.body.forEach(element => {
            listDistrict.value.push({
              value: element.address_cd,
              label: element.district_nm_kh,
            })
          });
        })
        .catch(error => console.log(error))
      }
    }

    const getCommune = async (value) =>{
      listCommune.value = []
      listVillage.value = []
      spCommune.value = ""
      spVillage.value = ""
      if(value != null) {
        await services.common_get(`address/provinces/district/${value}/communes`)
        .then(res => {
          res.data.body.forEach(element => {
            listCommune.value.push({
              value: element.address_cd,
              label: element.commune_nm_kh,
            })
          });
        })
        .catch(error => console.log(error))
      }
    }

    const getVillage = async (value) =>{
      listVillage.value = []
      spVillage.value = ""
      if(value != null) {
        await services.common_get(`address/provinces/district/commune/${value}/village`)
        .then(res => {
          res.data.body.forEach(element => {
            listVillage.value.push({
              value: element.address_cd,
              label: element.village_nm_kh,
            })
          });
        })
        .catch(error => console.log(error))
      }
    }

    const checkSpLevelOption = () => {
      if(spLevel.value == "02"){
        disableProvince.value = false
        disableDistrict.value = false
      } else if(spLevel.value == "03"){
        disableProvince.value = false
        disableDistrict.value = false
        disableCommune.value = false

      } else if(spLevel.value == "04"){
        disableProvince.value = false
        disableDistrict.value = false
        disableCommune.value = false
        disableVillage.value = false
      } else{
        disableProvince.value = false
      }
    }

    const getUserById = async (id) => {
      let userData = []
      if(id > 0) {
        userId.value = id
        await services.get(`user/edit/${id}`)
        .then(res => {
          userData.value = res.data
        })
        .catch(error => console.log(error))

        if(userData.value.user_info != null){
          phone.value = userData.value.user_info.phone
          if(userData.value.user_info.email != null){
            email.value = userData.value.user_info.email
          }
        }

        fullname.value = userData.value.fullname
        userTitle.value = userData.value.user_title.id
        gender.value = userData.value.gender
        dateDefault.value = userData.value.dob
        if(userData.value.organization) {
          organization.value = userData.value.organization.id
        }

        if(userData.value.org_position){
          position.value = userData.value.org_position.id
        }

        if(userData.value.reference_code != null){
          referenceCode.value = userData.value.reference_code.user_id
        }

        if(userData.value.user_spaddresses[0] != null){
          spLevel.value = userData.value.user_spaddresses[0].sp_level
          if(spLevel.value > 0) {
            checkSpLevelOption()
          }
          spProvince.value = userData.value.user_spaddresses[0].sp_province_cd
          await getDistrict(spProvince.value)
          spDistrict.value = userData.value.user_spaddresses[0].sp_district_cd
          await getCommune(spDistrict.value)
          spCommune.value = userData.value.user_spaddresses[0].sp_commune_cd
          await getVillage(spCommune.value)
          spVillage.value = userData.value.user_spaddresses[0].sp_village_cd
          positionInOrganization.value = userData.value.user_spaddresses[0].party_position.id
        }
      }
    }

    onMounted(async () => {
      /** load data select */
      listUserTitle.value = await getDataLovs(`user-titles`)
      listOrg.value = await getDataLovs(`organizations`)
      listOrgPosition.value = await getDataLovs(`org-positions`)
      listPartyPosition.value = await getDataLovs(`party-positions`)
      listProvince.value = await getProvince(`address/provinces`)
      await getUser()
      if (typeof route.params.id !== "undefined") {
        await getUserById(route.params.id)
      }

    })

    watch([spProvince, spLevel], async () => {
      listDistrict.value = []
      listCommune.value = []
      listVillage.value = []
      spDistrict.value = ""
      spCommune.value = ""
      spVillage.value = ""
    })

    return {
      genderOption,
      spLevelOption,
      fullname,
      fullnameError,
      phone,
      phoneError,
      email,
      emailError,
      userTitle,
      gender,
      organization,
      position,
      positionInOrganization,
      positionInOrganizationError,
      referenceCode,
      spLevel,
      spLevelError,
      spProvince,
      spProvinceError,
      spDistrict,
      spCommune,
      spVillage,
      dateDefault,
      listUserTitle,
      listReference,
      listOrg,
      listOrgPosition,
      listPartyPosition,
      listProvince,
      listDistrict,
      listCommune,
      listVillage,
      disableProvince,
      disableDistrict,
      disableCommune,
      disableVillage,
      checkSpLevelOption,
      getDistrict,
      getCommune,
      getVillage,
      getUser,
      getProvince,
      getDataLovs,
      onSubmit,
      resetForm,
      route,
      router,
    };
  },
};
</script>
<style lang="scss"></style>
