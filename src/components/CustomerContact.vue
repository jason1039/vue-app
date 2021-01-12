<template>
  <div class="row border">
    <input
      type="text"
      :value="ContactPersonName"
      placeholder="聯絡人名稱"
      class="col-3"
      @input="$emit('update:ContactPersonName', $event.target.value)"
    />
    <select
      class="col-2"
      :value="Sex"
      @change="$emit('update:Sex', $event.target.value)"
    >
      <option value="M">男</option>
      <option value="W">女</option>
    </select>
    <select
      class="col-3"
      :value="AgeGroup"
      @change="$emit('update:AgeGroup', $event.target.value)"
    >
      <option value="1">0-19歲</option>
      <option value="2">20-39歲</option>
      <option value="3">40-59歲</option>
      <option value="4">60-79歲</option>
      <option value="5">80-99歲</option>
    </select>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">喝酒</span>
      <input
        type="checkbox"
        class="col-auto"
        value="LikeLiqueur"
        :checked="LikeLiqueur == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">抽菸</span>
      <input
        type="checkbox"
        class="col-auto"
        value="LikeLiqueur"
        :checked="LikeLiqueur == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">唱歌</span>
      <input
        type="checkbox"
        class="col-auto"
        value="LikeLiqueur"
        :checked="LikeLiqueur == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">送禮</span>
      <input
        type="checkbox"
        class="col-auto"
        value="LikeLiqueur"
        :checked="LikeLiqueur == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <input
      type="text"
      :value="Dwell"
      class="col-8"
      @input="$emit('update:Dwell', $event.target.value)"
      placeholder="聯絡人住址"
    />
    <input type="text" class="col-12" placeholder="聯絡人備註" />
    <CustomerContactNumber
      v-for="number in CustomerContactNumbers"
      :key="number.CustomerContactNumberId"
      :CustomerContactNumberId.sync="number.CustomerContactNumberId"
      :CustomerContactNumber.sync="number.CustomerContactNumber"
    ></CustomerContactNumber>
  </div>
</template>
<script>
import CustomerContactNumber from "./CustomerContactNumber.vue";
export default {
  name: "CustomerContact",
  props: {
    CustomerContactId: {
      type: Number,
      required: false,
      default: 0,
    },
    ContactPersonName: {
      type: String,
      required: true,
      default: ``,
    },
    Sex: {
      type: String,
      default: "M",
    },
    AgeGroup: {
      type: Number,
      default: 2,
    },
    LikeLiqueur: {
      type: String,
      default: "Y",
    },
    Dwell: {
      type: String,
      required: true,
      default: ``,
    },
    CustomerContactNumbers: {
      type: Array,
      required: false,
    },
  },
  methods: {
    pushContactNumber() {
      this.$props.CustomerContactNumbers.push({});
    },
    changeCheckbox(value, checked) {
      this.$emit(`update:${value}`, checked ? "Y" : "N");
    },
  },
  components: {
    CustomerContactNumber,
  },
  watch: {
    CustomerContactNumbers: {
      handler: async function () {
        let count = 0;
        this.$props.CustomerContactNumbers.filter((item, index) => {
          if (!item.CustomerContactNumber) count++;
          if (count > 1) {
            this.$props.CustomerContactNumbers.splice(index, 1);
            count--;
          }
        });
        if (!count) this.pushContactNumber();
      },
      deep: true,
    },
  },
};
</script>