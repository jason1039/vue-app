<template>
  <div>
    <h1>Test</h1>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios';//引入檔案
Vue.prototype.$ajax = axios;//將axios掛載到Vue例項中的$ajax上面,在專案中的任何位置通過this.$ajax使用
export default {
    function(){
        console.log('test');
this.$ajax({
       url:'/api/articles',//api 代理到json檔案地址，後面的字尾是檔案中的物件或者是陣列
       method:'get',//請求方式
       //這裡可以新增axios文件中的各種配置
     }).then(function (res) {
       console.log(res,'成功');
     }).catch(function (err) {
       console.log(err,'錯誤');
     })
    }
}
</script>