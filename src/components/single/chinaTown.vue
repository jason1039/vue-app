<template>
  <select
    :class="class_str"
    :value="chinatown"
    @change="$emit(`update:chinatown`, $event.target.value)"
  >
    <option value="">請選擇...</option>
    <template v-for="item in chinatowns">
      <option
        :key="item.province + item.city + item.area + item.town"
        :value="item.town"
        v-if="
          item.province == chinaprovince &&
          item.city == chinacity &&
          item.area == chinaarea
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
    chinaprovince: {
      type: String,
      required: true,
    },
    chinacity: {
      type: String,
      required: true,
    },
    chinatowns: {
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
    chinatown: {
      type: String,
      required: true,
    },
  },
};
</script>