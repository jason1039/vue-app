<template>
  <select
    :class="class_str"
    :value="city"
    @change="$emit(`update:city`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="city in citys">
      <option
        :key="city.city"
        :value="city.city"
        v-if="city.province == province"
      >
        {{ city.name }}
      </option>
    </template>
  </select>
</template>
<script>
export default {
  name: "city",
  props: {
    province: {
      type: String,
      required: true,
    },
    citys: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
};
</script>