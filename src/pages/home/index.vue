<template>
    <div class='container'>
        <!-- 顶部广告 -->
        <!-- <swiper>
            <block v-for="(item, index) in imgUrls" :key="index">
                <swiper-item>
                    <image :src="item" class="slide-image" height="150"/>
                </swiper-item>
            </block>
        </swiper> -->
        <image :src="imgUrls" class="slide-image" @click="advertisement"/>
        <!-- 图标 -->
        <ul class="icons">
            <li v-for="(item, index) in iconData" :key="index" @click="item.callback">
                <div :class="item.class + ' icon'">
                    <img mode="widthFix" :src="item.icon" alt="">
                </div>
                <span>{{item.title}}</span>
            </li>
        </ul>
        <!-- tab切换 -->
        <div class="tab">
            <ul class="tab-toggle" :class="{fixed: fixedTab}">
                <li v-for="(item, index) in tab" :key="index" :class="{active:item.active}" @click="tapToggle">
                    <span>{{item.title}}</span>
                </li>
            </ul>

            <div class="tab-content">
                <ul v-for="(item, index) in tabData" :key="index" v-show="tab[index].active">
                    <li v-for="(ite, inde) in item" :key="inde">
                        <div class="product">
                            <img :src='ite.url' />
                            <div class='info'>
                                <p class='title'>{{ite.title}}</p>
                                <div class='detail-p'>
                                    <p>数量：{{ite.num}}</p>
                                    <p>规格：{{ite.standard}}</p>
                                </div>
                                <ul class="additional">
                                    <li>阅读：{{ite.read}}次</li>
                                    <li>报价：{{ite.offer}}次</li>
                                    <li>收益：{{ite.profit}}元</li>
                                </ul>
                            </div>
                        </div>
                        <ul class="share" v-if="ite.read">
                            <li v-for="(it, ind) in share" :key="ind" @click="it.callback">
                                <img :src="it.icon" alt="">
                                {{it.title}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 发布采购单icon -->
        <div>
            <div class='plusIcon' @click="release">
                <image src='/static/icon01.png'/>
            </div>
        </div>

        <div class="modle"  :class="{'hide': !visibility}">
            <canvas canvas-id="shareCanvas" :style="{width:canvasWidth + 'px', height: canvasHeight + 'px'}"></canvas>
        </div>
    </div>
</template>

<script>
import store from "../../stores";
import utils from "@/utils/index";

var query = wx.createSelectorQuery();
export default {
  data() {
    return {
      // imgUrls: [
      //     '../../../static/bg-1.png',
      // ],
      imgUrls: "/static/bg-1.png",
      iconData: [
        {
          title: "推荐有奖",
          icon: "/static/icon-1.png",
          class: "orange",
          callback() {
            wx.navigateTo({
              url: "/pages/recommend/main"
            });
          }
        },
        {
          title: "优秀供应商",
          icon: "/static/icon-2.png",
          class: "yellow",
          callback() {
            wx.navigateTo({
              url: "/pages/excellentSupplier/main"
            });
          }
        },
        {
          title: "我的收益",
          icon: "/static/icon-3.png",
          class: "green",
          callback() {
            wx.navigateTo({
              url: "/pages/income/main"
            });
          }
        },
        {
          title: "个人中心",
          icon: "/static/icon-4.png",
          class: "blue",
          callback() {
            wx.navigateTo({
              url: "/pages/personal/main"
            });
          }
        }
      ],
      tab: [{ title: "采购中", active: true }, { title: "已结束" }],
      tabData: [
        // 开始
        [
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          },
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带1",
            standard: "EVDF1",
            num: "5件",
            read: 10,
            offer: 3,
            profit: utils.fixed(20.0, 2)
          }
        ],
        // 已结束
        [
          {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, {
            url: "/static/test_header.jpg",
            title: "采购LED灯带4",
            standard: "EVDF4",
            num: "5件"
          }, 
        ]
      ],
      share: [
        {
          title: "邀请报价",
          icon: "/static/icon-7.png",
          callback() {
            wx.navigateTo({
              url: "/pages/purchaseOrderDefault/main"
            });
          }
        },
        {
          title: "分享到朋友圈",
          icon: "/static/icon-5.png",
          callback: () => {
            this.visibility = true;
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
            const ctx = wx.createCanvasContext("shareCanvas");

            ctx.fillStyle = "#f7f7f7";
            ctx.fillRect(0, 0, 400, 200);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, 400, 90);

            ctx.font = "normal normal bold 18px arial";
            ctx.setFillStyle("#333");
            ctx.fillText("采购用于回收液晶广告", 20, 40);

            ctx.font = "normal normal normal 14px arial";
            ctx.setFillStyle("#888");
            ctx.fillText("2018-06-05 11:05丨 商机总收益80.00元", 20, 70);

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 100, 400, 400);

            circleImg(
              ctx,
              "data:image/jpeg;base64,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",
              20,
              120,
              25
            );

            ctx.font = "normal normal normal 18px arial";
            ctx.setFillStyle("#333");
            ctx.fillText("何强", 90, 140);

            ctx.font = "normal normal normal 14px arial";
            ctx.setFillStyle("#888");
            ctx.fillText("广州一呼百应网络技术股份有限公司", 90, 165);
            ctx.draw();

            // 延迟导出才行
            setTimeout(() => {
              wx.canvasToTempFilePath({
                canvasId: "shareCanvas",
                success: function(res) {
                  console.log(res.tempFilePath);
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                      console.log("success");
                    }
                  });
                }
              });
            }, 1000);
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
      canvasWidth: 400,
      canvasHeight: 200,
      visibility: false,
      // 滚动tab 固定顶部
      scrollTop: null,
      fixedTab: false
    };
  },
  computed: {
    userinfo() {
      return store.state.userinfo;
    }
  },
  methods: {
    personal() {
      wx.navigateTo({
        url: "/pages/personal/main"
      });
    },
    income() {
      wx.navigateTo({
        url: "/pages/income/main"
      });
    },
    tapToggle(e) {
      var index = e.target.dataset.index;
      this.tab.map(item => {
        item.active = !item.active;
      });
      if(this.fixedTab) {
          wx.pageScrollTo({
              scrollTop: this.scrollTop
          })
      }
    },
    advertisement() {
      wx.navigateTo({
        url: "/pages/advertisement/main"
      });
    },
    release() {
      wx.navigateTo({
        url: "/pages/purchaseDefault/main"
      });
    }
  },
  mounted() {
    setTimeout(() => {
      const _this = this;
      wx
        .createSelectorQuery()
        .select(".tab")
        .boundingClientRect(function(rect) {
          _this.scrollTop = rect.top;
        })
        .exec();
    });
  },
  onPageScroll: function(e) {
    this.fixedTab = e.scrollTop >= this.scrollTop;
  }
};
</script>

