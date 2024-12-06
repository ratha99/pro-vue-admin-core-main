<template>
  <div class="grid xl:grid-cols-2 grid-cols-1 gap-6">
    <Card>
      <form ref="form" @submit.prevent="onSubmit" class="space-y-5">
        <Textinput :label="$t('old_password')" type="password" placeholder="" v-model="oldPassword" :error="errorOldPassword" />
        <Textinput :label="$t('new_password')" type="password" placeholder="" v-model="password" :error="passwordError" />
        <Textinput :label="$t('confirm_Password')" type="password" placeholder="" v-model="cPassword" :error="cPasswordError" />
        <div class="text-right">
            <Button :text="$t('save')" btnClass="btn-primary"></Button>
        </div>
      </form>
    </Card>
  </div>
</template>
<script>
import Textinput from "@/components/Textinput";
import Button from '@/components/Button';
import { useI18n } from 'vue-i18n';
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { useToast } from "vue-toastification";
import Card from "@/components/Card"
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    Textinput,
    Button,
    Card,
  },

  setup() {
    const services = inject('services')
    const { t } = useI18n();
    const toast = useToast()
    const router = useRouter()

    // Define a validation schema
    const schema = yup.object({
        oldPassword: yup.string().required(t("This_field_is_required")),
        password: yup.string().required(t("This_field_is_required")).min(8, t('password_must_be_at_laest_8_characters')),
        cPassword: yup
            .string()
            .required(t("This_field_is_required"))
            .oneOf([yup.ref("password")], t('password_not_match')),
    });

    const { handleSubmit, resetForm } = useForm({
        validationSchema: schema,
    });

    // No need to define rules for fields
    const { value: oldPassword, errorMessage: errorOldPassword } = useField("oldPassword");
    const { value: password, errorMessage: passwordError } = useField("password");
    const { value: cPassword, errorMessage: cPasswordError } = useField("cPassword");


    const onSubmit = handleSubmit(async (values) => {
       let userData = JSON.parse(localStorage.getItem("userData"));
      const response = await services.update("users/changepassword", {
      
      // id: userId,
         id: userData._id,
        oldPassword: oldPassword.value,
        newPassword : password.value,
      })
      .then((res) => {
        toast.success(t("change_password_successfully"), {
          timeout: 2000,
        });
        localStorage.removeItem("activeUser");
        router.push("/login");
      })
      .catch((e) => {
        toast.error(e.response.data.message, {
          timeout: 2000,
        });
      });



    });


    onMounted(async () => {
    })


    return {
      oldPassword,
      errorOldPassword,
      password,
      passwordError,
      cPassword,
      cPasswordError,
      onSubmit,
    };
  },
};
</script>
<style lang="scss"></style>
