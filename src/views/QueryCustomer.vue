<template>
  <div class="view">
    <h1>客戶</h1>
    <div class="row search">
      <div class="col-20 text-left Title">查詢</div>
      <div class="col-2 text-left Subject">客戶名稱</div>
      <input
        type="text"
        class="col-3 text-left"
        v-model="QuerySelector.customername"
      />
      <div class="col-3 text-left Subject">客戶位置(省)</div>
      <chinaProvince
        :chinaprovinces="AdministrativeDistrict.province"
        class_str="col-3"
        :chinaprovince.sync="QuerySelector.customerprovince"
      ></chinaProvince>
      <div class="col-3 text-left Subject">客戶位置(市)</div>
      <chinaCity
        :chinacitys="AdministrativeDistrict.city"
        class_str="col-3"
        :chinacity.sync="QuerySelector.customercity"
        :chinaprovince.sync="QuerySelector.customerprovince"
      ></chinaCity>
      <router-link to="/Customer/Add" class="col-3 text-right"
        ><img src="../assets/add.png" style="width: 22px"
      /></router-link>
      <div class="col-3 text-left Subject">客戶位置(區)</div>
      <chinaArea
        :chinaareas="AdministrativeDistrict.area"
        class_str="col-3"
        :chinaarea.sync="QuerySelector.customerarea"
        :chinaprovince.sync="QuerySelector.customerprovince"
        :chinacity.sync="QuerySelector.customercity"
      ></chinaArea>
      <div class="col-3 text-left Subject">客戶位置(街)</div>
      <chinaTown
        :chinatowns="AdministrativeDistrict.town"
        class_str="col-4"
        :chinaarea.sync="QuerySelector.customerarea"
        :chinaprovince.sync="QuerySelector.customerprovince"
        :chinacity.sync="QuerySelector.customercity"
        :chinatown.sync="QuerySelector.customertown"
      ></chinaTown>
      <div class="col-3 text-left Subject">客戶地址</div>
      <input type="text" class="col-4" v-model="QuerySelector.customeraddr" />
    </div>
    <div class="row">
      <div class="col-4 text-left">客戶名稱</div>
      <div class="col-3 text-left">客戶位置(省)</div>
      <div class="col-3 text-left">客戶位置(市)</div>
      <div class="col-3 text-left">客戶位置(區)</div>
      <div class="col-5 text-center">客戶地址</div>
      <div class="col-2 text-center">編輯</div>
    </div>
    <div
      v-for="customer in CustomerList"
      :key="customer.CustomerId"
      class="row"
    >
      <div class="col-4 text-left">{{ customer.customername }}</div>
      <div class="col-3 text-left">
        {{ codeToProvince(customer.customerprovince) }}
      </div>
      <div class="col-3 text-left">{{ codeToCity(customer.customercity) }}</div>
      <div class="col-3 text-left">{{ codeToArea(customer.customerarea) }}</div>
      <div class="col-5 text-center">{{ customer.customeraddr }}</div>
      <router-link
        :to="'/Customer/Edit/' + customer.customerid"
        class="col-2 text-center"
        ><img src="../assets/edit.png" style="width: 18px"
      /></router-link>
    </div>
  </div>
