<template>
  <div class="view">
    <h1>客戶</h1>
    <div class="row search">
      <div class="col-20 text-left Title">查詢</div>
      <div class="col-2 text-left Subject">客戶名稱</div>
      <input
        type="text"
        class="col-3 text-left"
        v-model="QuerySelector.CustomerName"
      />
      <div class="col-2 text-left Subject">客戶位置(省)</div>
      <chinaProvince
        :chinaProvinces="AdministrativeDistrict.province"
        class_str="col-2"
        :chinaProvince.sync="QuerySelector.chinaProvince"
      ></chinaProvince>
      <div class="col-2 text-left Subject">客戶位置(市)</div>
      <!-- <city
        :citys="AdministrativeDistrict.city"
        class_str="col-2"
        :city.sync="QuerySelector.city"
        :province.sync="QuerySelector.province"
      ></city> -->
      <div class="col-2 text-left Subject">客戶位置(區)</div>
      <select class="col-2" v-model="QuerySelector.area">
        <option value="">請選擇...</option>
        <template v-for="area in AdministrativeDistrict.area">
          <option
            :key="area.area"
            :value="area.area"
            v-if="
              area.province == QuerySelector.province &&
              area.city == QuerySelector.city
            "
          >
            {{ area.name }}
          </option>
        </template>
      </select>
      <div class="col-2"></div>
      <div class="col-2 text-left Subject">客戶地址</div>
      <input
        type="text"
        class="col-3 text-left"
        v-model="QuerySelector.CustomerAddr"
      />
      <div class="col-13"></div>
      <router-link to="/Customer/Add" class="col-1 text-right"
        ><img src="../assets/add.png" style="width: 22px"
      /></router-link>
    </div>
    <div class="row">
      <div class="col-4 text-left">客戶名稱</div>
      <div class="col-2 text-left">客戶位置(省)</div>
      <div class="col-2 text-left">客戶位置(市)</div>
      <div class="col-2 text-left">客戶位置(區)</div>
      <div class="col-8 text-center">客戶地址</div>
      <div class="col-2 text-center">編輯</div>
    </div>
    <div
      v-for="customer in CustomerList"
      :key="customer.CustomerId"
      class="row"
    >
      <div class="col-4 text-left">{{ customer.CustomerName }}</div>
      <div class="col-2 text-left">{{ customer.CustomerProvince }}</div>
      <div class="col-2 text-left">{{ customer.CustomerArea }}</div>
      <div class="col-2 text-left">{{ customer.CustomerCity }}</div>
      <div class="col-8 text-center">{{ customer.CustomerAddr }}</div>
      <router-link to="/Customer/Edit" class="col-2 text-center"
        ><img src="../assets/edit.png" style="width: 18px"
      /></router-link>
    </div>
  </div>
</template>
<script>
import province_city_china from "province-city-china/data";
import chinaProvince from "../components/chinaProvince.vue";
// import city from "../components/city.vue";
export default {
  data() {
    return {
      CustomerList: [],
      AdministrativeDistrict: {},
      QuerySelector: {
        CustomerName: ``,
        chinaProvince: ``,
        chinaCity: ``,
        chinaArea: ``,
        CustomerAddr: ``,
      },
    };
  },
  methods: {
    getCustomerList() {
      this.axios
        .get("/Customer&CustomerContact", {
          params: {
            columns: [],
            wheres: { CustomerAddr: "1" },
          },
        })
        .then((response) => {
          this.$data.CustomerList = response.data.recordset;
        })
        .catch((err) => {
          console.log(
            JSON.parse(err.response.request.response).originalError.info.message
          );
        });
    },
    postCustomer() {
      this.axios
        .post("/Customer&CustomerContact", {
          params: {
            data: {
              CustomerName: "test",
              CustomerProvince: 1,
              CustomerArea: 2,
              CustomerCity: 3,
              ContactPersonName: "望大名",
            },
          },
        })
        .then((response) => {
          this.$data.CustomerList = response.data.recordset;
        })
        .catch((err) => {
          console.log(
            JSON.parse(err.response.request.response).originalError.info.message
          );
        });
    },
    patchCustomer() {
      this.axios
        .patch("/Customer&CustomerContact", {
          params: {
            data: {
              CustomerName: "test",
              CustomerProvince: 4,
              CustomerArea: 5,
              CustomerCity: 6,
              ContactPersonName: "望大名",
              LikeLiqueur: "T",
            },
            wheres: {
              CustomerId: 20,
            },
          },
        })
        .then((response) => {
          this.$data.CustomerList = response.data.recordset;
        })
        .catch((err) => {
          console.log(
            JSON.parse(err.response.request.response).originalError.info.message
          );
        });
    },
    putCustomer() {
      this.axios
        .put("/Customer&CustomerContact", {
          params: {
            data: {
              ContactPersonName: "望大名",
              LikeLiqueur: "T",
            },
            wheres: {
              CustomerId: 20,
            },
          },
        })
        .then((response) => {
          this.$data.CustomerList = response.data.recordset;
        })
        .catch((err) => {
          console.log(
            JSON.parse(err.response.request.response).originalError.info.message
          );
        });
    },
    computeSelector() {
      let params = [];
      let QuerySelector = this.$data.QuerySelector;
      if (QuerySelector.CustomerName)
        params.push(`CustomerName like '%${QuerySelector.CustomerName}%'`);
      if (QuerySelector.province)
        params.push(`CustomerProvince = '${QuerySelector.province}'`);
      if (QuerySelector.city)
        params.push(`CustomerCity = '${QuerySelector.city}'`);
      if (QuerySelector.area)
        params.push(`CustomerArea = '${QuerySelector.area}'`);
      if (QuerySelector.CustomerAddr)
        params.push(`CustomerAddr like '%${QuerySelector.CustomerAddr}%'`);
      return params;
    },
  },
  components: {
    chinaProvince,
    // city,
  },
  watch: {
    QuerySelector: {
      handler: function () {
        this.getCustomerList();
      },
      deep: true,
    },
  },
  created() {
    this.$data.AdministrativeDistrict = province_city_china;
    // this.getCustomerList();
    // this.postCustomer();
    this.patchCustomer();
    // this.putCustomer();
  },
};
</script>