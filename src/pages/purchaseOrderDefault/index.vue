<template>
    <div class="container" :style="{opacity: data ? 1 : 0}">
        <div class="title">
            <h1>{{data && data.product}}</h1>
            <p>{{data && data.buyDeadline && buyDeadline}}丨 商机总收益<span>{{data && data.totalIncome}}</span>元</p>
            <img class="status" v-if="status == 3" src="/static/icon-13.png" mode="widthFix" style="width:50px;" alt="">
            <!-- <span class="status">{{statusText}}</span> -->
        </div>
        <div class="content">
            <ul>
                <li class="user-info">
                    <img :src="photoUrl" alt="">
                    <div>
                        <p class="user-name">{{data && data.name}}</p>
                        <p class="company">{{data && data.company}}</p>
                    </div>
                </li>
                <li class="product-info">
                    <div class="group">
                        <label for="">采购数量</label>
                        <div class="group-content"><span>{{data && data.number}}</span>{{data && data.unit}}</div>
                    </div>

                    <div class="group">
                        <label for="">信息价格</label>
                        <div class="group-content">
                            <span>{{data && data.price}}</span>元
                            <div class="tip">
                                <img src="/static/icon-15.png" mode="widthFix" alt="" style="width: 18px;" @click="isTip = !isTip"/>
                                <div class="tip-text" v-show="isTip">供应商查看时需支付的信息价格</div>
                            </div>
                        </div>
                    </div>

                    <div class="group">
                        <label for="">语音描述</label>
                        <div class="group-content">
                            <div class="voice-description" @click="playVoice">
                                <i class="iconfont icon-yuyin" :class="{voice:voice}"></i>
                                <span>{{data && data.duration && duration}}s</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="supplement">
                    <div class="group">
                        <label for="">补充说明</label>
                        <div class="group-content">
                            <p>{{data && data.explained}}</p>
                            <div class="images">
                                <div class="image-item" v-for="(item, index) in data && data.imgList" :key="index" :data-index="index" @click="previewImage">
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
                    阅读{{data && data.browseCount}}    报价{{data && data.offerCount}}
                    <span>{{data && data.companyAddress}}</span>
                </div>
            </div>
            <!-- <div class="over"> ~ 全部加载完毕 ~ </div> -->
        </div>
        <div class="footer">
            <button v-if="type == 'offer'" class="primary" @click="toMiniProgram">立即报价</button>
            <ul v-else-if="(status == 2 || status == 3) && type != 'offer'">
                <li 
                    v-for="(item, index) in share" 
                    :key="index" 
                    @click="item.callback"
                    v-if="!(item.title == '邀请报价' && status == 3)">
                    <button v-if="item.openType" :data-id="id" :data-status="status" open-type="share">
                        <img :src="item.icon" mode="widthFix" alt="" style="width: 15px;">
                        {{item.title}}
                    </button>
                    <button v-else>
                        <img :src="item.icon" mode="widthFix" alt="" style="width: 15px;">
                        {{item.title}}
                    </button>
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
            data: null,
            type: null,
            status: null,
            id: null,
            share: [
                {
                    title: "邀请报价",
                    icon: "/static/icon-7.png",
                    openType: true,
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
                    callback: () => {
                        wx.navigateTo({
                            url: "/pages/excellentSupplier/main?purchaseOrdersId=" + this.id
                        });
                    }
                }
            ],
            voice: false,
            isTip: false
        }
    },
    computed: {
        // 时间
        buyDeadline() {
            if(this.data) {
                return this.data.buyDeadline;
            }
        },
        duration() {
            if(this.data) {
                return Math.ceil(this.data.duration/1000);
            }
        },
        // 状态文字
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
        },
        // 判断头像
        photoUrl() {
            if(store.state.parsonal.photo.indexOf('https://wx.qlogo.cn') < 0) {
                return this.baseUrl + store.state.parsonal.photo;
            }
            return store.state.parsonal.photo;
        }
    },
    methods: {
        // 播放语音
        playVoice() {
            innerAudioContext.src = this.baseUrl + this.data.audioFile;
            innerAudioContext.play();
        },
        // 跳转小程序
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
        },
        // 预览图片
        previewImage(e) {
            let index = e.currentTarget.dataset.index;
            let imgList = this.data.imgList.map((item) => {
                return this.baseUrl + item
            })
            wx.previewImage({
                urls: imgList,
                current: imgList[index]
            })
        }
    },
    onLoad(query) {
        Object.assign(this.$data, this.$options.data());
        wx.showLoading({
            title: '加载中',
            mask: true
        })
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
            wx.hideLoading()
        })

        innerAudioContext.onPlay(() => {
            console.log('开始播放');
            this.voice = true;
        })

        innerAudioContext.onEnded(() => {
            console.log('音频自然播放至结束的事件')
            this.voice = false;
        })
    },
    onShareAppMessage({ target }) {
        let id = target.dataset.id
        let status = target.dataset.status
        return {
            title: '采购单详情',
            path: '/pages/index/main?inviterId=' + store.state.buyerId + '&page=purchaseOrderDefault&pagetype=offer&id=' + id + '&status=' + status
        }
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
    flex: 1;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
}

.footer ul li button {
    font-size: 14px;
    color: #3f8bf4;
    padding: 0;
    background-color: #fff;
}

.footer ul li button::after{ border: none; }

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

.tip {
    position:relative;
    display:inline-block;
    white-space:nowrap;
}

.tip img{
    vertical-align:middle;
}

.tip-text {
    position:absolute;
    top:0;
    left:22px;
    font-size:12px;
    padding:5px;
    background-color:#bbb;
    color:#fff;
    border-radius:3px;
}

@keyframes voice {
    0% {
        color: #fff;
    }
    50% {
        color: #dddddd;
    }
    100% {
        color: #fff;
    }
}

.icon-yuyin {
    margin-right: 5px;
    color: #fff;
}

.icon-yuyin.voice {
    animation:voice 1s infinite;
}

</style>


