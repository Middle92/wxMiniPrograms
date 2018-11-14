<template>
    <div class='container' :style="{opacity: isOpacity ? 1 : 0}" @touchstart="touchstart" @touchmove="touchmove">
        <!-- 顶部广告 -->
        <swiper v-if="imgUrls && imgUrls.length > 1">
            <block v-for="(item, index) in imgUrls" :key="index">
                <swiper-item>
                    <image :src="baseUrl + item.imgUrl" class="slide-image" height="150"/>
                </swiper-item>
            </block>
        </swiper>
        <image v-else-if="imgUrls" :src="baseUrl + imgUrls[0].imgUrl" class="slide-image" @click="advertisement"/>
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
                  <div class="product" :data-id="ite.id" :data-status="ite.status" @click="toDefault">
                      <img :src="ite.productImg ? baseUrl + ite.productImg : '/static/logo.jpg'"/>
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
                      <li 
                        v-for="(it, ind) in share" 
                        :key="ind" 
                        :data-id="ite.id" 
                        @click="it.callback"
                        v-if="!(it.title == '邀请报价' && item.title == '已结束')">
                          <button v-if="it.openType" :data-id="ite.id" :data-status="ite.status" open-type="share">
                            <img mode="widthFix" style="width: 12px;" :src="it.icon" alt="">
                            {{it.title}}
                          </button>
                          <button v-else>
                            <img mode="widthFix" style="width: 12px;" :src="it.icon" alt="">
                            {{it.title}}
                          </button>
                      </li>
                  </ul>
                </li>
                <div v-if="item.data.length <= 0" class="data-none">
                  <span>暂无数据</span>
                </div>
              </ul>
            </div>
        </div>
        <!-- 发布采购单icon -->
        <div>
          <div class='plusIcon' :style="{bottom: plusicon}" @click="release">
            <i class="iconfont icon-plus"></i>
            <span class="plus-title" v-show="plustitle">有奖发布</span>
          </div>
        </div>
    </div>
</template>

<script>
import store from "@/stores";
import utils from "@/utils/index";
import wxRequest from "@/utils/request";

var query = wx.createSelectorQuery();
export default {
  data() {
    return {
      isOpacity: false,
      imgUrls: null,
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
          openType: true,
        },
        {
          title: "分享到朋友圈",
          icon: "/static/icon-5.png",
          callback: e => {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
              url: "/pages/share/main?id=" + id
            });
          }
        },
        {
          title: "查看供应商",
          icon: "/static/icon-6.png",
          callback(e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
              url: "/pages/excellentSupplier/main?purchaseOrdersId=" + id
            });
          }
        }
      ],
      // 滚动tab 固定顶部
      scrollTop: null,
      fixedTab: false,
      plusicon: '20px',
      plustitle: true
    };
  },
  computed: {
    userinfo() {
      return store.state.userinfo;
    },
    baseUrl() {
      return store.state.baseUrl;
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
        url: "/pages/purchaseDefault/main"
      });
    },
    toDefault(e, type = "") {
      let id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      wx.navigateTo({
        url: `/pages/purchaseOrderDefault/main?type=${type}&id=${id}&status=${status}`
      });
    },
    touchstart(e) {
      console.log(e);
      this.touchstartval = e.clientY;
    },
    touchmove(e) {
      if(e.clientY > this.touchstartval) {
        console.log('down')
        this.plusicon = '20px';
      } else {
        console.log('up')
        this.plusicon = '-45px';
      }
    }
  },
  mounted() {
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    this.tab.map(item => {
      store.getters
        .purchaseList({
          pageNo: item.pageNo,
          status: item.status
        })
        .then(response => {
          if (response.data.list.length > 0) {
            item.pageNo++;
          }
          item.data = response.data.list;
        });
    });

    wxRequest(
      {
        url: "/advertisingController/findAll",
        data: {
          type: 2
        }
      },
      true
    ).then(response => {
      this.imgUrls = response.data;
      setTimeout(() => {
        const _this = this;
        wx
          .createSelectorQuery()
          .select(".tab")
          .boundingClientRect(function(rect) {
            _this.scrollTop = rect.top;
          })
          .exec();
        this.isOpacity = true; 
        wx.hideLoading();
      }, 300);
    });
  },
  onPageScroll: function(e) {
    this.fixedTab = e.scrollTop >= this.scrollTop;
  },
  onPullDownRefresh: function(e) {
    this.tab.map(item => {
      if (item.active) {
        item.pageNo = 1;
        store.getters
          .purchaseList({
            pageNo: item.pageNo,
            status: item.status
          })
          .then(response => {
            item.data = response.data.list;
            if (response.data.list.length > 0) {
              item.pageNo++;
            }
            wx.stopPullDownRefresh();
          });
      }
    });
  },
  onReachBottom: function() {
    this.tab.map(item => {
      if (item.active) {
        store.getters
          .purchaseList({
            pageNo: item.pageNo,
            status: item.status
          })
          .then(response => {
            item.data = [...item.data, ...response.data.list];
            if (response.data.list.length > 0) {
              item.pageNo++;
            }
          });
      }
    });
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data());

    setTimeout(() => {
      this.plustitle = false;
    }, 3000)
  },
  onShareAppMessage({ target }) {
    let id = target.dataset.id
    let status = target.dataset.status
    return {
      title: '采购单详情',
      path: '/pages/index/main?inviterId=' + store.state.buyerId + '&page=purchaseOrderDefault&pagetype=offer&id=' + id + '&status=' + status
    }
  }
};
</script>

<style scoped>
.container {
  display: initial;
  float:left;
  width:100%;
  height: auto;
  font-size: 0;
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
  background-color: #f5f5f5;
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
  /* padding: 10px 0; */
  display: flex;
}

.share li {
  display: inline-block;
  box-sizing: border-box;
  
  flex: 1;
}

.share li button {
  font-size: 12px;
  text-align: center;
  color: #3f8bf4;
  background-color: transparent;
  border: none;
}

.share li button::after{ border: none; }

.share li:not(:last-child) {
  border-right: 1px solid #e9e9e9;
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
  /* background-color: #1481fa; */
  background: linear-gradient(#6cb8ec, #5695e6); /* 标准的语法 */
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  left: 50%;
  margin-left: -0.5rem;
  transition: all .5s;
}

.plusIcon .plus-title {
  width: 80px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  background-color: #2a70d4;
  position: absolute;
  top: -45px;
  border-radius: 4px;
}

.plusIcon .plus-title::after {
  content: " ";
  position: absolute;
  border: 6px solid #2a70d4;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  bottom: -10px;
  left: 50%;
  margin-left: -6px;
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
  z-index: 10;
}

.fixed + .tab-content {
  margin-top: 50px;
}

.icon-plus {
  font-size: 18px;
  color: #ffffff;
}
</style>

