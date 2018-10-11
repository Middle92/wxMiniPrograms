<template>
    <div class="container">
        <!-- <a @click="otherTakeCash">提现</a> -->
        <p class="title">提现方式</p>
        <div class="mode">
            <ul>
                <li>
                    <img mode="widthFix" src="/static/icon-16.png" style="width: 25px;"/>微信提现
                </li>
                <li>方便快捷 高效简单</li>
            </ul>
        </div>
        <p class="title">提现方式</p>
        <div class="money">
            <ul>
                <li v-for="(item, index) in takeMoney" :key="index" @click="item.callback">
                    <div :class="{active: item.active}" @click="onTakeMoney" :data-index="index">
                        {{item.title != '其他' ? item.title + '元' : item.title}}
                    </div>
                </li>
            </ul>
        </div>
        <div class="tips">
            <ul>
                <li v-for="(item, index) in tips" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>

        <div class="btns">
            <button class="primary" @click="takeCash">立即提现</button>
        </div>
    </div>
</template>

<script>
import wxRequest from '@/utils/request';

export default {
    data() {
        return {
            takeMoney: [
                {title: 10, active: true},
                {title: 30},
                {title: 50},
                {title: 100},
                {title: 300},
                {title: 500},
                {title: 1000},
                {title: 3000},
                {title: '其他', callback: () => {
                    this.otherTakeCash()
                }},
            ],
            tips: [
                '1.提现申请将在3小时候内到账；如遇高峰期，可能延迟到账烦请耐心等待；',
                '2.提现到账查询：微信→我→钱包→零钱→零钱明细，如有名称为“企业付款：百采号提现成功”的数据，即提现到账成功！'
            ]
        }
    },
    methods: {
        otherTakeCash() {
            wx.navigateTo({
                url: '/pages/otherTakeCash/main'
            })
        },
        onTakeMoney(e) {
            let index = e.currentTarget.dataset.index;
            
            this.takeMoney = this.takeMoney.map((item, inde) => {
                if(index == inde) {
                    item.active = true;
                } else {
                    item.active = false;
                }
                return item;
            })
        },
        takeCash() {
            let item = this.takeMoney.filter(item => item.active)[0];
            if(item.title != '其他') {
                wxRequest({
                    url: '/journalAccountController/withdraw',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        money: item.title
                    }
                }, true).then(response => {
                    wx.showToast({
                        title: data.message,
                    })
                }).catch(response => {
                    let data = response.data;
                    wx.showToast({
                        // mask: true,
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
.mode {
    width: 100%;
    border: 1px solid #e4e4e4;
    padding: 20px 0;
}
.mode ul {
    width: 100%;
}
.mode ul li {
    display: inline-block;
    width: 50%;
    font-size: 15px;
    text-align: center;
    line-height: 30px;
    color: #888888;
    box-sizing: border-box;
}
.mode ul li:first-child {
    color: #333;
    border-right: 1px solid #e4e4e4;
}

.mode ul li:first-child > img {
    margin-right: 10px;
}

.money {
    width: 100%;
}

.money ul {
    width: 100%;
}

.money ul li {
    display: inline-block;
    width: 33%;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    box-sizing: border-box;
    margin-bottom: 15px;
}

.money ul li {
    padding: 0 8px 0 0;
}

.money ul li:nth-child(2), .money ul li:nth-child(5), .money ul li:nth-child(8) {
    padding: 0 4px 0 4px;
}

.money ul li:nth-child(3n) {
    padding: 0 0 0 8px;
}

.money ul li div {
    border: 1px solid #e4e4e4;
    padding: 28px 0;
}

.money ul li div.active {
    border-color: #3e8af4;
}

.tips {
    font-size: 12px;
    color: #aaaaaa;
    line-height: 24px;
    margin-bottom: 68px;
}

.btns {
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    padding: 10px;
    background: #fff;
    z-index:20;
}
</style>


