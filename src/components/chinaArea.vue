<template>
  <select
    :class="class_str"
    :value="chinaarea"
    @change="$emit(`update:chinaarea`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinaareas">
      <option
        :key="item.province + item.city + item.area"
        :value="item.area"
        v-if="item.province == chinaprovince && item.city == chinacity"
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
    chinaprovince: {
      type: String,
      required: true,
    },
    chinacity: {
      type: String,
      required: true,
    },
    chinaareas: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinaarea: {
      type: String,
      required: true,
    },
  },
};
</script>