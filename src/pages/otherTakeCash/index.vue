<template>
    <div class="container">
        <p class="title">提现金额</p>
        <div class="money">
            <div class="money-input">
                <!-- ￥  -->
                <input type="digit" v-model="value">
            </div>
        </div>
        <p class="balance">当前余额￥{{balance}}</p>

        <div class="btns">
            <button class="primary" @click="takeCash" :disabled="disabled">立即提现</button>
        </div>

        <div class="tips" v-html="tips">
            <div>{{tips}}</div>
        </div>
    </div>
</template>

<script>
import stores from "@/stores";
import wxRequest from "@/utils/request";

export default {
  data() {
    return {
      value: null,
      tips: null,
      disabled: false
    };
  },
  computed: {
    balance() {
      return stores.state.parsonal.balance;
    }
  },
  methods: {
    takeCash() {
      if (this.value && this.value.trim() != "") {
        this.disabled = true;
        wxRequest(
          {
            url: "/journalAccountController/withdraw",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              money: this.value
            }
          },
          true
        )
          .then(response => {
            wx.showToast({
              mask: true,
              title: response.message,
              success() {
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 2,
                    success: () => {
                      this.disabled = false;
                    }
                  })
                }, 2000)
              }
            });
          })
          .catch(response => {
            let data = response.data;
            wx.showToast({
              mask: true,
              icon: "none",
              title: data.message,
              success: () => {
                this.disabled = false;
              }
            });
          });
      }
    }
  },
  onLoad(query) {
    Object.assign(this.$data, this.$options.data());
    wxRequest(
      {
        url: "/explainController/getWithdrawalExplain"
      },
      true
    ).then(response => {
      this.tips = response.data.content;
    });
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  padding: 10px 20px;
}

.title {
  font-size: 14px;
  color: #888888;
  width: 100%;
  text-align: left;
  margin: 10px 0;
}

.money {
  width: 100%;
}

.money-input {
  position: relative;
  padding-left: 1rem;
  line-height: 60px;
  height: 60px;
  border-bottom: 1px solid #f2f2f2;
}

.money-input::before {
  content: "￥";
  font-size: 30px;
  position: absolute;
  left: 0;
}

.money-input input {
  line-height: 60px;
  height: 60px;
}

.balance {
  width: 100%;
  font-size: 12px;
  color: #b2b2b2;
  margin: 20px 0;
}

.btns {
  width: 100%;
}

.tips {
  font-size: 12px;
  color: #aaaaaa;
  line-height: 24px;
  margin-top: 45px;
  width: 100%;
}
</style>

