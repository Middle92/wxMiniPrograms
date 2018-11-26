<template>
    <div class='container'>
        <img class="bg-image" src="/static/bg-2.png" alt="">
        <img class="ad-image" src="/static/ad-3.png" mode="aspectFit" alt="">
        <img class="ad-image" src="/static/ad-4.png" mode="aspectFit" alt="">
        <ul class="bottomBtn">
            <li v-for="(item, index) in bottom" :key="index" @click="item.callback">
                {{item.title}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bgiamge: '/static/bg-2.png',
            adimages: ['/static/ad-3.png', '/static/ad-4.png'],
            bottom: [
                {title: '我的收益', callback: () => {
                    wx.navigateTo({
                        url: '/pages/income/main'
                    })
                }}, 
                {title: '有奖发布', callback: () => {
                    wx.navigateTo({
                        url: '/pages/purchaseDefault/main'
                    })
                }}
            ]
        }
    },
}
</script>

<style scoped>
.bg-image{
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    z-index: -1;
}

.ad-image {
    margin-top: 1rem;
    z-index: 10;
}

.ad-image:nth-of-type(2) {
    height: 200px;
}

.ad-image:nth-of-type(3) {
    height: 240px;
}

.bottomBtn {
    z-index: 10;
    width: 100%;
    position: fixed;
    bottom: .5rem;
}

.bottomBtn li {
    display: inline-block;
    width: 50%;
    font-size: .23rem;
    color: #2a70d4;
    padding: 0 .3rem;
    box-sizing: border-box;
}

.bottomBtn li:first-child {
    text-align: right;
    border-right: 1px solid #2a70d4;
}
</style>

