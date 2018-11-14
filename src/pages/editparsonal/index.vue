<template>
    <div class="container">
        <div class="content">
            <input v-if="nagitationKey == 'mobile'" type="digit" v-model="value" placeholder-class="placeholder-class" :placeholder="'请输入'+navigationTitle">
            <input v-else v-model="value" placeholder-class="placeholder-class" :placeholder="'请输入'+navigationTitle">
        </div>
        <div v-if="nagitationKey == 'mobile'" class="code">
            <input type="digit" v-model="code" placeholder-class="placeholder-class" placeholder="请输入验证码">
            <button @click="getCode" :disabled="!getCodeBtn">{{btnText}}</button>
        </div>
        <div class='submit-btns'>
            <button class='primary' @click="editData">确定</button>
        </div>
    </div> 
</template>

<script>
import store from '@/stores';
import wxRequest from '@/utils/request';

export default {
    data() {
        return {
            navigationTitle: null,
            nagitationKey: null,
            value: null,
            // 短信验证
            code: null,
            getCodeBtn: true,
            btnText: '获取验证码',
            btnTextTime: 60,
            // getCodeValue: null,
        };
    },
    computed: {
        userName() {
            return store.state.parsonal.name;
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        let self = this;
        self.navigationTitle = options.name;
        self.nagitationKey = options.key;
        self.value = store.state.parsonal[self.nagitationKey];
        wx.setNavigationBarTitle({
            title: self.navigationTitle
        });
    },
    methods: {
        editData() {
            if(!this.value || this.value.trim() == '') {
                wx.showToast({
                    mask: true,
                    icon: 'none',
                    title: '内容不能为空',
                })
                return false;
            }
            if(this.nagitationKey == 'mailbox' && !(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.value))) {
                wx.showToast({
                    mask: true,
                    icon: 'none',
                    title: '邮箱格式不正确',
                })
                return false
            }
            if(this.nagitationKey == 'mobile') {
                if(this.userName) {
                    wxRequest({
                        url: '/buyerController/bindingMobile',
                        method: 'POST',
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            name: this.userName,
                            mobile: this.value,
                            code: this.code
                        }
                    }, true).then((response) => {
                        if(response.code == '200') {
                            wx.showToast({
                                mask: true,
                                title: '修改成功',
                                success:() => {
                                    store.commit("setParsonal", { [this.nagitationKey]: this.value });
                                    setTimeout(() => {
                                        if(this.nagitationKey == 'photo') {
                                            return false;
                                        }
                                        wx.navigateBack()
                                    }, 1500)
                                }
                            })
                        }
                    }).catch((response) => {
                        wx.showToast({
                            mask: true,
                            icon: 'none',
                            title: response.data.message,
                        })
                    })
                } else {
                    wx.showToast({
                        mask: true,
                        icon: 'none',
                        title: '请返回填写姓名'
                    })
                }
            //     if(this.code && this.code === this.getCodeValue) {
            //         store.commit("editParsonal", { [this.nagitationKey]: this.value });
            //     } else {
            //         wx.showToast({
            //             mask: true,
            //             icon: 'none',
            //             title: '验证码错误',
            //         })
            //         return false;
            //     }
            } else {
                store.commit("editParsonal", { [this.nagitationKey]: this.value });
            }
        },
        getCode() {
            let self = this;
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(self.value))){ 
                wx.showToast({
                icon: 'none',
                title: '电话号码不正确'
                })
            } else {
                wxRequest({
                    url: '/buyerController/getAuthCode',
                    data: {
                        mobile: self.value
                    }
                }, true)
                .then((response) => {
                    // 验证码按钮disabled
                    this.getCodeBtn = false;
                    this.btnText = this.btnTextTime;
                    // this.getCodeValue = response.data;

                    let timer;
                    timer = setInterval(() => {
                        if(this.btnTextTime <= 0 || typeof this.btnText == 'string') {
                            clearInterval(timer)
                            this.btnText = '获取验证码';
                            this.btnTextTime = 60;
                            this.getCodeBtn = true;
                            // this.getCodeValue = null;
                            return false;
                        }
                        this.btnText = this.btnTextTime -= 1;
                    }, 1000)
                })
                .catch((response) => {
                    wx.showToast({
                        mask: true,
                        icon: 'none',
                        title: response.data.message,
                    })
                })
            }
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
    padding: 10px 20px;
    margin-top: .6rem;
    background-color: #ffffff;
    box-sizing: border-box;
}
.content > input {
    height:32px;
    line-height:32px;
}
/* submit-btns */
.submit-btns {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
}
/* code */
.code {
    padding: 10px 20px;
    margin-top: 15px;
    display: flex;
    margin-top: 10px;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
}

.code > input {
    flex: 1;
    height:32px;
    line-height:32px;
}

.code > button{
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    color: #1a81ff;
    border: 1px solid #1a81ff;
}
</style>


