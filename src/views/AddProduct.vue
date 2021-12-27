<template>
  <div class="view">
    <h1>新增商品</h1>
    <div class="row">
      <div class="col-8 center">商品名稱</div>
      <input
        type="text"
        class="col-10 OnlyUnder"
        v-model="AddData.productname"
      />
    </div>
    <div class="row">
      <div class="col-4 center">可否分割</div>
      <switchcheckbox
        id="parting"
        :value.sync="AddData.parting"
        truetext="是"
        falsetext="否"
      ></switchcheckbox>
      <div class="col-4 center">是否為液體</div>
      <switchcheckbox
        id="volume"
        :value.sync="AddData.volume"
        truetext="是"
        falsetext="否"
      ></switchcheckbox>
    </div>
    <div class="row">
      <div class="col-20" v-if="AddData.volume === 1">
        <productV
          v-for="(product, index) in AddData.products"
          :key="'product_' + index"
          :vol.sync="product.vol"
          :defaultduration.sync="product.defaultduration"
          :official.sync="product.official"
        ></productV>
      </div>
      <div class="col-20" v-if="AddData.volume === 0">
        <productS
          v-for="(product, index) in AddData.products"
          :key="'product_' + index"
          :height.sync="product.height"
          :width.sync="product.width"
          :defaultduration.sync="product.defaultduration"
          :official.sync="product.official"
        ></productS>
      </div>
    </div>
  </div>
</template>
<script>
import switchcheckbox from "../components/single/switch_checkbox.vue";
import productV from "../components/complex/productV.vue";
import productS from "../components/complex/productS.vue";
export default {
  data() {
    return {
      AddData: {
        productname: ``,
        parting: 1,
        volume: 0,
        products: [],
      },
      productExample: {
        width: 0,
        height: 0,
        vol: 0,
        defaultduration: 14,
        official: 1,
      },
    };
  },
  methods: {
    pushProducts() {
      var obj = JSON.parse(JSON.stringify(this.$data.productExample));
      this.$data.AddData.products.push(obj);
    },
    clearProducts() {
      var obj = JSON.parse(JSON.stringify(this.$data.productExample));
      this.$data.AddData.products = [obj];
    },
    console() {
      console.log(this.$data.AddData.products[0]);
    },
  },
  watch: {
    "AddData.volume": {
      handler: async function () {
        this.clearProducts();
      },
      deep: true,
      immediate: true,
    },
    AddData: {
      handler: async function () {
        // console.log(this.$data.AddData.products);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  created() {
    // this.pushProducts();
    // setInterval(() => {
    //   this.console();
    // }, 1000);
  },
  components: {
    switchcheckbox,
    productV,
    productS,
  },
};
</script>
<style scoped>
.OnlyUnder {
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}
</style>