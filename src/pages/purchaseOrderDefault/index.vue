<template>
    <div class="container" :style="{opacity: data ? 1 : 0}">
        <div class="title">
            <h1>{{data && data.product}}</h1>
            <p>{{data && data.buyDeadline && buyDeadline}}丨 询盘总收益<span>{{data && data.totalIncome}}</span>元</p>
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
                        <div class="group-content flex">
                            <span>{{data && data.price}}</span>元
                            <div class="tip">
                                <img src="/static/icon-15.png" mode="widthFix" alt="" style="width: 30rpx;" @click="isTip = !isTip"/>
                                <!-- <i class="iconfont icon-wenhao" @click="isTip = !isTip"></i> -->
                                <div class="tip-text" v-show="isTip">供应商获取联系方式需支付的价格</div>
                            </div>
                        </div>
                    </div>

                    <div class="group">
                        <label for="">语音描述</label>
                        <div class="group-content">
                            <div class="voice-description" :style="{width: recorderWidth}" @click="playVoice">
                                <i class="iconfont icon-yuyin" :class="{voice:voice}"></i>
                                <span>{{data && data.duration && duration}}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="supplement">
                    <div class="group">
                        <label for="">补充说明</label>
                        <div class="group-content block">
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
                    阅读{{data && data.browseCount}}&nbsp;&nbsp;&nbsp;&nbsp;报价{{data && data.offerCount}}
                    <span>
                        <!-- <i class="iconfont icon-dingweiweizhi"></i> -->
                        <img src="/static/icon-24.png" mode="widthFix" alt="" style="width: 15rpx;"/>
                        {{data && data.companyAddress}}
                    </span>
                </div>
            </div>
            <!-- <div class="over"> ~ 全部加载完毕 ~ </div> -->
        </div>
        <div class="footer">
            <div class="btn" v-if="type == 'offer'">
                <button class="primary" @click="toMiniProgram">立即报价</button>
            </div>
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
            isTip: false,
            recorderWidth: '0%'
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
                this.recorderWidth = `${(this.data.duration/90000)*100}%`
                return sec_to_time(Math.ceil(this.data.duration/1000));
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

var sec_to_time = function(s) {
    var t;
    if(s > -1){
        var hour = Math.floor(s/3600);
        var min = Math.floor(s/60) % 60;
        var sec = s % 60;

        if(min < 10){t = "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += sec.toFixed();
    }
    return t;
}
</script>

<style scoped>
.container {
    background-color: #f5f5f5;
    height:auto;
    display:block;
    flex-direction:column;
    align-items:center;
    box-sizing:border-box;
    padding-bottom:47px;
    min-height: 100%;
}

.title, .content, .footer {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
}

.footer ul {
    display: flex;
    padding: 10px;
}

.footer ul li {
    flex: 1;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
}

.footer ul li button {
    font-size: 24rpx;
    line-height: 46rpx;
    height:46rpx;
    color: #3f8bf4;
    padding: 0;
    background-color: #fff;
    display:flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.footer ul li button::after{ border: none; }

.footer ul li:not(:last-child) {
    border-right: 1px solid #e9e9e9
}

.footer ul li button img {
    margin-right: 12rpx;
}

.footer .btn {
    padding: 10px;
}

.title {
    margin-bottom: 10px;
    padding: 15px 12px;
    position: relative;
}

.title > h1 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
}

.title > p {
    font-size: 11px;
    color: #333333;
}

.title > p > span {
    color: #f77a1f;
    font-weight: bold;
}

.product-info, .supplement {
    padding: 0 24rpx;
    border-bottom:2rpx solid #f0f0f0;
}

.supplement .group {
    padding-bottom:0;
}

.user-info {
    display: flex;
    padding:20rpx 24rpx;
    border-bottom:2rpx solid #f0f0f0;
}

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-info .user-name {
    font-size: 15px;
    color: #333;
    margin-bottom: 14px;
}

.user-info .company {
    font-size: 14px;
    color: #888888;
}

.group {
    display: flex;
    padding: 30rpx 0;
}

.group label {
    font-size: 28rpx;
    margin-right: 41rpx;
    width:120rpx;
}

.group .group-content {
    color: #888888;
    font-size: 28rpx;
    flex: 1;
    align-items:center;
}

.group-content span {
    color: #ff9000;
}

.group-content .images {
    margin-top: 30rpx;
}

.group-content .images .image-item {
    width: 166rpx;
    margin-right: 26rpx;
    margin-bottom: 10rpx;
    height:166rpx;
    overflow:hidden;
    display: inline-block;
}

.group-content .images .image-item:nth-of-type(3n) {
    margin-right: 0;
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
    min-width: 60px;
    border-radius: 3px;
    position: relative;
    display:flex;
    align-items:center;
    padding-left:10px;
    margin-left: 8px;
    font-size: 10px;
    box-sizing:border-box;
}

.voice-description::before {
    content: '';
    display: inline-block;
    position: absolute;
    border: 8px solid #2ac94f;
    top: 50%;
    left: -14px;
    margin-top: -8px;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
}

.voice-description img {
    margin-right:10px;
}

.voice-description span {
    color: #fff;
}

.other {
    width: 100%;
    padding: 0 24rpx;
    box-sizing: border-box;
}

.other .group-content {
    font-size: 24rpx;
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
    margin-left: 5px;
}

.tip img{
    vertical-align:middle;
}

.tip-text {
    position:absolute;
    top: 50%;
    left:22px;
    font-size:11px;
    line-height: 20px;
    height: 20px;
    padding: 0px 5px;
    background-color:#bbb;
    color:#fff;
    border-radius:3px;
    margin-top: -15rpx;
}

.tip-text::before {
    content: " ";
    position: absolute;
    border: 5px solid #bbb;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    left: -8px;
    top: 50%;
    margin-top: -4.5px;
}

.icon-yuyin {
    margin-right: 5px;
    color: #fff;
    font-size: 12px;
}

.icon-yuyin.voice {
    animation:voice 1s infinite;
}

.icon-wenhao {
    width: 15px;
    background-color:#bbb;
    color:#fff;
    font-size: 12px;
    display:block;
    height: 15px;
    line-height: 15px;
    text-align:center;
    border-radius:50%;

}

.block {
    display: block !important;
}

.flex {
    display: flex;
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
</style>


