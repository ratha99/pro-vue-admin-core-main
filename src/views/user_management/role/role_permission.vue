<template>
  <div>
    <Card noborder>
      <div class="-mt-6 -mb-6">
        <div class="my-6 md:flex items-center">
          <h6 class="flex-1 md:mb-0 mb-3">{{ $t("permission_setting") }}</h6>
        </div>
        <form ref="form" @submit.prevent="onSubmit">
          <vue-good-table
            :columns="columns"
            styleClass="vgt-table bordered centered lesspadding2 table-head"
            mode="remote"
            :rows="rows"
            :sort-options="{
              enabled: false,
            }"
          >
            <template v-slot:table-row="props">
              <span v-if="props.column.field == 'view'">
                <div v-for="item in props.row.permissions" :key="item.id">
                  <Checkbox
                    v-if="item.type == 1"
                    activeClass="ring-primary-500 bg-primary-500"
                    :checked="item.check"
                    :value="item.id"
                    v-model="perIds"
                  />
                </div>
              </span>
              <span v-if="props.column.field == 'add'">
                <div v-for="item in props.row.permissions" :key="item.id">
                  <Checkbox
                    v-if="item.type == 2"
                    activeClass="ring-primary-500 bg-primary-500"
                    :checked="item.check"
                    :value="item.id"
                    v-model="perIds"
                  />
                </div>
              </span>
              <span v-if="props.column.field == 'edit'">
                <div v-for="item in props.row.permissions" :key="item.id">
                  <Checkbox
                    v-if="item.type == 3"
                    activeClass="ring-primary-500 bg-primary-500"
                    :checked="item.check"
                    :value="item.id"
                    v-model="perIds"
                  />
                </div>
              </span>
              <span v-if="props.column.field == 'delete'">
                <div v-for="item in props.row.permissions" :key="item.id">
                  <Checkbox
                    v-if="item.type == 4"
                    activeClass="ring-primary-500 bg-primary-500"
                    :checked="item.check"
                    :value="item.id"
                    v-model="perIds"
                  />
                </div>
              </span>
              <span v-if="props.column.field == 'other'">
                <div v-for="item in props.row.permissions" :key="item.id">
                  <Checkbox
                    v-if="item.type == 5"
                    :label="item.name_kh"
                    activeClass="ring-primary-500 bg-primary-500"
                    :checked="item.check"
                    :value="item.id"
                    v-model="perIds"
                  />
                </div>
              </span>
            </template>
          </vue-good-table>
          <div class="my-6 text-right">
            <Button :text="$t('save')" btnClass="btn-primary"></Button>
          </div>
        </form>
      </div>
    </Card>
  </div>
</template>
<script>
import Checkbox from "@/components/Checkbox";
import { inject, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default {
  components: {
    Checkbox,
    Button,
    Card,
  },
  setup() {
    const services = inject("services");
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const rows = ref([]);

    const schema = yup.object({});

    const { handleSubmit } = useForm({
      validationSchema: schema,
    });
    // No need to define rules for fields

    const { value: perIds } = useField("perIds");

    perIds.value = [];

    const onSubmit = handleSubmit(async (values) => {
      console.log("Submit", values);
      const response = await services
        .post("role_permission/store", {
          role_id: route.params.id,
          permissions: values.perIds,
        })
        .then((res) => {
          toast.success("Success", {
            timeout: 2000,
          });
        })
        .catch((e) => {
          toast.error(e.response.data, {
            timeout: 2000,
          });
        });
    });

    const getRolePermission = async (id) => {
      await services
        .get(`role_permission/${id}`)
        .then((res) => {
          rows.value = res.data;
          res.data.forEach((menu) => {
            menu.permissions.forEach((per) => {
              if (per.check) {
                perIds.value.push(per.id);
              }
            });
          });
        })
        .catch((error) => console.log(error));
    };

    onMounted(async () => {
      await getRolePermission(route.params.id);
    });

    return {
      columns: [
        {
          label: t("function"),
          field: "name_kh",
        },
        {
          label: t("view"),
          field: "view",
        },
        {
          label: t("add"),
          field: "add",
        },
        {
          label: t("edit"),
          field: "edit",
        },
        {
          label: t("delete"),
          field: "delete",
        },
        {
          label: t("other"),
          field: "other",
        },
      ],
      rows,
      perIds,
      onSubmit,
      getRolePermission,
    };
  },
};
</script>
