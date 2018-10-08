<template>
    <div class='container'>
        <!-- 顶部广告 -->
        <image :src="imgUrls" class="slide-image" @click="advertisement"/>
        <!-- 图标 -->
        <ul class="icons">
            <li v-for="(item, index) in iconData" :key="index" @click="item.callback">
                <div :class="item.class + ' icon'">
                    <img mode="widthFix" style="width: 20px;" :src="item.icon" alt="">
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
                <ul v-for="(item, index) in tab" :key="index" v-show="tab[index].active">
                    <li v-for="(ite, inde) in item.data" :key="inde">
                      <div class="product" :data-id="ite.id" @click="toDefault">
                          <img :src='ite.productImg'/>
                          <div class='info'>
                              <p class='title'>{{ite.product}}</p>
                              <div class='detail-p'>
                                  <p>数量：{{ite.number }}</p>
                                  <p>规格：{{ite.unit}}</p>
                              </div>
                              <ul class="additional">
                                  <li>阅读：{{ite.browseCount}}次</li>
                                  <li>报价：{{ite.offerCount}}次</li>
                                  <li>收益：{{ite.totalIncome}}元</li>
                              </ul>
                          </div>
                      </div>
                      <ul class="share"><!-- v-if="ite.read" -->
                          <li v-for="(it, ind) in share" :key="ind" :data-id="ite.id" @click="it.callback">
                              <img mode="widthFix" style="width: 12px;" :src="it.icon" alt="">
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
    </div>
</template>

<script>
import store from "@/stores";
import utils from "@/utils/index";
import wxRequest from "../../utils/request";

var query = wx.createSelectorQuery();
export default {
  data() {
    return {
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
      tab: [
        {
          title: "采购中",
          active: true,
          pageNo: 1,
          status: 2,
          data: []
        },
        {
          title: "已结束",
          pageNo: 1,
          status: 3,
          data: []
        }
      ],
      share: [
        {
          title: "邀请报价",
          icon: "/static/icon-7.png",
          callback: (e) => {
            this.toDefault(e, 'offer')
          }
        },
        {
          title: "分享到朋友圈",
          icon: "/static/icon-5.png",
          callback: () => {
            wx.navigateTo({
              url: "/pages/share/main"
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
      if (this.fixedTab) {
        wx.pageScrollTo({
          scrollTop: this.scrollTop
        });
      }
    },
    advertisement() {
      wx.navigateTo({
        url: "/pages/advertisement/main"
      });
    },
    release() {
      wx.navigateTo({
        url: "/pages/purchaseDefault/main?init=true"
      });
    },
    toDefault(e, type) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/purchaseOrderDefault/main?${type ? 'type=offer&' : ''}id=${id}`
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

    this.tab.map(item => {
      store.getters
        .purchaseList({
          pageNo: item.pageNo,
          status: item.status
        })
        .then(response => {
          item.data = response.data.list;
        });
    });
  },
  onPageScroll: function(e) {
    this.fixedTab = e.scrollTop >= this.scrollTop;
  },
  onPullDownRefresh: function(e) {
    this.tab.map(item => {
      if(item.active) {
        item.pageNo = 1;
        store.getters
          .purchaseList({
            pageNo: item.pageNo,
            status: item.status
          })
          .then(response => {
            item.data = response.data.list;
            if(response.data.list.length > 0) {
              item.pageNo++;
            }
            wx.stopPullDownRefresh();
          });
      }
    });
  },
  onReachBottom: function() {
    this.tab.map(item => {
      store.getters
        .purchaseList({
          pageNo: item.pageNo,
          status: item.status
        })
        .then(response => {
          item.data = [...item.data, ...response.data.list];
          if(response.data.list.length > 0) {
            item.pageNo++;
          }
        });
    });
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
  display: flex;
}

.icons li {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  margin: 0.2rem 0;
  font-size: 12px;
  color: #555555;
}

.icon {
  width: 45px;
  height: 45px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  margin-bottom: 10px;
}

.tab {
  width: 100%;
}

.tab .tab-toggle {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #555555;
  border-bottom: 1px solid #f0f0f0;
}

.tab .tab-toggle > li {
  width: 50%;
  display: inline-block;
  text-align: center;
  font-size: 14px;
}

.tab .tab-toggle > li span {
  display: inline-block;
  line-height: 44px;
  height: 44px;
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
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product > image {
  width: 70px;
  height: 70px;
  margin-right: 10px;
}

.product > .info {
  display: inline-block;
  vertical-align: middle;
  flex: 1;
}

.product > .info > .title {
  display: block;
  font-size: 15px;
  margin-bottom: 5px;
  color: #333333;
}

.product > .info > .detail-p {
  font-size: 12px;
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
  border-top: 0.01rem solid #e9e9e9;
  padding: 10px 0;
}

.share li {
  display: inline-block;
  width: 33.33%;
  font-size: 12px;
  height: 23px;
  line-height: 23px;
  box-sizing: border-box;
  text-align: center;
  color: #3f8bf4;
}

.share li:not(:last-child) {
  border-right: 1px solid #e9e9e9;
}

/* .share li img {
  width: 12px;
  height: 0.3rem;
  margin-top: -3px;
  vertical-align: middle;
} */

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