</template>
<script>
import province_city_china from "province-city-china/data";
import chinaProvince from "../components/chinaProvince.vue";
import chinaCity from "../components/chinaCity.vue";
import chinaArea from "../components/chinaArea.vue";
import chinaTown from "../components/chinaTown.vue";
export default {
  data() {
    return {
      CustomerList: [],
      AdministrativeDistrict: {},
      QuerySelector: {
        customername: ``,
        customerprovince: ``,
        customercity: ``,
        customerarea: ``,
        customertown: ``,
        customeraddr: ``,
      },
    };
  },
  methods: {
    getCustomerList() {
      let obj = JSON.parse(JSON.stringify(this.$data.QuerySelector));
      let querySelector = {};
      Object.keys(obj).forEach((element) => {
        if (obj[element])
          querySelector[element] = {
            where: JSON.stringify(obj[element]),
            relation: "=",
          };
      });
      this.axios
        .get("/customer", {
          params: {
            columns: [
              "customerid",
              "customerprovince",
              "customercity",
              "customerarea",
              "customertown",
              "customeraddr",
            ],
            wheres: querySelector,
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

      // this.axios
      //   .get("/downloadtest", {})
      //   .then((response) => {
      //     const url = window.URL.createObjectURL(new Blob([response.data]));
      //     const link = document.createElement("a");
      //     link.href = url;
      //     link.setAttribute("download", "file.pdf");
      //     document.body.appendChild(link);
      //     link.click();
      //   })
      //   .catch((err) => {
      //     console.log(
      //       JSON.parse(err.response.request.response).originalError.info.message
      //     );
      //   });
      // this.axios({
      //   method: "get",
      //   url: "/exceltest",
      //   responseType: "blob",
      // })
      //   .then((response) => {
      //     if (!response.data) return;
      //     let url = window.URL.createObjectURL(new Blob([response.data]));
      //     let link = document.createElement("a");
      //     link.style.display = "none";
      //     link.href = url;
      //     link.setAttribute("download", "excel.xlsx");

      //     document.body.appendChild(link);
      //     link.click();
      //     this.download(response);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    codeToProvince(code) {
      return this.$data.AdministrativeDistrict.province.filter(
        (x) => x.province == code
      )[0].name;
    },
    codeToCity(code) {
      return this.$data.AdministrativeDistrict.city.filter(
        (x) => x.city == code
      )[0].name;
    },
    codeToArea(code) {
      return this.$data.AdministrativeDistrict.area.filter(
        (x) => x.area == code
      )[0].name;
    },
    codeToTown(code) {
      return this.$data.AdministrativeDistrict.town.filter(
        (x) => x.town == code
      )[0].name;
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

    async computeCity() {
      this.$data.QuerySelector.customercity = "";
      if (
        !this.$data.AdministrativeDistrict.city.filter(
          (x) => x.province == this.$data.QuerySelector.customerprovince
        ).length
      ) {
        this.$data.QuerySelector.customercity = "01";
      }
      await this.computeArea();
    },
    async computeArea() {
      this.$data.QuerySelector.customerarea = "";
      if (
        !this.$data.AdministrativeDistrict.area.filter(
          (x) =>
            x.province == this.$data.QuerySelector.customerprovince &&
            x.city == this.$data.QuerySelector.customercity
        ).length
      ) {
        this.$data.QuerySelector.customerarea = "01";
      }
      await this.computeTown();
    },
    async computeTown() {
      this.$data.QuerySelector.customertown = "";
      if (
        !this.$data.AdministrativeDistrict.town.filter(
          (x) =>
            x.province == this.$data.QuerySelector.customerprovince &&
            x.city == this.$data.QuerySelector.customercity &&
            x.area == this.$data.QuerySelector.customerarea
        ).length
      ) {
        this.$data.QuerySelector.customertown = "01";
      }
    },
  },
  components: {
    chinaProvince,
    chinaCity,
    chinaArea,
    chinaTown,
  },
  watch: {
    QuerySelector: {
      handler: function () {
        this.getCustomerList();
      },
      deep: true,
    },
    "QuerySelector.customerprovince": {
      handler: async function () {
        await this.computeCity();
      },
      deep: true,
    },
    "QuerySelector.customercity": {
      handler: async function () {
        await this.computeArea();
      },
      deep: true,
    },
    "QuerySelector.customerarea": {
      handler: async function () {
        await this.computeTown();
      },
      deep: true,
    },
  },
  created() {
    this.$data.AdministrativeDistrict = province_city_china;
    this.getCustomerList();
    // this.postCustomer();
    // this.patchCustomer();
    // this.putCustomer();
  },
};
</script>