<template>
  <div :class="class_str">
    <input
      type="number"
      :value="value"
      :placeholder="placeholder"
      @input="changeValue_i($event.target.value)"
    />
    <span>{{ unit }}</span>
  </div>
</template>
<script>
export default {
  props: {
    class_str: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    value: {
      type: Number || String,
      required: false,
    },
    unit: {
      type: String,
      required: true,
    },
    changeValue: {
      type: Function,
      required: true,
    },
  },
  methods: {
    changeValue_i(value) {
      switch (typeof this.$props.value) {
        case "number":
          value = Number(value);
          break;
        case "string":
          value = String(value);
          break;
      }
      this.$props.changeValue(value);
    },
  },
};
</script>

<style scoped>
div {
  padding: 0px;
}
input {
  padding-left: 15px;
  padding-right: 15px;
  width: 98%;
}
span {
  position: absolute;
  right: 10%;
  top: 15%;
}
</style>