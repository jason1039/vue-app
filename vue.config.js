module.exports = {
    devServer: {
        open: true,
        host: 'localhost',  // 設置主機地址
        port: 8080,         // 設置默認埠號
        https: false,
        //以上的ip和埠號是我們本機的;下面為需要跨域的
        proxy: {    //配置跨域
            '': {
                target: 'http://localhost:5050',   //這裡後台的地址模擬的，應該填寫真實的後台api
                ws: true,     // 如果要代理 websockets
                changOrigin: true,  //允許跨域
                pathRewrite: {
                    '': '' //請求的時候使用這個api就可以
                }
            }

        }
    }
};