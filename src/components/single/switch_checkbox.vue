<template>
  <div class="switch">
    <input
      :class="'switch-checkbox ' + class_str"
      :id="id"
      type="checkbox"
      name="switch-checkbox"
      :checked="value === 1"
      @change="returnFunc($event.target.checked ? 1 : 0)"
    />
    <label class="switch-label" :for="id">
      <span class="switch-txt" :turnOn="truetext" :turnOff="falsetext"></span>
      <span class="switch-Round-btn"></span>
    </label>
  </div>
</template>
<script>
export default {
  name: "switchcheckbox",
  props: {
    id: {
      type: String,
      required: true,
    },
    class_str: {
      type: String,
      required: false,
      default: "col-1",
    },
    value: {
      type: Number,
      required: true,
    },
    truetext: {
      type: String,
      required: true,
    },
    falsetext: {
      type: String,
      required: true,
    },
    func: {
      type: Function,
      required: false,
    },
  },
  methods: {
    returnFunc(e) {
      this.$props.func ? this.$props.func(e) : this.$emit("update:value", e);
    },
  },
};
</script>
<style scoped>
.switch {
  /*==設定開關鈕的長寬==*/
  position: relative;
  width: 65px;
  height: 30px;
  line-height: 30px;
}
.switch-checkbox {
  position: absolute;
  display: none;
}
.switch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border-radius: 20px;
}
.switch-txt {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
}
.switch-txt::before,
.switch-txt::after {
  display: block;
  float: right;
  width: 50%;
  font-size: 13px;
  color: #fff;
  font-weight: bold;
  box-sizing: border-box;
}
/*==開關鈕底色(開啟時)==*/
.switch-txt::after {
  content: attr(turnOn);
  padding-left: 10px;
  background: #1ba0ef;
  color: #fff;
  text-align: initial;
}
/*開關鈕底色(關閉時)*/
.switch-txt::before {
  content: attr(turnOff);
  padding-right: 10px;
  background: #eee;
  color: #ccc;
  text-align: right;
}
/*==開關鈕的顏色與大小==*/
.switch-Round-btn {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  margin: 2px;
  background: #fff;
  top: 0;
  bottom: 0;
  right: 35px;
  border-radius: 13px;
  transition: all 0.3s ease-in 0s;
}
.switch-checkbox:checked + .switch-label .switch-txt {
  margin-left: 0;
}
.switch-checkbox:checked + .switch-label .switch-Round-btn {
  right: 0;
}
</style>
