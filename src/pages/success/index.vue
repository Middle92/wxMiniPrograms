<template>
    <div class="container">
        <img mode="widthFix" src="/static/icon-23.png" style="width: 50px;" alt="">
        <span class="title">
            发布成功
        </span>
        <button class="primary" @click="purchaseDefault">查看采购单详情</button>
        <button class="default" @click="release">继续发布</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: null,
            status: null
        }
    },
    methods: {
        release() {
            wx.navigateTo({
                url: "/pages/purchaseDefault/main"
            });
        },
        purchaseDefault() {
            let id = this.id;
            let status = this.status;
            wx.navigateTo({
                url: `/pages/purchaseOrderDefault/main?id=${id}&status=${status}`
            });
        }
    },
    onLoad(query) {
        this.id  = query.id;
        this.status  = query.status;
    },
    onUnload: function () {
        wx.reLaunch({
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

