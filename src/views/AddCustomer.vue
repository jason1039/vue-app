<template>
  <div class="view">
    <h1>新增客戶</h1>
  </div>
</template>
<script>
import province_city_china from "province-city-china/data";
export default {
  data() {
    return {
      AdministrativeDistrict: {},
      AddData: {
        CustomerName: ``,
        province: ``,
        city: ``,
        area: ``,
        CustomerAddr: ``,
      },
    };
  },
  methods: {},
  watch: {
    AddData: {
      handler: function () {
        console.log(this.$data.AddData);
      },
      deep: true,
    },
  },
  created() {
    this.$data.AdministrativeDistrict = province_city_china;
  },
};
</script>