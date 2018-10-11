<template>
    <div class="container">
        <div class="title">
            <h1>{{data.product}}</h1>
            <p>{{buyDeadline}}丨 商机总收益<span>{{data.totalIncome}}</span>元</p>
            <img class="status" v-if="status == 3" src="/static/icon-13.png" mode="widthFix" style="width:50px;" alt="">
            <!-- <span class="status">{{statusText}}</span> -->
        </div>
        <div class="content">
            <ul>
                <li class="user-info">
                    <img :src="baseUrl + data.photo" alt="">
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
                            <div class="voice-description" @click="playVoice">
                                <img src="/static/icon-14.png" :class="{voice: voice}" mode="widthFix" alt="" style="width: 15px;">
                                <span>{{data.duration/1000}}</span>
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
                                <div class="image-item" v-for="(item, index) in data.imgList" :key="index">
                                    <div class="imgage-flex">
                                        <img mode="widthFix" :src="baseUrl + item" alt="">
                                    </div>
                                </div>
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
            <button v-if="type == 'offer'" class="primary" @click="toMiniProgram">立即报价</button>
            <ul v-else-if="(status == 2 || status == 3) && type != 'offer'">
                <li 
                    v-for="(item, index) in share" 
                    :key="index" 
                    @click="item.callback"
                    v-if="!(item.title == '邀请报价' && status == 3)">
                    <img :src="item.icon" mode="widthFix" alt="" style="width: 15px;">
                    {{item.title}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
const innerAudioContext = wx.createInnerAudioContext();
import wxRequrest from '@/utils/request';
import utils from '@/utils/index';
import store from '@/stores';
export default {
    data() {
        return {
            data: {},
            type: null,
            status: null,
            id: null,
            share: [
                {
                    title: "邀请报价",
                    icon: "/static/icon-7.png",
                    callback: (e) => {
                        this.type = 'offer';
                    }
                },
                {
                    title: "分享到朋友圈",
                    icon: "/static/icon-5.png",
                    callback: () => {
                        wx.navigateTo({
                            url: "/pages/share/main?id=" + this.id
                        });
                    }
                },
                {
                    title: "查看供应商",
                    icon: "/static/icon-6.png",
                    callback() {
                        wx.navigateTo({
                            url: "/pages/excellentSupplier/main"
                        });
                    }
                }
            ],
            voice: false
        }
    },
    computed: {
        buyDeadline() {
            return utils.formatTime(new Date(this.data.buyDeadline), '.')
        },
        statusText() {
            if(this.status == 0) {
                return '审核中';
            } else if(this.status == 1) {
                return '未通过';
            } else if(this.status == 2) {
                return '采购中';
            } else if(this.status == 3) {
                return '已结束';
            }
        },
        baseUrl() {
            return store.state.baseUrl;
        }
    },
    methods: {
        playVoice() {
            innerAudioContext.src = this.data.audioFile;
            innerAudioContext.play();
        },
        toMiniProgram() {
            wx.navigateToMiniProgram({
                appId: 'wxbd33d7484b389dac',
                success() {
                    console.log('success')
                },
                fail() {
                    console.log('fail')
                }
            })
        }
    },
    mounted(options) {
        innerAudioContext.onPlay(() => {
            console.log('开始播放');
            this.voice = true;
        })

        innerAudioContext.onEnded(() => {
            console.log('音频自然播放至结束的事件')
            this.voice = false;
        })
    },
    onLoad(query) {
        this.type = query.type;
        this.status = query.status;
        this.id = query.id;
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

.footer ul {
    display: flex;
}

.footer ul li {
    /* width: 33%; */
    flex: 1;
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
    position: relative;
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

.group-content .images .image-item {
    width: 30%;
    margin-right: 3%;
    margin-bottom: 5px;
    height:100px;
    overflow:hidden;
    display: inline-block;
}

.group-content .images .image-item img {
    width: 100%;
}

.imgage-flex {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.voice-description {
    background-color: #2ac94f;
    height: 30px;
    width: 40%;
    border-radius: 6px;
    position: relative;
    display:flex;
    align-items:center;
    padding-left:10px;
}

/* .voice-description::before {
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
} */

.voice-description img {
    margin-right:10px;
}

.voice-description span {
    color: #fff;
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

.status {
    position: absolute;
    top: 10px;
    right: 20px;
}

.voice {
    animation:voice 1s infinite;
}
@keyframes voice {
    0% {filter:brightness(90%);}
    50% {filter:brightness(100%);}
    100% {filter:brightness(90%);}
}
</style>


