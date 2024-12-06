<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <Textinput
      :label="$t('email')"
      type="text"
      :placeholder="$t('This_field_is_required')"
      v-model="email"
      :error="emailError"
      classInput="h-[48px]"
    />
    <Textinput
      :label="$t('password')"
      type="password"
      :placeholder="$t('This_field_is_required')"
      name="password"
      v-model="password"
      :error="passwordError"
      hasicon
      classInput="h-[48px]"
    />

    <div class="flex justify-between">
      <label class="cursor-pointer flex items-start">
        <input
          type="checkbox"
          class="hidden"
          @change="() => (checkbox = !checkbox)"
        />
        <!-- <span
          class="h-4 w-4 border rounded flex-none inline-flex mr-3 relative top-1 transition-all duration-150"
          :class="
            checkbox
              ? 'ring-2 ring-black-500 dark:ring-offset-slate-600 dark:ring-slate-900  dark:bg-slate-900 ring-offset-2 bg-slate-900'
              : 'bg-slate-100 dark:bg-slate-600 border-slate-100 dark:border-slate-600 '
          "
        >
          <img
            src="@/assets/images/icon/ck-white.svg"
            alt=""
            class="h-[10px] w-[10px] block m-auto"
            v-if="checkbox"
          />
        </span> -->
        <!-- <span class="text-slate-500 dark:text-slate-400 text-sm leading-6"
          >Keep me signed in</span
        > -->
      </label>
      <!-- <router-link
        to="/forgot-password"
        class="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >Forgot Password?</router-link
      > -->
    </div>

    <button
      type="submit"
      class="btn btn-dark btn_bg_primary block w-full text-center"
    >
      {{ $t("sign_in") }}
    </button>
  </form>
</template>
<script>
import Textinput from "@/components/Textinput";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { inject } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  components: {
    Textinput,
  },
  data() {
    return {
      checkbox: false,
    };
  },
  setup() {
    const { t } = useI18n();
    // Define a validation schema
    const schema = yup.object({
      email: yup.string().required(t("This_field_is_required")),
      password: yup.string().required(t("This_field_is_required")),
    });

    const toast = useToast();
    const router = useRouter();

    const formValues = {
      email: "",
      password: "",
    };

    const { handleSubmit } = useForm({
      validationSchema: schema,
      initialValues: formValues,
    });
    // No need to define rules for fields

    const { value: email, errorMessage: emailError } = useField("email");
    const { value: password, errorMessage: passwordError } =
      useField("password");
    const services = inject("services");

    const onSubmit = handleSubmit(async (values) => {
      /** login */
      let login = await services
        .post("auth/login", {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          var currentDate = new Date().toISOString().slice(0, 10);
          localStorage.setItem("activeUser", JSON.stringify(response.data));
          localStorage.setItem("loginExpired", JSON.stringify(currentDate));
          return true;
        })
        .catch((e) => {
          console.log(e);
          if (e.response && e.response.status === 403) {
            toast.error(t("account_inactive"), {
              // Add translation key for inactive error
              timeout: 2000,
            });
          } else if (e.response && e.response.status === 401) {
            toast.error(t("email_or_password_invalid"), {
              timeout: 2000,
            });
          } else {
            toast.error(t("unexpected_error"), {
              timeout: 2000,
            });
          }

          return false;
        });

      if (login) {
        router.push("/app/home");
        /** Get User permission */

        await services
          .get("users/getUserbyToken", {})
          .then((response) => {
            localStorage.setItem("userData", JSON.stringify(response.data));
            toast.success(t("login_successfully"), {
              timeout: 2000,
            });
          })
          .catch((e) => {
            console.log(e);
            if (e.response && e.response.status === 403) {
              toast.error(t("account_inactive"), {
                // Add translation key for inactive error
                timeout: 2000,
              });
            } else if (e.response && e.response.status === 401) {
              toast.error(t("email_or_password_invalid"), {
                timeout: 2000,
              });
            } else {
              toast.error(t("unexpected_error"), {
                timeout: 2000,
              });
            }
          });
      }
    });

    return {
      email,

      emailError,
      password,
      passwordError,
      onSubmit,
    };
  },
};
</script>
<style lang="scss">
.btn_bg_primary {
  background-color: #003a8a !important;
}
</style>
