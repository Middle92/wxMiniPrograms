<template>
    <div class="container">
        <canvas canvas-id="shareCanvas" :style="{width:canvasWidth + 'px', height: canvasHeight + 'px'}"></canvas>
        <button class="primary" @click="exportImage">导出图片</button>
    </div>
</template>

<script>
import store from "@/stores";
import wxRequest from "@/utils/request";

export default {
    data() {
        return {
            canvasWidth: null,
            canvasHeight: null,
            id: null,
            data: null,
            headerImg: null,
            code: null,
        }
    },
    methods: {
        exportImage() {
            wx.canvasToTempFilePath({
                canvasId: "shareCanvas",
                success: function(res) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            console.log("导出图片 success");
                        }
                    });
                }
            })
        }
    },
    computed: {
        baseUrl() {
            return store.state.baseUrl;
        }
    },
    mounted() {
        let self = this;
        
        function circleImg(ctx, img, x, y, r) {
            ctx.save();
            var d = 2 * r;
            var cx = x + r;
            var cy = y + r;
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x, y, d, d);
            ctx.restore();
        }

        wx.showToast({
            mask: true,
            icon: 'loading',
            title: '等待中',
            duration: 99999
        })
        new Promise((resolve, reject) => {
            wxRequest({
                url: '/PurchaseController/detail',
                data: {
                    purchaseOrdersId: self.id
                }
            }, true).then((response) => {
                self.data = response.data;
                wx.getImageInfo({
                    src: self.baseUrl + self.data.photo,
                    success(res) {
                        // 头像圆形
                        self.headerImg = res.path
                        resolve()
                    }
                })
            })
        }).then(() => {
            return new Promise((resolve, reject) => {
                wxRequest({
                    url: '/buyerController/getWXACode',
                    data: {
                        scene: '123456',
                        page: '1',
                        islimit: true
                    }
                }, true).then((response) => {
                    wx.getImageInfo({
                        src: self.baseUrl + response.data,
                        success(res) {
                            self.code = res.path
                            resolve()
                        }
                    })
                })
            })
        }).then(() => {
            wx.getSystemInfo({
                success(res) {
                    self.canvasWidth = res.windowWidth;
                    self.canvasHeight = res.windowHeight;

                    const ctx = wx.createCanvasContext("shareCanvas");
                    // 背景颜色
                    ctx.fillStyle = "#f7f7f7";
                    ctx.fillRect(0, 0, self.canvasWidth, self.canvasHeight);

                    // 标题文字
                    ctx.font = "normal normal bold 18px arial";
                    ctx.setFillStyle("#333");
                    ctx.fillText(self.data.product, 12, 33); 

                    // 时间文字
                    ctx.font = "normal normal normal 14px arial";
                    ctx.setFillStyle("#888");
                    ctx.fillText(`${self.data.buyDeadline}丨 商机总收益${self.data.totalIncome}元`, 12, 62); 

                    // 头像圆形
                    circleImg(ctx, self.headerImg, 12, 97, 25);

                    // 用户名
                    ctx.font = "normal normal normal 15px arial";
                    ctx.setFillStyle("#333");
                    ctx.fillText(self.data.name, 72, 117);

                    // 公司名称
                    ctx.font = "normal normal normal 11px arial";
                    ctx.setFillStyle("#888");
                    ctx.fillText(self.data.company, 72, 138);

                    // 二维码
                    ctx.drawImage(self.code, (self.canvasWidth-200)/2, (self.canvasHeight-200)/2, 200, 200);
                    ctx.restore();

                    // 渲染图片
                    ctx.draw();

                    wx.hideToast()
                }
            })
        })
    },
    onLoad(query) {
        this.id = query.id;
    }
}
</script>

<style scoped>
/* canvas {
    z-index:-1;
} */
.container {
    background: #f7f7f7;
}
.primary {
    /* position: absolute; */
    /* bottom: 50px; */
    width: 80%;
    margin-bottom: 20px;
    /* z-index:10; */
}
</style>

