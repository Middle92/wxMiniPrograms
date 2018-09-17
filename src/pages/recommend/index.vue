<template>
    <div class='container'>
        <img class="bg-image" :src="bgiamge" alt="">
        <div class="ad-image">
            <img v-for="(item, index) in adimages" :key="index" :src="item" alt="">
            <div class="ad-button">
                <button>立即邀请同行</button>
            </div>
        </div>
        <ul class="bottomBtn">
            <li v-for="(item, index) in bottom" :key="index" @click="item.callback">
                {{item.title}}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'recommend',
    data() {
        return {
            bgiamge: '/static/bg-2.png',
            adimages: ['/static/ad-5.png'],
            bottom: [
                {title: '我的收益', callback: () => {
                    wx.navigateTo({
                        url: '/pages/income/main'
                    })
                }}, 
                {title: '有奖发布', callback: () => {
                    wx.navigateTo({
                        url: '/pages/income/main'
                    })
                }}
            ]
        }
    }
}
</script>

<style scoped>
.bg-image{
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
}

.ad-image {
    margin-top: 1rem;
    z-index:10;
    position: relative;
}

.ad-image img {
    height: 400px;
}

.ad-image .ad-button {
    width: 100%;
    position:absolute;
    bottom: 1.5rem;
}

.ad-image .ad-button button {
    background-color: #2c6aea;
    border-radius: .8rem;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    width: 70%;
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

