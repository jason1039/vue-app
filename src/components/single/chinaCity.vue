<template>
  <select
    :class="class_str"
    :value="chinacity"
    @change="$emit(`update:chinacity`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinacitys">
      <option
        :key="item.province + item.city"
        :value="item.city"
        v-if="item.province == chinaprovince"
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
    chinaprovince: {
      type: String,
      required: true,
    },
    chinacitys: {
      type: Array,
      required: true,
    },
    class_str: {
      type: String,
      required: true,
    },
    chinacity: {
      type: String,
      required: true,
    },
  },
};
</script>