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
import store from '../../stores';
let setUserInfo = url => {
  wx.getUserInfo({
    success(data) {
      let userInfo = data.userInfo;
      store.commit('setUserInfo', userInfo);
      wx.redirectTo({
        url: url
      })
    }
  })
}

export default {
  data() {
    return {
      imgUrls: [
        '/static/ad01.png',
        '/static/ad02.png'
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 500,
      btnText: '登陆授权'
    }
  },
  beforeMount() {
    let self = this;
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.userInfo']) { // 用户已授权
          self.btnText = '立即发布采购意向';
          setUserInfo('/pages/home/main')
        } else { // 用户未授权
          self.btnText = '登陆授权';
        }
      }
    })
  },
  computed: {
    count() {
      return store.state.count;
    }
  },
  methods: {
    bindGetUserInfo(e) {
      if(wx.canIUse('button.open-type.getUserInfo')) {
        setUserInfo('/pages/home/main')
      } else {
        console.log('请升级微信')
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 0 .5rem;
  justify-content:center;
}
._swiper {
  width: 100%;
  height:70%;
}
._swiper ._swiper-item {
  text-align: center;
  padding-bottom: .4rem;
  box-sizing: border-box;
}
._swiper ._swiper-item ._image {
  width: 100%;
  height: 100%;
}
._button {
  margin-top: .5rem;
  background-color: #1480fa;
  color: #fff;
  height: 1rem;
  line-height: 1rem;
  font-size: .38rem;
  border-radius: .5rem;
  padding: 0 0.6rem;
}
</style>
