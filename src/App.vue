<template>
  <div id="app">
    <Welome v-if="welcome" :welcome.sync="welcome"></Welome>
    <div id="nav" v-if="!welcome">
      <router-link to="/" tag="div">首頁</router-link>
      <router-link to="/about" tag="div">About</router-link>
      <router-link to="/Customer" tag="div">客戶</router-link>
      <router-link to="/Product" tag="div">商品</router-link>
      <div @click="update()">Update</div>
    </div>
    <router-view v-if="!welcome" />
  </div>
</template>
<script>
import Welome from "./components/Welcome.vue";

export default {
  data() {
    return {
      welcome: true,
    };
  },
  components: {
    Welome,
  },
  methods: {
    update() {
      this.axios.get("/gitUpdate").catch(() => {
        // console.log(err);
      });
    },
    // getDataTest() {
    //   this.axios
    //     .post("/api/addCustomer", {
    //       params: {
    //         CustomerArea: "Area",
    //         CustomerProvince: "testPr",
    //         CustomerName: "testName",
    //         CustomerAddr: "test02",
    //         CustomerCity: "test02",
    //       },
    //     }) //
    //     .then((response) => {
    //       console.log(response, response.data.recordset);
    //     })
    //     .catch((err) => {
    //       console.log(
    //         JSON.parse(err.response.request.response).originalError.info.message
    //       );
    //     });
    // },
  },
  created() {
    //this.getDataTest();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  height: 100%;
  width: 222px;
  clip-path: polygon(0 0, 90% 0, 100% 1%, 100% 6%, 90% 7%, 90% 100%, 0 100%);
  top: 0px;
  left: -199px;
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  background-color: #aaa;
  fill: #aaa;
}
#nav:hover {
  left: 0px;
}

#nav div {
  left: 0;
  border: 1px solid;
  font-weight: bold;
  color: #2c3e50;
  width: 200px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: white;
}

#nav div.router-link-exact-active {
  background-color: cornflowerblue;
  color: #fff;
}

.view {
  position: absolute;
  /* left: 250px; */
  width: 100%;
}
/* @media screen {
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
  }
  .row .col-1,
  .row .col-2,
  .row .col-3,
  .row .col-4,
  .row .col-5,
  .row .col-6,
  .row .col-7,
  .row .col-8,
  .row .col-9,
  .row .col-10,
  .row .col-11,
  .row .col-12,
  .row .col-13,
  .row .col-14,
  .row .col-15,
  .row .col-16,
  .row .col-17,
  .row .col-18,
  .row .col-19,
  .row .col-20 {
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  .row .col-1 {
    flex: 0 0 5%;
    max-width: 5%;
  }
  .row .col-2 {
    flex: 0 0 10%;
    max-width: 10%;
  }
  .row .col-3 {
    flex: 0 0 15%;
    max-width: 15%;
  }
  .row .col-4 {
    flex: 0 0 20%;
    max-width: 20%;
  }
  .row .col-5 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  .row .col-6 {
    flex: 0 0 30%;
    max-width: 30%;
  }
  .row .col-7 {
    flex: 0 0 35%;
    max-width: 35%;
  }
  .row .col-8 {
    flex: 0 0 40%;
    max-width: 40%;
  }
  .row .col-9 {
    flex: 0 0 45%;
    max-width: 45%;
  }
  .row .col-10 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .row .col-11 {
    flex: 0 0 55%;
    max-width: 55%;
  }
  .row .col-12 {
    flex: 0 0 60%;
    max-width: 60%;
  }
  .row .col-13 {
    flex: 0 0 65%;
    max-width: 65%;
  }
  .row .col-14 {
    flex: 0 0 70%;
    max-width: 70%;
  }
  .row .col-15 {
    flex: 0 0 75%;
    max-width: 75%;
  }
  .row .col-16 {
    flex: 0 0 80%;
    max-width: 80%;
  }
  .row .col-17 {
    flex: 0 0 85%;
    max-width: 85%;
  }
  .row .col-18 {
    flex: 0 0 90%;
    max-width: 90%;
  }
  .row .col-19 {
    flex: 0 0 95%;
    max-width: 95%;
  }
  .row .col-20 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .border {
    border: solid 1px;
  }
  .red {
    color: red;
  }
  .blue {
    color: blue;
  }
  .green {
    color: green;
  }
  .bg-red {
    background-color: red;
  }
  .bg-blue {
    background-color: blue;
  }
  .bg-green {
    background-color: green;
  } */
.search {
  border: solid 1px black;
  padding-top: 4px;
  padding-bottom: 4px;
}
.search .Title {
  font-size: larger;
  font-weight: bold;
  color: green;
}
.search .Subject {
  color: blue;
  font-size: large;
}
.search input {
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}
.search input:focus {
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
</style>
<style src="./css/bootstrap.min.css"></style>