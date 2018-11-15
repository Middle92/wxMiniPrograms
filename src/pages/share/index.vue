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
      code: null
    };
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
      });
    }
  },
  computed: {
    baseUrl() {
      return store.state.baseUrl;
    }
  },
  mounted() {
    let self = this;

    // 圆型头像
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
    // 圆角矩形
    function roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) {r = w / 2;}
        if (h < 2 * r){ r = h / 2;}
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.arcTo(x+w, y, x+w, y+h, r);
        ctx.arcTo(x+w, y+h, x, y+h, r);
        ctx.arcTo(x, y+h, x, y, r);
        ctx.arcTo(x, y, x+w, y, r);
        ctx.closePath();
    }

    wx.showToast({
      mask: true,
      icon: "loading",
      title: "等待中",
      duration: 99999
    });
    new Promise((resolve, reject) => {
      wxRequest(
        {
          url: "/PurchaseController/detail",
          data: {
            purchaseOrdersId: self.id
          }
        },
        true
      ).then(response => {
        self.data = response.data;
        let photoUrl = () => {
          if (self.data.photo.indexOf("https://wx.qlogo.cn") < 0) {
            return this.baseUrl + self.data.photo;
          }
          return self.data.photo;
        };
        wx.getImageInfo({
          src: photoUrl(),
          success(res) {
            // 头像圆形
            self.headerImg = res.path;
            resolve();
          }
        });
      });
    })
      .then(() => {
        return new Promise((resolve, reject) => {
          wxRequest(
            {
              url: "/buyerController/getWXACode",
              data: {
                scene: "123456",
                page: "1",
                islimit: true
              }
            },
            true
          ).then(response => {
            wx.getImageInfo({
              src: self.baseUrl + response.data,
              success(res) {
                self.code = res.path;
                resolve();
              }
            });
          });
        });
      })
      .then(() => {
        // wx.getSystemInfo({
        //   success(res) {
            self.canvasWidth = 600 / 2;
            self.canvasHeight = 940 / 2;

            const ctx = wx.createCanvasContext("shareCanvas");
            // 背景颜色
            // ctx.fillStyle = "#f7f7f7";
            // ctx.fillRect(0, 0, self.canvasWidth, self.canvasHeight);
            // 背景图片
            ctx.drawImage(
              "/static/bg-4.png",
              0,
              0,
              self.canvasWidth,
              self.canvasHeight
            );

            // 圆角矩形
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur=10;
            ctx.shadowOffsetY=2;
            ctx.shadowColor = 'rgba(0,0,0,.5)';
            roundRect(ctx, 10, 40, 280, 170, 10);
            ctx.fill();
            ctx.shadowBlur=0;
            ctx.shadowOffsetY=0;

            // 标题文字
            ctx.font = "normal normal bold 18px arial";
            ctx.setFillStyle("#333");
            ctx.fillText(self.data.product, 25, 80);

            // 时间文字
            ctx.font = "normal normal normal 14px arial";
            ctx.setFillStyle("#888");
            ctx.fillText(
              `${self.data.buyDeadline}丨 询盘总收益${self.data.totalIncome}元`,
              25,
              100
            );

            // 头像圆形
            circleImg(ctx, self.headerImg, 25, 120, 30);

            // 用户名
            ctx.font = "normal normal normal 16px arial";
            ctx.setFillStyle("#333");
            ctx.fillText(self.data.name, 95, 142);

            // 公司名称
            ctx.font = "normal normal normal 12px arial";
            ctx.setFillStyle("#888");
            ctx.fillText(self.data.company, 95, 170);

            // 二维码
            ctx.drawImage(
              self.code,
              (self.canvasWidth - 200) / 2,
              250,
              200,
              200
            );
            ctx.restore();

            // 渲染图片
            ctx.draw();

            wx.hideToast();
        //   }
        // });
      });
  },
  onLoad(query) {
    this.id = query.id;
  }
};
</script>

<style scoped>
.container {
  background: #e5e5e5;
}
canvas {
  margin-top: 25px;
}
.primary {
  position: fixed;
  bottom: 25px;
  width: 80%;
}
</style>

