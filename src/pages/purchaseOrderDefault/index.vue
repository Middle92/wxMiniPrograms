<template>
    <div class="container">
        <div class="title">
            <h1>{{data.product}}</h1>
            <p>{{buyDeadline}}丨 商机总收益<span>{{data.totalIncome}}</span>元</p>
            <!-- <img src="/static/icon-1.png" alt=""> -->
        </div>
        <div class="content">
            <ul>
                <li class="user-info">
                    <img :src="data.photo" alt="">
                    <div>
                        <p class="user-name">{{data.name}}</p>
                        <p class="company">{{data.company}}</p>
                    </div>
                </li>
                <li class="product-info">
                    <div class="group">
                        <label for="">采购数量</label>
                        <div class="group-content"><span>{{data.number}}</span>{{data.unit}}</div>
                    </div>

                    <div class="group">
                        <label for="">价格</label>
                        <div class="group-content">
                            <span>{{data.price}}</span>元
                            <img src="/static/icon-15.png"  mode="widthFix" alt="" style="width: 18px;"/>
                        </div>
                    </div>

                    <div class="group">
                        <label for="">语音描述</label>
                        <div class="group-content">
                            <div class="voice-description">
                                <img src="/static/icon-14.png" mode="widthFix" alt="" style="width: 15px;">
                            </div>
                        </div>
                    </div>
                </li>
                <li class="supplement">
                    <div class="group">
                        <label for="">补充说明</label>
                        <div class="group-content">
                            <p>{{data.explained}}</p>
                            <div class="images">
                                <img v-for="(item, index) in data.imgList" :key="index" mode="widthFix" :src="item" alt="">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="other">
            <div class="group">
                <label for=""></label>
                <div class="group-content">
                    阅读{{data.browseCount}}    报价{{data.offerCount}}
                    <span>{{data.companyAddress}}</span>
                </div>
            </div>
            <div class="over"> ~ 全部加载完毕 ~ </div>
        </div>
        <div class="footer">
            <button v-if="type == 'offer'" class="primary" @click="offerFun">立即报价</button>
            <ul v-else>
                <li>
                    <img src="/static/icon-7.png" mode="widthFix" alt="" style="width: 15px;">
                    邀请报价
                </li>
                <li>
                    <img src="/static/icon-5.png" mode="widthFix" alt="" style="width: 15px;">
                    分享到朋友圈
                </li>
                <li>
                    <img src="/static/icon-6.png" mode="widthFix" alt="" style="width: 15px;">
                    查看供应商
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import wxRequrest from '@/utils/request';
import utils from '@/utils/index';

export default {
    data() {
        return {
            data: {},
            type: null
        }
    },
    computed: {
        buyDeadline() {
            return utils.formatTime(new Date(this.data.buyDeadline), '.')
        }
    },
    onLoad(query) {
        this.type = query.type;
        wxRequrest({
            url: '/PurchaseController/detail',
            data: {
                purchaseOrdersId: query.id
            }
        }, true).then(response => {
            this.data = response.data;
        })
    }
}
</script>

<style scoped>
.container {
    background-color: #f7f7f7;
}

.title, .content, .footer {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
}

.footer {
    padding: 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.footer ul li {
    width: 33%;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    color: #3f8bf4;
}

.footer ul li:not(:last-child) {
    border-right: 1px solid #e9e9e9
}

.title {
    margin-bottom: 10px;
    padding: 10px 20px;
}

.title > h1 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.title > p {
    font-size: 12px;
    color: #333333;
}

.title > p > span {
    color: #f77a1f;
    font-size: 16px;
    font-weight: bold;
}

.product-info, .supplement {
    padding: 0 20px;
}

.user-info {
    display: flex;
    padding: 10px 20px;
}

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-info .user-name {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.user-info .company {
    font-size: 14px;
    color: #888888;
}

.group {
    display: flex;
    padding: 10px 0;
}

.group label {
    width: 80px;
    font-size: 16px;
    /* line-height: 50px; */
}

.group .group-content {
    color: #888888;
    font-size: 16px;
    /* line-height: 50px; */
    flex: 1;
}

.group-content span {
    color: #ff9000;
}

.group-content .images {
    margin: 10px 0;
}

.group-content .images > img {
    width: 30%;
    margin-right: 3%;
    margin-bottom: 5px;
}

.voice-description {
    background-color: #2ac94f;
    height: 30px;
    width: 50%;
    border-radius: 6px;
    position: relative;
    margin-left: 10px;
}

.voice-description::before {
    content: '';
    display: inline-block;
    position: absolute;
    border: 10px solid #2ac94f;
    top: 50%;
    left: -19px;
    margin-top: -10px;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
}

.voice-description img {
    position: absolute;
    top: 50%;
    margin-top: -10px;
    left: 10px;
}

.other {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.other .group-content {
    font-size: 14px;
    color: #999999;
}

.other .group-content > span {
    color: #999999;
    float: right;
}

.other .over {
    font-size: 12px;
    text-align: center;
    color: #888888;
    margin: 20px 0 50px 0
}
</style>


