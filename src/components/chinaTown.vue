<template>
  <select
    :class="class_str"
    :value="chinaTown"
    @change="$emit(`update:chinaTown`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinaTowns">
      <option
        :key="item.province + item.city + item.area + item.town"
        :value="item.town"
        v-if="
          item.province == chinaProvince &&
          item.city == chinaCity &&
          item.area == chinaArea
        "
      >
        {{ item.name }}
      </option>
    </template>
  </select>
</template>
<script>
export default {
  name: "chinaTown",
  props: {
    chinaProvince: {
      type: String,
      required: true,
    },
    chinaCity: {
      type: String,
      required: true,
    },
    chinaTowns: {
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
    chinaTown: {
      type: String,
      required: true,
    },
  },
};
</script>