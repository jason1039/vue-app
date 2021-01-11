<template>
  <select
    :class="class_str"
    :value="province"
    @change="$emit(`update:province`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <option
      v-for="province in provinces"
      :value="province.province"
      :key="province.province"
    >
      {{ province.name }}
    </option>
  </select>
</template>
<script>
export default {
  name: "province",
  props: {
    provinces: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
  },
};
</script>