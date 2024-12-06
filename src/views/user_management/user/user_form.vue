<template>
  <div>
    <Card :title="$t('user_info')">
      <form ref="formuser" @submit.prevent="onSubmit">
        <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          <Textinput
            :label="$t('first name')"
            name="firstname"
            type="text"
            :placeholder="$t('first name')"
            v-model="firstname"
            :error="fullnameError"
          />
          <Textinput
            :label="$t('last name')"
            name="lastname"
            type="text"
            :placeholder="$t('last name')"
            v-model="lastname"
            :error="fullnameError"
          />

          <div class="fromGroup">
            <label class="form-label">{{ $t("gender") }}</label>
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
              v-model="dob"
              class="form-control"
              name="dob"
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

          <Textinput
            :label="$t('organization')"
            name="organization"
            type="text"
            :placeholder="$t('organization')"
            v-model="organization"
          />

          <Textinput
            :label="$t('position')"
            name="position"
            type="text"
            :placeholder="$t('position')"
            v-model="position"
          />
        </div>
        <div
          class="conten-box mt-6 border-t border-slate-100 dark:border-slate-700 -mx-6 px-6 pt-6"
        ></div>
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
import { inject, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { useI18n } from "vue-i18n";

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
    const services = inject("services");
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const userId = ref(0);
    const disableProvince = ref(true);
    const disableDistrict = ref(true);
    const disableCommune = ref(true);
    const disableVillage = ref(true);

    const listReference = ref([]);
    const listOrg = ref([]);
    const listOrgPosition = ref([]);
    const listPartyPosition = ref([]);
    const listProvince = ref([]);
    const listDistrict = ref([]);
    const listCommune = ref([]);
    const listVillage = ref([]);

    const dateDefault = ref("");
    const genderOption = ref([
      { label: "ប្រុស", value: "M" },
      { label: "ស្រី", value: "F" },
    ]);

    // Define a validation schema
    const schema = yup.object({
      firstname: yup.string().required(t("This_field_is_required")),
      lastname: yup.string().required(t("This_field_is_required")),
      phone: yup.string().required(t("This_field_is_required")),
      email: yup.string().email(t("valid_email")),
    });

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: firstname, errorMessage: fullnameError } =
      useField("firstname");
    const { value: lastname, errorMessage: lastnameError } =
      useField("lastname");
    const { value: phone, errorMessage: phoneError } = useField("phone");
    const { value: email, errorMessage: emailError } = useField("email");
    const { value: dob, errorMessage: dobError } = useField("dob");
    const { value: gender } = useField("gender");
    const { value: organization } = useField("organization");
    const { value: position } = useField("position");

    const onSubmit = handleSubmit(async (values) => {

      let url ="";
      if(userId.value !=""){
        url = `auth/sign-up/${userId.value}`;
        
      } else{
        url = `auth/sign-up`;
      }
    
      const response = await services
        .post(url, {
          username: values.firstname + values.lastname,
          firstname: values.firstname,
          lastname: values.lastname,
          gender: values.gender,
          dob: values.dob,
          phone: values.phone,
          organization: values.organization,
          position: values.position,
          email: values.email,
          password: "12345678",
          confirmPassword: "12345678",
        })
        .then((res) => {
          toast.success("Success", {
            timeout: 2000,
          });
          resetForm();
          return router.push({ path: "/app/user" });
        })
        .catch((e) => {
          toast.error(e.response.data, {
            timeout: 2000,
          });
        });
    });

    const getUser = async () => {
      await services
        .get(`user?perPage=500&page=1&search=`)
        .then((res) => {
          res.data.data.forEach((element) => {
            listReference.value.push({
              value: element.user_id,
              label: element.fullname,
            });
          });
        })
        .catch((error) => console.log(error));
    };

    const getDataLovs = async (url) => {
      const result = [];
      await services
        .common_get(url)
        .then((res) => {
          res.data.body.forEach((element) => {
            result.push({
              value: element.id,
              label: element.name,
            });
          });
        })
        .catch((error) => console.log(error));

      return result;
    };

    const getProvince = async (url) => {
      const result = [];
      await services
        .common_get(url)
        .then((res) => {
          res.data.body.forEach((element) => {
            result.push({
              value: element.address_cd,
              label: element.province_nm_kh,
            });
          });
        })
        .catch((error) => console.log(error));

      return result;
    };

    const getDistrict = async (value) => {
      if (value != null) {
        await services
          .common_get(`address/provinces/${value}/districts`)
          .then((res) => {
            res.data.body.forEach((element) => {
              listDistrict.value.push({
                value: element.address_cd,
                label: element.district_nm_kh,
              });
            });
          })
          .catch((error) => console.log(error));
      }
    };

    const getCommune = async (value) => {
      listCommune.value = [];
      listVillage.value = [];
      spCommune.value = "";
      spVillage.value = "";
      if (value != null) {
        await services
          .common_get(`address/provinces/district/${value}/communes`)
          .then((res) => {
            res.data.body.forEach((element) => {
              listCommune.value.push({
                value: element.address_cd,
                label: element.commune_nm_kh,
              });
            });
          })
          .catch((error) => console.log(error));
      }
    };

    const getVillage = async (value) => {
      listVillage.value = [];
      spVillage.value = "";
      if (value != null) {
        await services
          .common_get(`address/provinces/district/commune/${value}/village`)
          .then((res) => {
            res.data.body.forEach((element) => {
              listVillage.value.push({
                value: element.address_cd,
                label: element.village_nm_kh,
              });
            });
          })
          .catch((error) => console.log(error));
      }
    };

    const getUserById = async (id) => {
      let userData = [];

      // Ensure `id` is not empty and a valid number

      if (id && id.trim() !== "") {
        try {
          userId.value = id;
        
          // Fetch user data from the API
          const response = await services.get(`users/${id}`);
          console.log(`Request sent to users/${id}`);

          userData = response.data; // Assign fetched data to `userData`
          console.log(userData);

          // Example: Assign a test value (for demonstration)

          firstname.value = userData.firstname; // Correct way
          lastname.value = userData.lastname;
          gender.value = userData.gender;
          dob.value = userData.dob;
          phone.value = userData.phone;
          email.value = userData.email;
          organization.value = userData.organization;
          position.value = userData.position;

          // Uncomment and use the following code as needed:
          // gender.value = userData.gender;
          // dateDefault.value = userData.dob;

          // if (userData.organization) {
          //   organization.value = userData.organization.id;
          // }

          // if (userData.org_position) {
          //   position.value = userData.org_position.id;
          // }

          // if (userData.reference_code != null) {
          //   referenceCode.value = userData.reference_code.user_id;
          // }

          // if (userData.user_spaddresses[0] != null) {
          //   spLevel.value = userData.user_spaddresses[0].sp_level;
          // }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("Invalid ID provided.");
      }
    };

    onMounted(async () => {
      /** load data select */

      // listOrg.value = await getDataLovs(`organizations`)
      // listOrgPosition.value = await getDataLovs(`org-positions`)
      // listPartyPosition.value = await getDataLovs(`party-positions`)
      // listProvince.value = await getProvince(`address/provinces`)
      await getUser();
      if (typeof route.params.id !== "undefined") {
        await getUserById(route.params.id);
      }
    });

    return {
      genderOption,
      firstname,
      lastname,
      fullnameError,
      phone,
      phoneError,
      email,
      emailError,
      dob,
      gender,
      organization,
      position,
      dateDefault,
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
