<template>
  <div class="view">
    <h1>編輯客戶</h1>
    <div class="row">
      <div class="col-4">客戶名稱</div>
      <input
        type="text"
        class="col-16"
        v-model="EditData.customername"
        disabled="disabled"
      />
      <div class="col-4" v-if="chinaShow.chinaprovince">客戶位置(省)</div>
      <chinaProvince
        v-if="chinaShow.chinaprovince"
        :chinaprovinces="AdministrativeDistrict.province"
        class_str="col-6"
        :chinaprovince.sync="EditData.customerprovince"
      ></chinaProvince>
      <div class="col-4" v-if="chinaShow.chinacity">客戶位置(市)</div>
      <chinaCity
        v-if="chinaShow.chinacity"
        :chinacitys="AdministrativeDistrict.city"
        class_str="col-6"
        :chinacity.sync="EditData.customercity"
        :chinaprovince.sync="EditData.customerprovince"
      ></chinaCity>
      <div class="col-4" v-if="chinaShow.chinaarea">客戶位置(區)</div>
      <chinaArea
        v-if="chinaShow.chinaarea"
        :chinaareas="AdministrativeDistrict.area"
        class_str="col-6"
        :chinaarea.sync="EditData.customerarea"
        :chinaprovince.sync="EditData.customerprovince"
        :chinacity.sync="EditData.customercity"
      ></chinaArea>
      <div class="col-4" v-if="chinaShow.chinatown">客戶位置(街)</div>
      <chinaTown
        v-if="chinaShow.chinatown"
        :chinatowns="AdministrativeDistrict.town"
        class_str="col-6"
        :chinaarea.sync="EditData.customerarea"
        :chinaprovince.sync="EditData.customerprovince"
        :chinacity.sync="EditData.customercity"
        :chinatown.sync="EditData.customertown"
      ></chinaTown>
      <div class="col-4">客戶地址</div>
      <input type="text" class="col-6" v-model="EditData.customeraddr" />
    </div>
    <h3>聯絡人</h3>
    <CustomerContact
      v-for="(item, index) in EditData.customercontact"
      :customercontactid.sync="item.customercontactid"
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
        class="btn btn-success"
        style="margin-left: 10%; margin-right: 10%"
        value="存檔"
        @click="submit()"
      />
      <input
        type="button"
        class="btn btn-secondary"
        style="margin-left: 10%; margin-right: 10%"
        value="取消"
        @click="cancel()"
      />
      <input
        type="button"
        class="btn btn-warning"
        style="margin-left: 10%; margin-right: 10%"
        value="復原"
        @click="reset()"
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
      EditData: {
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
      setData: {
        chinacity: false,
        chinaarea: false,
        chinatown: false,
      },
      OldData: {},
    };
  },
  methods: {
    async computeCity() {
      if (
        !this.$data.AdministrativeDistrict.city.filter(
          (x) => x.province == this.$data.EditData.customerprovince
        ).length
      ) {
        this.$data.EditData.customercity = "01";
        this.$data.chinaShow.chinacity = false;
      } else {
        if (this.$data.setData.chinacity) {
          this.$data.EditData.customercity = "";
          this.$data.setData.chinacity = true;
        }
        this.$data.chinaShow.chinacity = true;
      }
      await this.computeArea();
    },
    async computeArea() {
      if (
        !this.$data.AdministrativeDistrict.area.filter(
          (x) =>
            x.province == this.$data.EditData.customerprovince &&
            x.city == this.$data.EditData.customercity
        ).length
      ) {
        this.$data.EditData.customerarea = "01";
        this.$data.chinaShow.chinaarea = false;
      } else {
        if (this.$data.setData.chinaarea) {
          this.$data.EditData.customerarea = "";
          this.$data.setData.chinaarea = true;
        }
        this.$data.chinaShow.chinaarea = true;
      }
      await this.computeTown();
    },
    async computeTown() {
      if (
        !this.$data.AdministrativeDistrict.town.filter(
          (x) =>
            x.province == this.$data.EditData.customerprovince &&
            x.city == this.$data.EditData.customercity &&
            x.area == this.$data.EditData.customerarea
        ).length
      ) {
        this.$data.EditData.customertown = "01";
        this.$data.chinaShow.chinatown = false;
      } else {
        if (this.$data.setData.chinatown) {
          this.$data.EditData.customertown = "";
          this.$data.setData.chinatown = true;
        }
        this.$data.chinaShow.chinatown = true;
      }
    },
    pushContact() {
      this.$data.EditData.customercontact.push({
        customercontactnumbers: [{}],
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    submit() {
      this.setAxiosEditData();
      // let that = this;
      // let submitData = JSON.parse(JSON.stringify(this.$data.EditData));
      // submitData.customercontact.forEach((contact, index) => {
      // if (!contact.contactpersonname) {
      // submitData.customercontact.splice(index, 1);
      // } else {
      // contact.customercontactnumbers.forEach((number, index) => {
      // if (!number.customercontactnumber)
      // contact.customercontactnumbers.splice(index, 1);
      // });
      // }
      // });
      // this.axios
      // .post(`/customer`, { customer: [submitData] })
      // .then(() => {
      // that.$router.go(-1);
      // })
      // .catch((err) => {
      // console.log(err);
      // });
    },
    reset() {
      this.$data.setData = {
        chinacity: false,
        chinaarea: false,
        chinatown: false,
      };
      this.$data.EditData = JSON.parse(JSON.stringify(this.$data.OldData));
    },
    async getData(id) {
      let that = this;
      this.axios
        .get("/Object/customer", { params: { id: id } })
        .then((request) => {
          that.EditData = request.data[0];
          that.OldData = JSON.parse(JSON.stringify(request.data[0]));
        });
    },
    setAxiosEditData() {
      let id = this.$route.params.customerid;
      let data = JSON.parse(JSON.stringify(this.$data.EditData));
      Object.keys(data).forEach((x) => {
        if (typeof data[x] == `object`) delete data[x];
      });
      delete data.customerid;
      console.log(data);
      this.axios
        .patch("/customer", {
          params: {
            data: data,
            wheres: {
              custimerid: id,
            },
          },
        })
        .then((response) => {
          console.log(response);
          // this.$data.CustomerList = response.data.recordset;
        })
        .catch((err) => {
          console.log(
            JSON.parse(err.response.request.response).originalError.info.message
          );
        });
    },
  },
  watch: {
    "EditData.customerprovince": {
      handler: async function () {
        await this.computeCity();
      },
      deep: true,
    },
    "EditData.customercity": {
      handler: async function () {
        await this.computeArea();
      },
      deep: true,
    },
    "EditData.customerarea": {
      handler: async function () {
        await this.computeTown();
      },
      deep: true,
    },
    "EditData.customercontact.customercontactnumbers": {
      handler: async function () {
        let count = 0;
        this.$data.EditData.customercontact.filter((item, index) => {
          if (!item.contactpersonname) count++;
          if (count > 1) {
            this.$data.EditData.customercontact.splice(index, 1);
            count--;
          }
        });
        if (!count) this.pushContact();
      },
      deep: true,
    },
    EditData: {
      handler: async function () {
        // console.log(this.$data.EditData);
      },
      deep: false,
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
  },
  async mounted() {
    await this.getData(this.$route.params.customerid);
  },
};
</script>