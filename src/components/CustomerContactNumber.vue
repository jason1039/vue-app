<template>
  <div class="col-4">
    <div
      style="
        position: absolute;
        right: 6px;
        top: 1px;
        cursor: pointer;
        z-index: 1;
      "
      v-show="showClearBtn"
    >
      <button type="button" ref="clearBtn">×</button>
    </div>
    <input
      type="text"
      placeholder="聯絡人電話"
      aria-describedby="basic-addon1"
      style="position: relative; left: -15px"
      ref="input"
      :value="CustomerContactNumber"
      @input="$emit('update:CustomerContactNumber', $event.target.value)"
    />
  </div>
</template>
<script>
export default {
  name: "CustomerContactNumber",
  data() {
    return {
      showClearBtn: false,
    };
  },
  props: {
    CustomerContactNumberId: {
      type: Number,
      required: false,
      default: 0,
    },
    CustomerContactNumber: {
      type: String,
      required: false,
      default: ``,
    },
  },
  methods: {
    clear() {
      this.$emit("update:CustomerContactNumber", "");
    },
  },
  mounted() {
    let this_Vue = this;
    this.$refs.input.addEventListener("focus", function () {
      this_Vue.$data.showClearBtn = true;
    });
    this.$refs.input.addEventListener("blur", function () {
      this_Vue.$data.showClearBtn = false;
    });
    this.$refs.clearBtn.addEventListener("mousedown", function () {
      this_Vue.clear();
    });
  },
};
</script>
<style scoped>
button {
  border: 0px;
  background-color: rgba(0%, 0%, 0%, 0);
  font-weight: 900;
  cursor: pointer;
}
button:focus {
  outline: 0;
}
</style>