<template>
  <select
    :class="class_str"
    :value="chinaArea"
    @change="$emit(`update:chinaArea`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinaAreas">
      <option
        :key="item.province + item.city + item.area"
        :value="item.area"
        v-if="item.province == chinaProvince && item.city == chinaCity"
      >
        {{ item.name }}
      </option>
    </template>
  </select>
</template>
<script>
export default {
  name: "chinaArea",
  props: {
    chinaProvince: {
      type: String,
      required: true,
    },
    chinaCity: {
      type: String,
      required: true,
    },
    chinaAreas: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinaArea: {
      type: String,
      required: true,
    },
  },
};
</script>