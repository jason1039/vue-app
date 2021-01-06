<template>
  <div id="app">
    <Welome v-if="welcome" :welcome.sync="welcome"></Welome>
    <div id="nav" v-if="!welcome">
      <router-link to="/" tag="div">首頁</router-link>
      <router-link to="/about" tag="div">About</router-link>
    </div>
    <router-view v-if="!welcome" />
  </div>
</template>
<script>
import Welome from "./components/Welcome.vue";
import cmd from "node-cmd";
//var router = express.Router();
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
    connection() {
      var name = this.userName;
      var age = this.age;
      console.log(this);
      this.$http
        .get(
          "/api/user/addUser",
          {
            username: name,
            age: age,
          },
          {}
        )
        .then((response) => {
          console.log(response);
        });
    },
  },
  created() {
    cmd.run(
      "node C:\\Users\\User\\Documents\\GitHub\\father-app\\server\\index.js"
    );
    //knex
    //  .select("*")
    //  .from("T_SB_EMP")
    //  .then(function (data) {
    //    console.log(data);
    //  });
    //
    //this.connection();
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
  top: 0px;
  left: 0px;
  position: absolute;
  display: flex;
  flex-direction: column;
}

#nav div {
  border: 1px solid;
  font-weight: bold;
  color: #2c3e50;
  width: 200px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin: auto;
}

#nav div.router-link-exact-active {
  background-color: #aaa;
  color: #fff;
}
</style>