<style scoped>
.container {
  display: initial;
}

.slide-image {
  height: 2.8rem;
}

image {
  width: 100%;
}

.icons {
  font-size: 0.25rem;
  width: 100%;
}

.icons li {
  width: 25%;
  display: inline-block;
  text-align: center;
  margin: 0.2rem 0;
}

.icon {
  width: 0.9rem;
  height: 0.9rem;
  box-sizing: border-box;
  padding: 0.2rem;
  border-radius: 50%;
  margin: auto;
  margin-bottom: 0.1rem;
}

.tab {
  width: 100%;
}

.tab .tab-toggle {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
}

.tab .tab-toggle > li {
  width: 50%;
  display: inline-block;
  text-align: center;
  font-size: 16px;
  padding: 10px 0;
}

.tab .tab-toggle > li span {
  display: inline-block;
  line-height: 30px;
  height: 30px;
  box-sizing: border-box;
}

.tab .tab-toggle > li.active span {
  border-bottom: 0.06rem solid #4f95f7;
  color: #4f95f7;
}

.tab-content > ul > li {
  padding: 0 0.2rem;
  box-shadow: 0rpx 5rpx 3rpx #ececec;
}

.product {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product > image {
  width: 60px;
  height: 60px;
}

.product > .info {
  display: inline-block;
  vertical-align: middle;
  padding: 0 10px;
  flex: 1;
}

.product > .info > .title {
  display: block;
  font-size: 0.3rem;
  margin-bottom: 5px;
  color: #333;
}

.product > .info > .detail-p {
  font-size: 0.26rem;
  color: #666666;
}

.product > .info > .detail-p > p {
  display: inline-block;
  margin-right: 0.2rem;
}

.product > .info > .additional > li {
  font-size: 0.24rem;
  display: inline-block;
  color: #888888;
  padding-right: 0.15rem;
  border-right: 0.01rem solid #c7c7c7;
  margin-right: 0.15rem;
}

.product > .info > .additional > li:last-child {
  border: none;
}

.share {
  line-height: 1rem;
  border-top: 0.01rem solid #e9e9e9;
}

.share li {
  display: inline-block;
  width: 33.33%;
  font-size: 0.28rem;
  text-align: center;
  color: #3f8bf4;
}

.share li img {
  width: 0.3rem;
  height: 0.3rem;
  vertical-align: middle;
}

/* icon */
.plusIcon,
.shareIcon {
  position: fixed;
}
.plusIcon image {
  width: 50%;
  height: 50%;
}

.plusIcon {
  bottom: 10px;
  display: flex;
  width: 1rem;
  height: 1rem;
  background-color: #1481fa;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  left: 50%;
  margin-left: -0.5rem;
}

.modle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modle canvas {
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -180px;
}

.hide {
  display: none;
}
.fixed {
  position: fixed;
  top: 0;
}

.fixed + .tab-content {
  margin-top: 50px;
}
</style>

