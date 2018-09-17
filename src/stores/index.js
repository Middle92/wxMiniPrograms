import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        userinfo: {},
        parsonal: {}
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