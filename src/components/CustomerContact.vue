<template>
  <div class="row border">
    <input
      type="text"
      :value="contactpersonname"
      placeholder="聯絡人名稱"
      class="col-3"
      @input="$emit('update:contactpersonname', $event.target.value)"
    />
    <select
      class="col-2"
      :value="sex"
      @change="$emit('update:sex', $event.target.value)"
    >
      <option value="M">男</option>
      <option value="W">女</option>
    </select>
    <select
      class="col-3"
      :value="agegroup"
      @change="$emit('update:agegroup', $event.target.value)"
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
        value="liqueur"
        :checked="liqueur == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">抽菸</span>
      <input
        type="checkbox"
        class="col-auto"
        value="smoke"
        :checked="smoke == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">唱歌</span>
      <input
        type="checkbox"
        class="col-auto"
        value="sing"
        :checked="sing == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <div class="col-3 row">
      <span class="col-auto" style="font-size: larger">送禮</span>
      <input
        type="checkbox"
        class="col-auto"
        value="gifts"
        :checked="gifts == 'Y'"
        @change="changeCheckbox($event.target.value, $event.target.checked)"
        style="height: 25px; width: 40px"
      />
    </div>
    <input
      type="text"
      :value="dwell"
      class="col-8"
      @input="$emit('update:dwell', $event.target.value)"
      placeholder="聯絡人住址"
    />
    <input type="text" class="col-12" placeholder="聯絡人備註" />
    <CustomerContactNumber
      v-for="number in customercontactnumbers"
      :key="number.customercontactnumberid"
      :customercontactnumberid.sync="number.customercontactnumberid"
      :customercontactnumber.sync="number.customercontactnumber"
    ></CustomerContactNumber>
  </div>
</template>
<script>
import CustomerContactNumber from "./CustomerContactNumber.vue";
export default {
  name: "CustomerContact",
  props: {
    customercontactid: {
      type: Number,
      required: false,
      default: 0,
    },
    contactpersonname: {
      type: String,
      required: true,
      default: ``,
    },
    sex: {
      type: String,
      default: "M",
    },
    agegroup: {
      type: String,
      default: "2",
    },
    liqueur: {
      type: String,
      default: "Y",
    },
    smoke: {
      type: String,
      default: "N",
    },
    sing: {
      type: String,
      default: "N",
    },
    gifts: {
      type: String,
      default: "N",
    },
    dwell: {
      type: String,
      required: true,
      default: ``,
    },
    customercontactnumbers: {
      type: Array,
      required: false,
    },
  },
  methods: {
    pushContactNumber() {
      this.$props.customercontactnumbers.push({});
    },
    changeCheckbox(value, checked) {
      this.$emit(`update:${value}`, checked ? "Y" : "N");
    },
  },
  components: {
    CustomerContactNumber,
  },
  watch: {
    customercontactnumbers: {
      handler: async function () {
        let count = 0;
        this.$props.customercontactnumbers.filter((item, index) => {
          if (!item.customercontactnumber) count++;
          if (count > 1) {
            this.$props.customercontactnumbers.splice(index, 1);
            count--;
          }
        });
        if (!count) this.pushContactNumber();
      },
      deep: true,
    },
  },
  mounted() {
    this.pushContactNumber();
  },
};
</script>
<style scoped>
.border {
  margin-bottom: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>