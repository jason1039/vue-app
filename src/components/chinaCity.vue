<template>
  <select
    :class="class_str"
    :value="chinaCity"
    @change="$emit(`update:chinaCity`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinaCitys">
      <option
        :key="item.province + item.city"
        :value="item.city"
        v-if="item.province == chinaProvince"
      >
        {{ item.name }}
      </option>
    </template>
  </select>
</template>
<script>
export default {
  name: "city",
  props: {
    chinaProvince: {
      type: String,
      required: true,
    },
    chinaCitys: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinaCity: {
      type: String,
      required: true,
    },
  },
};
</script>