import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import wxRequest from '@/utils/request';

export default new Vuex.Store({
    state: {
        userinfo: {}, // 用户信息
        code: null, // 微信授权码
        requestKey: null, // 接口请求密匙
        parsonal: {} // 个人信息
    },
    mutations: {
        setUserInfo(state, userinfo) {
            state.userinfo = userinfo;
        },
        setParsonal(state, obj) {
            state.parsonal = Object.assign({}, state.parsonal, obj);
        },
        setCode(state, code) {
            state.code = code;
        },
        setRequestKey(state, key) {
            state.requestKey = key;
        },
        editParsonal(state, obj) {
            for(let key in obj) {
                wxRequest({
                    url: '/buyerController/updateInfo',
                    method: 'POST',
                    data: { [key]: obj[key] }
                }, true).then((response) => {
                    state.parsonal = Object.assign({}, state.parsonal, obj);
                })
            }
        }
    },
    actions: {
        setUserInfo(context, userinfo) {
            context.commit('setUserInfo', userinfo)
        },
        setParsonal(context, obj) {
            context.commit('setParsonal', obj)
        },
        setCode(context, code) {
            context.commit('setCode', code)
        },
        setRequestKey(context, key) {
            context.commit('setRequestKey', key)
        }
    }
})