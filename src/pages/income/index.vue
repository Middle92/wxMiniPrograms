<template>
    <div class="container">
        <!--pages/income/income.wxml-->
        <div class='income-content'>
            <div class="income-header">
                <!-- 今日收益 -->
                <div class='today-income'>
                    <img mode="widthFix" class="income-header-background" src="/static/bg-3.png" alt="">
                    <p>今日收益(元)</p>
                    <p class='income-amount'>{{todayIncome}}</p>
                </div>
                <!-- 累计收益 -->
                <div class='all-income'>
                    <div>
                        <div>累计收益(元)</div>
                        <div>{{totalIncome}}</div>
                    </div>
                    <div>
                        <div>余额(元)</div>
                        <div>{{balance}}</div>
                    </div>
                    <div>
                        <div>提现中</div>
                        <div>{{withdraw}}</div>
                    </div>
                </div>
            </div>
            <!-- 收益详细 -->
            <div class='income-detail'>
                <div class='item' v-for="(item, index) in incomeList.list" :key="index">
                    <div class='item-left'>
                        <div class='title'>{{item.subject}}</div>
                        <div>{{item.addTime}}</div>
                    </div>
                    <div 
                        class='item-right' 
                        :class="(item.type == 1 && 'profit') || (item.type == 0 && 'loss') || (item.type == 3 && 'out-account')">
                            {{item.type > 0 ? '+' + item.money : '-' + item.money}}元
                    </div>
                </div>

                <div v-if="incomeList.list.length <= 0" class="data-none">
                    <span>暂无数据</span>
                </div>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class='btns'>
            <div class='btn'>
                <button class='default' @click="takecash">提现</button>
            </div>
            <div class='btn'>
                <button class='primary' open-type="share">邀请好友赚收益</button>
            </div>
        </div>
    </div>
</template>

<script>
import utils from "@/utils/index";
import stores from "@/stores/index";
import wxRequest from "@/utils/request";

export default {
  data() {
    return {
      incomeList: {
        pageNo: 1,
        pageSize: 10,
        list: []
      }
    };
  },
  computed: {
    // 今日收益
    todayIncome() {
      return utils.fixed(stores.state.parsonal.todayIncome, 2);
    },
    // 累计收益
    totalIncome() {
      return utils.fixed(stores.state.parsonal.totalIncome, 2);
    },
    // 余额
    balance() {
      return utils.fixed(stores.state.parsonal.balance, 2);
    },
    // 提现中
    withdraw() {
      return utils.fixed(stores.state.parsonal.withdraw, 2);
    }
  },
  methods: {
    takecash() {
      wx.navigateTo({
        url: "/pages/takeCash/main"
      });
    }
  },
  mounted() {
    wxRequest(
      {
        url: "/journalAccountController/list",
        data: {
          pageNo: this.incomeList.pageNo,
          pageSize: this.incomeList.pageSize
        }
      },
      true
    ).then(response => {
      this.incomeList.list = response.data.list;
      if (response.data.list.length > 0) {
        this.incomeList.pageNo++;
      }
      wxRequest(
        {
          url: "/buyerController/findInfo",
        },
        true
      ).then(response => {
        stores.dispatch("setParsonal", response.data);
      });
    });
  },
  onShareAppMessage() {
    return {
      title: '推荐有奖',
      path: '/pages/index/main?inviterId=' + stores.state.buyerId,
    }
  },
  onPullDownRefresh: function(e) {
    this.incomeList.pageNo = 1
    wxRequest(
      {
        url: "/journalAccountController/list",
        data: {
          pageNo: this.incomeList.pageNo,
          pageSize: this.incomeList.pageSize
        }
      },
      true
    ).then(response => {
      this.incomeList.list = response.data.list;
      if (response.data.list.length > 0) {
        this.incomeList.pageNo++;
      }
      wxRequest(
        {
          url: "/buyerController/findInfo",
        },
        true
      ).then(response => {
        stores.dispatch("setParsonal", response.data);
        wx.stopPullDownRefresh();
      });
    });
  },
  onReachBottom: function() {
    wxRequest(
      {
        url: "/journalAccountController/list",
        data: {
          pageNo: this.incomeList.pageNo,
          pageSize: this.incomeList.pageSize
        }
      },
      true
    ).then(response => {
      incomeList.list = [...incomeList.list, ...response.data.list];
      if (response.data.list.length > 0) {
        incomeList.pageNo++;
      }
      wxRequest(
        {
          url: "/buyerController/findInfo",
        },
        true
      ).then(response => {
        stores.dispatch("setParsonal", response.data);
      });
    });
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data());
  },
  onShow(obj) {
    this.incomeList.pageNo = 1
    wxRequest(
      {
        url: "/journalAccountController/list",
        data: {
          pageNo: this.incomeList.pageNo,
          pageSize: this.incomeList.pageSize
        }
      },
      true
    ).then(response => {
      this.incomeList.list = response.data.list;
      if (response.data.list.length > 0) {
        this.incomeList.pageNo++;
      }
      wxRequest(
        {
          url: "/buyerController/findInfo",
        },
        true
      ).then(response => {
        stores.dispatch("setParsonal", response.data);
      });
    });
  }
};
</script>

<style scoped>
.container {
  align-items: initial;
}
/* income-content */
.income-content {
  margin-bottom: 50px;
}

/* today-income */
.today-income {
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #1481FA; */
  color: #fcfdfe;
  font-size: 0.3rem;
  flex-direction: column;
  position: relative;
}

.today-income .income-amount {
  /* font-weight: bold; */
  font-size: 28px;
  color: #fff;
  margin-top: 15px;
}

/* all-income */
.all-income {
  display: flex;
  padding: 10px 15px;
  background-color: rgba(22, 104, 230, 1);
  color: #e8ebef;
}

.all-income > view {
  flex: 1;
  font-size: 12px;
  text-align: center;
  border-left: 1px solid #4485ec;
}

.all-income > view:first-child {
  border: none;
}

/* .all-income > view > view:first-child {
  color: #9abdf8;
  font-size: 12px;
} */

/* btns */
.btns {
  background-color: #fff;
  margin: 0;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: table;
}

.btns > .btn {
  display: table-cell;
  width: 50%;
  vertical-align: middle;
  padding: 5px 10px;
}

.btns > .btn > button {
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
}

/* income-detail */
.income-detail .item {
  display: flex;
  flex-direction: cloumn;
  padding: 10px 20px;
}

.income-detail .item > .item-left {
  flex: 1;
  font-size: 12px;
  color: #adadad;
  line-height: 30px;
}

.income-detail .item > .item-left > .title {
  color: #333333;
  font-size: 15px;
}

.income-detail .item > .item-right {
  display: flex;
  padding: 0 10px;
  align-items: center;
  font-size: 14px;
}

.income-header {
  position: relative;
}

.income-header-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}

button.default {
  color: #4485ec;
  border: 1px solid #4485ec;
}
</style>


