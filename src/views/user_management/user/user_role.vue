<template>
<div>
  <Modal
    :title="$t('set_role')"
    :activeModal="isOpen"
    themeClass="bg-primary-500"
    >
      <form ref="form" @submit.prevent="onSubmit" class="space-y-5">
          <VueSelect :label="$t('role')" :error="rolesError">
            <vSelect
              :options="listRole"
              :reduce="(options) => options.value"
              v-model="roles"
              />
          </VueSelect>
        <div class="text-right">
          <Button :text="$t('save')" btnClass="btn-primary"></Button>
        </div>
      </form>
  </Modal>
</div>
</template>

<script>
import Textinput from "@/components/Textinput";
import Button from '@/components/Button';
import Modal from '@/components/Modal/Modal';
import InputGroup from "@/components/InputGroup";
import { useI18n } from 'vue-i18n';
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { defineEmits, defineComponent, onMounted, watch, inject, ref } from 'vue';
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { array, number } from "yup/lib/locale";
import { useToast } from "vue-toastification";
export default defineComponent({
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        userId: number,
        roleIds: Array,
    },
    components: {
        Modal,
        Button,
        VueSelect,
        vSelect,
        Textinput,
        InputGroup,
    },
    setup(props, ctx) {
      const services = inject('services');
      const { t } = useI18n();
      const toast = useToast();
      const emit = defineEmits(['submit'])

      const listRole = ref([]);

      // Define a validation schema
      const schema = yup.object({
        roles: yup.mixed().nullable().required(t("please_choose_one")),
      });

      const { handleSubmit, resetForm } = useForm({
        validationSchema: schema,
      });

      // No need to define rules for fields
      const { value: roles, errorMessage: rolesError } = useField("roles");
      const { value: gPassword } = useField("gPassword");

      const onSubmit = handleSubmit(async (values, { resetForm }) => {
        
        const response = await services.update("users/set-role", {
          id: props.userId,
          role : values.roles,
         
        })
        .then((res) => {
            toast.success("Success", {
              timeout: 2000,
            });
            ctx.emit('submit')
        })
        .catch((e) => {
          toast.error(e.response.data, {
            timeout: 2000,
          });
        });
      });


      const generatePassword = () => {
        let result = "";
        let characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\"<>,.?/\\";
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        gPassword.value = result;
      }

      const getRole = async () => {
        await services.get(`roles`)
        .then(res => {
          res.data.forEach(element => {
            listRole.value.push({
              value: element._id,
              label: element.roleName,
            })
          });
        })
        .catch(error => console.log(error))
      }

      onMounted(async () => {
        await getRole()
      })

      watch(() => props.isOpen, (newValue) => {
        resetForm()
        roles.value = []
        roles.value = props.roleIds
      })

      return {
        resetForm,
        onSubmit,
        generatePassword,
        getRole,
        emit,
        roles,
        rolesError,
        gPassword,
        listRole,
      }
    }
});
</script>

<style lang=""></style>
