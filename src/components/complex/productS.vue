<template>
  <div class="row border">
    <inputLabel
      class_str="col-3"
      unit="mm"
      placeholder="長度"
      :value="height"
      :changeValue="changeHeight"
    ></inputLabel>
    <inputLabel
      class_str="col-3"
      unit="mm"
      placeholder="寬度"
      :value="width"
      :changeValue="changeWidth"
    ></inputLabel>
    <inputLabel
      class_str="col-3"
      unit="天"
      placeholder="預設保存期限"
      :value="defaultduration"
      :changeValue="changeDefaultduration"
    ></inputLabel>
    <div class="col-8"></div>
    <div class="col-2 center">官方貨</div>
    <switchcheckbox
      id="official"
      :value="official"
      truetext="是"
      falsetext="否"
      :func="changeOfficial"
    ></switchcheckbox>
  </div>
</template>
<script>
import inputLabel from "../single/inputLabel.vue";
import switchcheckbox from "../single/switch_checkbox.vue";
export default {
  props: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    defaultduration: {
      type: Number,
      required: true,
    },
    official: {
      type: Number,
      required: true,
    },
  },
  components: {
    inputLabel,
    switchcheckbox,
  },
  methods: {
    changeHeight(value) {
      this.$emit("update:height", value);
    },
    changeWidth(value) {
      this.$emit("update:width", value);
    },
    changeDefaultduration(value) {
      this.$emit("update:defaultduration", value);
    },
    changeOfficial(value) {
      this.$emit("update:official", value);
    },
  },
};
</script>
<style scoped>
</style>