<template>
    <div class="container">
        <img mode="widthFix" src="/static/icon-23.png" style="width: 50px;" alt="">
        <span class="title">
            发布成功
        </span>
        <button class="primary">查看采购单详情并分享</button>
        <button class="default" @click="release">继续发布</button>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        release() {
            wx.navigateTo({
                url: "/pages/purchaseDefault/main?init=true"
            });
        }
    },
    onUnload: function () {
        wx.navigateTo({
            url: "/pages/home/main"
        });
    }
}
</script>

<style scoped>
.container {
    padding-top: 62px;
    padding-left: 27px;
    padding-right: 27px;
}

.title {
    margin-top: 15px;
    font-size: 16px;
    margin-bottom: 46px;
    color: #69c44d;
}

button {
    width: 100%;
    font-size: 14px;
    margin-bottom: 20px;
}
</style>

