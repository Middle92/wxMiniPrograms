<template>
    <div class="container">
        <div class="content">
            <input type="text" v-model="value" :placeholder="'请输入'+navigationTitle">
        </div>
        <div class='submit-btns'>
            <button class='primary' @click="editData">确定</button>
        </div>
    </div> 
</template>

<script>
import store from '@/stores';
export default {
    data() {
        return {
            navigationTitle: null,
            nagitationKey: null,
            value: null
        };
    },
    computed: {

    },
    onLoad(options) {
        let self = this;
        self.navigationTitle = options.name;
        self.nagitationKey = options.key;
        self.value = store.state.parsonal[self.nagitationKey];
        wx.setNavigationBarTitle({
            title: self.navigationTitle
        })
    },
    methods: {
        editData() {
            store.commit("editParsonal", { [this.nagitationKey]: this.value });
            wx.navigateBack()
        }
    }
}
</script>

<style scoped>
/* container */
.container {
    background-color: #f7f7f7;
}
/* content */
.content {
    width: 100%;
    padding: .2rem 0rem;
    margin-top: .6rem;
    background-color: #ffffff;
}
.content > input {
    padding: 0rem .2rem;
}
/* submit-btns */
.submit-btns {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>


