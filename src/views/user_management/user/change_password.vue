<template>
<div>
    <Modal :title="$t('change_password')" :activeModal="isOpen" themeClass="bg-primary-500">
        <form ref="form" @submit.prevent="onSubmit" class="space-y-5">
            <Textinput :label="$t('password')" type="password" placeholder="" v-model="password" :error="passwordError" />
            <Textinput :label="$t('confirm_Password')" type="password" placeholder="" v-model="cPassword" :error="cPasswordError" />
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
import { useI18n } from 'vue-i18n';
import VueSelect from "@/components/Select/VueSelect";
import vSelect from "vue-select";
import { defineEmits, defineComponent, onMounted, watch, inject } from 'vue';
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import { number } from "yup/lib/locale";
import { useToast } from "vue-toastification";
export default defineComponent({
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        userId: number
    },
    components: {
        Modal,
        Button,
        VueSelect,
        vSelect,
        Textinput,
    },
    setup(props, ctx) {
        const services = inject('services');
        const { t } = useI18n();
        const toast = useToast();
        const emit = defineEmits(['submit'])

        // Define a validation schema
        const schema = yup.object({
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
        const { value: password, errorMessage: passwordError } = useField("password");
        const { value: cPassword, errorMessage: cPasswordError } = useField("cPassword");

        const onSubmit = handleSubmit(async (values, { resetForm }) => {
            const response = await services.update("users/reset-password", {

                    id: props.userId,
                    newPassword: values.password,
                    confirmPassword: values.cPassword
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

        onMounted(() => {})

        watch(() => props.isOpen, (newValue) => {
            resetForm()
        })

        return {
            password,
            cPassword,
            passwordError,
            cPasswordError,
            emit,
            resetForm,
            onSubmit,
        }
    }
});
</script>

<style lang=""></style>
