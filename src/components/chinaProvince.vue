<template>
  <select
    :class="class_str"
    :value="chinaProvince"
    @change="$emit(`update:chinaProvince`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <option
      v-for="item in chinaProvinces"
      :value="item.province"
      :key="item.province"
    >
      {{ item.name }}
    </option>
  </select>
</template>
<script>
export default {
  name: "chinaProvince",
  props: {
    chinaProvinces: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinaProvince: {
      type: String,
      required: true,
    },
  },
};
</script>