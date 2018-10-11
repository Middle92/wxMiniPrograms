<template>
    <div class="container">
        <p class="title">提现金额</p>
        <div class="money">
            <div class="money-input">
                <!-- ￥  -->
                <input type="number" v-model="value">
            </div>
        </div>
        <p class="balance">当前余额￥{{balance}}</p>

        <div class="btns">
            <button class="primary" @click="takeCash">立即提现</button>
        </div>

        <div class="tips">
            <ul>
                <li v-for="(item, index) in tips" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import stores from '@/stores';
import wxRequest from '@/utils/request';

export default {
    data() {
        return {
            value: null, 
            tips: [
                '1.提现申请将在3小时候内到账；如遇高峰期，可能延迟到账烦请耐心等待；',
                '2.提现到账查询：微信→我→钱包→零钱→零钱明细，如有名称为“企业付款：百采号提现成功”的数据，即提现到账成功！'
            ]
        }
    },
    computed: {
        balance() {
            return stores.state.parsonal.balance
        }
    },
    methods: {
        takeCash() {
            if(this.value && this.value.trim() != '') {
                wxRequest({
                    url: '/journalAccountController/withdraw',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        money: this.value
                    }
                }, true).then(response => {
                    wx.showToast({
                        title: data.message,
                    })
                }).catch(response => {
                    let data = response.data;
                    wx.showToast({
                        icon: 'none',
                        title: data.message,
                    })
                })
            }
        }
    }
}
</script>

<style scoped>
.container {
    background-color: #f5f5f5;
    padding: 10px 20px;
}

.title {
    font-size: 14px;
    color: #888888;
    width: 100%;
    text-align: left;
    margin: 10px 0;
}

.money {
    width: 100%;
}

.money-input {
    position: relative;
    padding-left: 1rem;
    line-height: 60px;
    height: 60px;
    border-bottom: 1px solid #f2f2f2;
}

.money-input::before {
    content: '￥';
    font-size: 30px;
    position: absolute;
    left: 0;
}

.money-input input {
    line-height: 60px;
    height: 60px;
}

.balance {
    width: 100%;
    font-size: 12px;
    color: #b2b2b2;
    margin: 20px 0;
}

.btns {
    width: 100%;
}

.tips {
    font-size: 12px;
    color: #aaaaaa;
    line-height: 24px;
    margin-top: 45px;
}
</style>

