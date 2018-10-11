<template>
  <div class="container">
    <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
      <block v-for="(item, index) in imgUrls" :key="index">
        <swiper-item>
          <image :src="item" class="slide-image"/>
        </swiper-item>
      </block>
    </swiper>
    <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">{{btnText}}</button>
  </div>
</template>

<script>
import store from "@/stores";
import wxRequest from "@/utils/request";

async function setUserInfo(url) {
  wx.showToast({
    mask: true,
    icon: 'loading',
    title: '登陆中',
    duration: 99999
  })
  // 获取userInfo
  new Promise((resolve, rejects) => {
    wx.getUserInfo({
      success(data) {
        let userInfo = data.userInfo;
        store.dispatch("setUserInfo", userInfo);
        resolve();
      }
    });
  })
    .then(() => {
      // 获取微信授权
      return new Promise((resolve, rejects) => {
        wx.login({
          success(res) {
            store.dispatch("setCode", res.code);
            resolve();
          }
        });
      });
    })
    .then(() => {
      // 请求授权注册登录
      return new Promise((resolve, rejects) => {
        let inviterId = wx.getLaunchOptionsSync().query.inviterId;
        let obj = {
          code: store.state.code,
          avatarUrl: store.state.userinfo.avatarUrl,
          nickName: store.state.userinfo.nickName,
        }
        inviterId && (obj.inviterId = inviterId);
        wxRequest({
          url: "/buyerController/authorizeRegister",
          data: obj
        }).then(response => {
          // 获取登录获得的接口请求凭据
          store.dispatch("setRequestKey", response.data.miniappToken);
          store.dispatch("setBuyerId", response.data.buyerId);
          resolve();
        }).catch(e => {
          wx.showToast({
            mask: true,
            icon: 'none',
            title: '登陆失败',
          })
        })
      });
    })
    .then(() => {
      // 获取用户信息
      wxRequest({
        url: "/buyerController/findInfo"
      }, true).then(response => {
        store.dispatch("setParsonal", response.data);
        wx.showToast({
          mask: true,
          icon: 'success',
          title: '登陆成功',
          success() {
            setTimeout(() => {
              wx.redirectTo({
                url: url
              })
            }, 1500)
          }
        })
      }).catch(e => {
        wx.showToast({
          mask: true,
          icon: 'none',
          title: '登陆失败',
        })
      })
    });
}

export default {
  data() {
    return {
      imgUrls: null,
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 500,
      btnText: "登陆授权"
    };
  },
  beforeMount() {
    let self = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 用户已授权
          self.btnText = "立即发布采购意向";
          setUserInfo("/pages/home/main");
        } else {
          // 用户未授权
          self.btnText = "登陆授权";
        }
      }
    });
  },
  computed: {
    count() {
      return store.state.count;
    }
  },
  methods: {
    bindGetUserInfo(e) {
      if (wx.canIUse("button.open-type.getUserInfo")) {
        setUserInfo("/pages/home/main");
      } else {
        console.log("请升级微信");
      }
    }
  },
  mounted() {
    wxRequest({
      url: '/advertisingController/findAll'
    }).then((response) => {
      this.imgUrls = response.data.map((item) => {
        return store.state.baseUrl + item.imgUrl
      })
    })
  }
};
</script>

<style scoped>
.container {
  padding: 0 0.5rem;
  justify-content: center;
}
._swiper {
  width: 100%;
  height: 70%;
}
._swiper ._swiper-item {
  text-align: center;
  padding-bottom: 0.4rem;
  box-sizing: border-box;
}
._swiper ._swiper-item ._image {
  width: 100%;
  height: 100%;
}
._button {
  margin-top: 0.5rem;
  background-color: #1480fa;
  color: #fff;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.38rem;
  border-radius: 0.5rem;
  padding: 0 0.6rem;
}
</style>
