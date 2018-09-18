import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userinfo: {},
        parsonal: {
            image: ["http://tmp/wxb5c983f39f5bc319.o6zAJs56qzfrr4y9R5fzebfi0YFs.uD7LeVDBFquLdcdbe21f04412580ece94c2b2bf4ef32.jpg"],
            brand:"brank",
            company:"讯猫",
            companySite:"广州越秀",
            job:"攻城狮",
            mail:"123@123.com",
            name:"吴彦祖",
            phone:"13800138000",
            product:"面向对象",
        }
    },
    mutations: {
        setUserInfo(state, userinfo) {
            state.userinfo = userinfo;
        },
        setParsonal(state, obj) {
            state.parsonal = Object.assign({}, state.parsonal, obj);
        }
    }
})