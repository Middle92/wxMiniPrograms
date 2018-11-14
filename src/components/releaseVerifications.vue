<template>
    <div class="export-modle" :class="{'hide': !visibility}">
        <div class="export-element">
            <h1>完善基础信息后才能收到供应商报价</h1>
            <div class="form-group">
                <label for="">姓名</label>
                <div class="flex-1">
                    <input type="text" v-model="name" placeholder-class="placeholder-class" placeholder="请填写姓名">
                </div>
            </div>

            <div class="form-group">
                <label for="">手机号码</label>
                <div class="flex-1">
                    <input type="digit" v-model="mobile" placeholder-class="placeholder-class" placeholder="请输入11位手机号码">
                </div>
            </div>

            <div class="form-group">
                <label for="">验证码</label>
                <div class="flex-1">
                    <input type="digit" v-model="codeValue" placeholder-class="placeholder-class" placeholder="请输入6位数验证码">
                </div>
                <button @click="getCode" :disabled="!getCodeBtn">{{btnText}}</button>
            </div>

            <div class="export-btns">
                <div class="btn">
                    <button @click="$emit('visibility', false)">取消</button>
                </div>
                <div class="btn">
                    <button class="primary" @click="OK" :disabled="!codeValue">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/stores';
import wxRequest from '@/utils/request';

export default {
  props: {
    visibility: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: null,
      mobile: null,
      codeValue: null,
      getCodeBtn: true,
      btnText: '获取验证码',
      btnTextTime: 60
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      let self = this;
      if(!(/^1(3|4|5|7|8)\d{9}$/.test(self.mobile))){ 
        wx.showToast({
          icon: 'none',
          title: '电话号码不正确'
        })
      } else if(!self.name || self.name.trim() == '') {
        wx.showToast({
          icon: 'none',
          title: '填写姓名'
        })
      }else {
        // 验证码按钮disabled
        this.getCodeBtn = false;
        this.btnText = this.btnTextTime;
        // this.getCodeValue = response.data;
        let timer;
        timer = setInterval(() => {
          this.btnText = this.btnTextTime -= 1;
          if(this.btnTextTime <= 0 || !this.visibility) {
            clearInterval(timer)
            this.btnText = '获取验证码';
            this.btnTextTime = 60;
            this.getCodeBtn = true;
            // this.getCodeValue = null;
            return false;
          }
        }, 1000)
        wxRequest({
          url: '/buyerController/getAuthCode',
          data: {
            mobile: self.mobile
          }
        }, true)
          .then((response) => {
            wx.showToast({
              icon: 'none',
              title: response.message
            })
          })
          .catch((e) => {
            console.log(e)
            wx.showToast({
              icon: 'none',
              title: e.data.message
            })
          })
      }
    }, 
    // 确定按钮
    OK() {
      let self = this;
        wxRequest({
          url: '/buyerController/bindingMobile',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            name: this.name,
            mobile: Number(this.mobile),
            code: Number(this.codeValue)
          }
        }, true).then(response => {
          wx.showToast({
            icon: 'success',
            title: '设置成功',
            success: function () {
              store.dispatch("setParsonal", {mobile: self.mobile, name: self.name});
              setTimeout(() => {
                self.$emit('visibility', false);
              }, 2000)
            }
          })
        }).catch((e) => {
          wx.showToast({
            icon: 'none',
            title: e.data.message
          })
        })
    }
  },
  watch: {
    visibility(val, oldval) {
      if(oldval) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
};
</script>

<style scoped>
.export-modle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
  display: flex;
}

.export-element {
  width: 300px;
  margin: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 15px;
}

.export-element h1 {
  font-size: 14px;
  text-align: center;
  color: #555555;
  height: 45px;
  line-height: 30px;
  /* margin-bottom: 20px; */
}

.export-content {
  display: flex;
  vertical-align: middle;
  align-items: center;
  margin-top: 10px;
  /* padding-bottom: 20px; */
  border-bottom: 1px solid #dcdcdc;
  /* margin-bottom: 20px; */
  height: 50px;
  line-height: 50px;
}

.export-content label {
  margin-right: 10px;
  font-size: 14px;
}

.export-content input {
  flex: 1;
  font-size: 11px;
}

.export-btns {
  width: 100%;
  display: table;
  margin-top: 40px;
  /* margin-bottom: 20px; */
}

.export-btns .btn {
  width: 50%;
  display: table-cell;
  text-align: center;
}

.export-btns .btn button {
  display: inline-block;
  font-size: 15px;
  width: 50%;
}

.hide {
  display: none;
}

.form-group {
  width: 100%;
  display: flex;
  font-size: 16px;
  background-color: #ffffff;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
  align-items: center;
}

.form-group input {
  line-height: 50px;
  height: 50px;
}

.form-group label {
  width: 65px;
  color: #2b2b2b;
  font-size: 14px;
}

.flex-1 {
  flex: 1;
  position: relative;
  font-size: 14px;
}

.form-group button {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  color: #1a81ff;
  border: 1px solid #1a81ff;
}
</style>


