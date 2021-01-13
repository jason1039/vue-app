<template>
  <div class="view">
    <h1>新增客戶</h1>
    <div class="row">
      <div class="col-4">客戶名稱</div>
      <input type="text" class="col-16" v-model="AddData.customername" />
      <div class="col-4" v-if="chinaShow.chinaprovince">客戶位置(省)</div>
      <chinaProvince
        v-if="chinaShow.chinaprovince"
        :chinaprovinces="AdministrativeDistrict.province"
        class_str="col-6"
        :chinaprovince.sync="AddData.customerprovince"
      ></chinaProvince>
      <div class="col-4" v-if="chinaShow.chinacity">客戶位置(市)</div>
      <chinaCity
        v-if="chinaShow.chinacity"
        :chinacitys="AdministrativeDistrict.city"
        class_str="col-6"
        :chinacity.sync="AddData.customercity"
        :chinaprovince.sync="AddData.customerprovince"
      ></chinaCity>
      <div class="col-4" v-if="chinaShow.chinaarea">客戶位置(區)</div>
      <chinaArea
        v-if="chinaShow.chinaarea"
        :chinaareas="AdministrativeDistrict.area"
        class_str="col-6"
        :chinaarea.sync="AddData.customerarea"
        :chinaprovince.sync="AddData.customerprovince"
        :chinacity.sync="AddData.customercity"
      ></chinaArea>
      <div class="col-4" v-if="chinaShow.chinatown">客戶位置(街)</div>
      <chinaTown
        v-if="chinaShow.chinatown"
        :chinatowns="AdministrativeDistrict.town"
        class_str="col-6"
        :chinaarea.sync="AddData.customerarea"
        :chinaprovince.sync="AddData.customerprovince"
        :chinacity.sync="AddData.customercity"
        :chinatown.sync="AddData.customertown"
      ></chinaTown>
      <div class="col-4">客戶地址</div>
      <input type="text" class="col-6" v-model="AddData.customeraddr" />
    </div>
    <h3>聯絡人</h3>
    <CustomerContact
      v-for="(item, index) in AddData.customercontact"
      :contactpersonname.sync="item.contactpersonname"
      :sex.sync="item.sex"
      :agegroup.sync="item.agegroup"
      :liqueur.sync="item.liqueur"
      :smoke.sync="item.smoke"
      :sing.sync="item.sing"
      :gifts.sync="item.gifts"
      :dwell.sync="item.dwell"
      :customercontactnumbers="item.customercontactnumbers || []"
      :key="'contact_' + index"
    ></CustomerContact>
    <div class="col-20 text-right">
      <input
        type="button"
        class="btn btn-primary"
        value="新增"
        @click="submit()"
      />
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
        customername: ``,
        customerprovince: ``,
        customercity: ``,
        customerarea: ``,
        customertown: ``,
        customeraddr: ``,
        customercontact: [],
      },
      chinaShow: {
        chinaprovince: true,
        chinacity: false,
        chinaarea: false,
        chinatown: false,
      },
    };
  },
  methods: {
    async computeCity() {
      if (
        !this.$data.AdministrativeDistrict.city.filter(
          (x) => x.province == this.$data.AddData.customerprovince
        ).length
      ) {
        this.$data.AddData.customercity = "01";
        this.$data.chinaShow.chinacity = false;
      } else {
        this.$data.AddData.customercity = "";
        this.$data.chinaShow.chinacity = true;
      }
      await this.computeArea();
    },
    async computeArea() {
      if (
        !this.$data.AdministrativeDistrict.area.filter(
          (x) =>
            x.province == this.$data.AddData.customerprovince &&
            x.city == this.$data.AddData.customercity
        ).length
      ) {
        this.$data.AddData.customerarea = "01";
        this.$data.chinaShow.chinaarea = false;
      } else {
        this.$data.AddData.customerarea = "";
        this.$data.chinaShow.chinaarea = true;
      }
      await this.computeTown();
    },
    async computeTown() {
      if (
        !this.$data.AdministrativeDistrict.town.filter(
          (x) =>
            x.province == this.$data.AddData.customerprovince &&
            x.city == this.$data.AddData.customercity &&
            x.area == this.$data.AddData.customerarea
        ).length
      ) {
        this.$data.AddData.customertown = "01";
        this.$data.chinaShow.chinatown = false;
      } else {
        this.$data.AddData.customertown = "";
        this.$data.chinaShow.chinatown = true;
      }
    },
    pushContact() {
      this.$data.AddData.customercontact.push({
        customercontactnumbers: [{}],
      });
    },
    submit() {
      let that = this;
      let submitData = JSON.parse(JSON.stringify(this.$data.AddData));
      submitData.customercontact.forEach((contact, index) => {
        if (!contact.contactpersonname) {
          submitData.customercontact.splice(index, 1);
        } else {
          contact.customercontactnumbers.forEach((number, index) => {
            if (!number.customercontactnumber)
              contact.customercontactnumbers.splice(index, 1);
          });
        }
      });
      this.axios
        .post(`/customer`, { customer: [submitData] })
        .then(() => {
          that.$router.go(-1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    "AddData.customerprovince": {
      handler: async function () {
        await this.computeCity();
      },
      deep: true,
    },
    "AddData.customercity": {
      handler: async function () {
        await this.computeArea();
      },
      deep: true,
    },
    "AddData.customerarea": {
      handler: async function () {
        await this.computeTown();
      },
      deep: true,
    },
    "AddData.customercontact.customercontactnumbers": {
      handler: async function () {
        let count = 0;
        this.$data.AddData.customercontact.filter((item, index) => {
          if (!item.contactpersonname) count++;
          if (count > 1) {
            this.$data.AddData.customercontact.splice(index, 1);
            count--;
          }
        });
        if (!count) this.pushContact();
      },
      deep: true,
    },
    AddData: {
      handler: async function () {
        // console.log(this.$data.AddData);
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
    this.$data.AdministrativeDistrict = province_city_china;
    this.pushContact();
  },
};
</script>