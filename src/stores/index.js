import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import wxRequest from '@/utils/request';

export default new Vuex.Store({
    state: {
        userinfo: {}, // 用户信息
        code: null, // 微信授权码
        requestKey: null, // 接口请求密匙
        parsonal: {}, // 个人信息
        buyerId: null //采购商主键
    },
    getters: {
        purchaseList: (state) => (obj) => {
            return wxRequest({
                url: '/PurchaseController/orderList',
                method: 'GET',
                data: obj
            }, true)
        }
    },
    mutations: {
        setUserInfo(state, userinfo) {
            state.userinfo = userinfo;
        },
        setParsonal(state, obj) {
            !obj.photo && (obj.photo = state.userinfo.avatarUrl);
            !obj.nickname && (obj.nickname = state.userinfo.nickName);
            state.parsonal = Object.assign({}, state.parsonal, obj);
        },
        setCode(state, code) {
            state.code = code;
        },
        setRequestKey(state, key) {
            state.requestKey = key;
        },
        setBuyerId(state, key) {
            state.buyerId = key;
        },
        editParsonal(state, obj) {
            for(let key in obj) {
                wxRequest({
                    url: '/buyerController/updateInfo',
                    method: 'POST',
                    data: { [key]: obj[key] }
                }, true).then((response) => {
                    if(response.code == '200') {
                        wx.showToast({
                            mask: true,
                            title: '修改成功',
                            success: function() {
                                setTimeout(() => {
                                    if(key == 'photo') {
                                        return false;
                                    }
                                    wx.navigateBack()
                                }, 1500)
                            }
                        })
                    }
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
        },
        setBuyerId(context, key) {
            context.commit('setBuyerId', key)
        }
    },
    modules: {
        statement: {
            state: {
                statement: null
            },
            getters: {
                filterStatemen: (state) => (id) => {
                    return state.statement.filter(item => item.id == id); 
                }
            },
            mutations: {
                setStatement(state, data) {
                    state.statement = data;
                }
            }
        }
    }
})