<template>
  <div class="view">
    <h1>新增客戶</h1>
    <div class="row">
      <div class="col-4">客戶名稱</div>
      <input type="text" class="col-16" />
      <div class="col-4" v-if="chinaShow.chinaProvince">客戶位置(省)</div>
      <chinaProvince
        v-if="chinaShow.chinaProvince"
        :chinaProvinces="AdministrativeDistrict.province"
        class_str="col-6"
        :chinaProvince.sync="AddData.chinaProvince"
      ></chinaProvince>
      <div class="col-4" v-if="chinaShow.chinaCity">客戶位置(市)</div>
      <chinaCity
        v-if="chinaShow.chinaCity"
        :chinaCitys="AdministrativeDistrict.city"
        class_str="col-6"
        :chinaCity.sync="AddData.chinaCity"
        :chinaProvince.sync="AddData.chinaProvince"
      ></chinaCity>
      <div class="col-4" v-if="chinaShow.chinaArea">客戶位置(區)</div>
      <chinaArea
        v-if="chinaShow.chinaArea"
        :chinaAreas="AdministrativeDistrict.area"
        class_str="col-6"
        :chinaArea.sync="AddData.chinaArea"
        :chinaProvince.sync="AddData.chinaProvince"
        :chinaCity.sync="AddData.chinaCity"
      ></chinaArea>
      <div class="col-4" v-if="chinaShow.chinaTown">客戶位置(街)</div>
      <chinaTown
        v-if="chinaShow.chinaTown"
        :chinaTowns="AdministrativeDistrict.town"
        class_str="col-6"
        :chinaArea.sync="AddData.chinaArea"
        :chinaProvince.sync="AddData.chinaProvince"
        :chinaCity.sync="AddData.chinaCity"
        :chinaTown.sync="AddData.chinaTown"
      ></chinaTown>
      <div class="col-4">客戶地址</div>
      <input type="text" class="col-6" />
    </div>
    <h3>聯絡人</h3>
    <div class="row">
      <CustomerContact
        v-for="(item, index) in AddData.CustomerContact"
        :ContactPersonName.sync="item.ContactPersonName"
        :Sex.sync="item.Sex"
        :AgeGroup.sync="item.AgeGroup"
        :LikeLiqueur.sync="item.LikeLiqueur"
        :Dwell.sync="item.Dwell"
        :key="'contact_' + index"
      ></CustomerContact>
    </div>
  </div>
</template>
<script>
import province_city_china from "province-city-china/data";
import chinaProvince from "../components/chinaProvince.vue";
import chinaCity from "../components/chinaCity.vue";
import chinaArea from "../components/chinaArea.vue";
import chinaTown from "../components/chinaTown.vue";
import CustomerContact from "../components/CustomerContact.vue";
export default {
  data() {
    return {
      AdministrativeDistrict: {},
      AddData: {
        CustomerName: ``,
        chinaProvince: ``,
        chinaCity: ``,
        chinaArea: ``,
        chinaTown: ``,
        CustomerAddr: ``,
        code: ``,
        CustomerContact: [],
      },
      chinaShow: {
        chinaProvince: true,
        chinaCity: false,
        chinaArea: false,
        chinaTown: false,
      },
    };
  },
  methods: {
    async computeCity() {
      if (
        !this.$data.AdministrativeDistrict.city.filter(
          (x) => x.province == this.$data.AddData.chinaProvince
        ).length
      ) {
        this.$data.AddData.chinaCity = "01";
        this.$data.chinaShow.chinaCity = false;
      } else {
        this.$data.AddData.chinaCity = "";
        this.$data.chinaShow.chinaCity = true;
      }
      await this.computeArea();
    },
    async computeArea() {
      if (
        !this.$data.AdministrativeDistrict.area.filter(
          (x) =>
            x.province == this.$data.AddData.chinaProvince &&
            x.city == this.$data.AddData.chinaCity
        ).length
      ) {
        this.$data.AddData.chinaArea = "01";
        this.$data.chinaShow.chinaArea = false;
      } else {
        this.$data.AddData.chinaArea = "";
        this.$data.chinaShow.chinaArea = true;
      }
      await this.computeTown();
    },
    async computeTown() {
      if (
        !this.$data.AdministrativeDistrict.town.filter(
          (x) =>
            x.province == this.$data.AddData.chinaProvince &&
            x.city == this.$data.AddData.chinaCity &&
            x.area == this.$data.AddData.chinaArea
        ).length
      ) {
        this.$data.AddData.chinaTown = "01";
        this.$data.chinaShow.chinaTown = false;
      } else {
        this.$data.AddData.chinaTown = "";
        this.$data.chinaShow.chinaTown = true;
      }
    },
    pushContact() {
      this.$data.AddData.CustomerContact.push({});
      // {
      //   Sex: "M",
      //   AgeGroup: 2,
      //   LikeLiqueur: "Y",
      //   Dwell: "",
      // }
    },
  },
  watch: {
    "AddData.chinaProvince": {
      handler: async function () {
        await this.computeCity();
      },
      deep: true,
    },
    "AddData.chinaCity": {
      handler: async function () {
        await this.computeArea();
      },
      deep: true,
    },
    "AddData.chinaArea": {
      handler: async function () {
        await this.computeTown();
      },
      deep: true,
    },
  },
  components: {
    chinaCity,
    chinaProvince,
    chinaArea,
    chinaTown,
    CustomerContact,
  },
  computed: {},
  created() {
    console.log(province_city_china);
    this.$data.AdministrativeDistrict = province_city_china;
    this.pushContact();
  },
};
</script>