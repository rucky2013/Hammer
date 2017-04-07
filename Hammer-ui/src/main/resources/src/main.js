import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import axios from 'axios';

global.contextPath = '/Hammer-rest';

Vue.prototype.requestFail = function(error, message) {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        message({
            showClose: true,
            message: '请求错误,状态码: ' + error.response.status,
            type: 'error'
        });
    } else {
        console.log('Error', error.message);
    }
    console.log(error.config);
}
Vue.prototype.bizFail = function(reason) {
    this.$message({
        showClose: true,
        message: '业务错误,错误原因:' + reason,
        type: 'error'
    });
}
Vue.prototype.get = function(url, success) { //全局get请求函数
    const message = this.$message;
    const error = this.requestFail;
    axios.get(contextPath + url).then(resp => {
        if (resp.status == 200 && resp.data.operationState == 'SUCCESS') {
            success(resp.data);
        } else {
            this.bizFail(resp.data.data.reason);
        }
    }).catch(e => {
        error(e, message);
    });
}
Vue.prototype.postBody = function(url, body, success) { //全局post请求函数
    const message = this.$message;
    const error = this.requestFail;
    axios.post(contextPath + url, body)
        .then(resp => {
            if (resp.status == 200 && resp.data.operationState == 'SUCCESS') {
                success(resp.data);
            } else {
                this.bizFail(resp.data.data.reason);
            }
        })
        .catch(e => {
            error(e, message);
        });
}
Vue.prototype.postForm = function(url, body, success) { //全局post请求函数
    const message = this.$message;
    const error = this.requestFail;
    var params = new URLSearchParams();
    for (var key in body) {
        params.append(key, body[key]);
    }
    axios.post(contextPath + url, params)
        .then(resp => {
            if (resp.status == 200 && resp.data.operationState == 'SUCCESS') {
                success(resp.data);
            } else {
                this.bizFail(resp.data.data.reason);
            }
        })
        .catch(e => {
            error(e, message);
        });
}
Vue.prototype.upload = function(url, body, success) { //全局文件上传请求函数
    const message = this.$message;
    const error = this.requestFail;
    var params = new FormData();
    for (var key in body) {
        params.append(key, body[key]);
    }
    axios.post(contextPath + url, params, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(resp => {
            if (resp.status == 200 && resp.data.operationState == 'SUCCESS') {
                success(resp.data);
            } else {
                this.bizFail(resp.data.data.reason);
            }
        })
        .catch(e => {
            error(e, message);
        });
}
Vue.use(ElementUI);
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');