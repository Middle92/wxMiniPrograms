<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
page {
  height: 100%;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
button.primary {
  background-color: #419AFF;
  color: #fff;
}

button.default {
  border: 1px solid #419AFF;
  color: #419AFF;
}

button[disabled]:not([type]) {
  background-color: #3e8af4;
  color: #fff !important;
  opacity: .5;
}

.profit {
  color: #f77420;
}

.loss {
  color: #1BAD1A;
}

.out-account {
  color: #ccc;
}

.orange {
  background-color: #ee8b43;
}

.yellow {
  background-color: #e5d24a;
}

.green {
  background-color: #4bdd78;
}

.blue {
  background-color: #5da0e8;
}

.iconfont {
  display: inline;
}

.data-none {
  font-size: 12px;
  color: #666;
  text-align:center;
  margin-top: 20px;
}

.placeholder-class {
  color: #bbbbbb;
  font-size: 13px;
}

.icon-htbarrowright02 {
  font-size: 12px !important;
}
</style>
