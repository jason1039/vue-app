<template>
  <select
    :class="class_str"
    :value="chinaprovince"
    @change="$emit(`update:chinaprovince`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <option
      v-for="item in chinaprovinces"
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
    chinaprovinces: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinaprovince: {
      type: String,
      required: true,
    },
  },
};
</script>