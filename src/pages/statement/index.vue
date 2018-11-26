<template>
    <div class="container">
        <ul class="statement">
            <li class="statement-item" v-for="(item, index) in Data.data" :key="index">
                <img :src="item.productImg ? baseUrl + item.productImg : '/static/logo.png'" alt="" style="width: 68px; height: 68px; border-radius: 4px;">
                <div class="statement-default">
                    <p class="statement-title">{{item.product}}</p>
                    <div class="statement-info">
                        <p>规格：{{item.complainContent}}</p>
                        <p>数量：{{item.number}}</p>
                    </div>
                </div>
                <div class="statement-btn">
                    <button v-if="item.appealStatus == '0'" class="primary" :data-id="item.id" @click="statementDefault">申诉</button>
                    <span class="appealStatus " v-if="item.appealStatus == '1'">申诉中</span>
                    <span class="appealStatus success" v-if="item.appealStatus == '3'">申诉成功</span>
                    <span class="appealStatus fail" v-if="item.appealStatus == '2'">申诉失败</span>
                </div>
            </li>

            <div v-if="Data.data.length <= 0" class="data-none">
                <span>暂无数据</span>
            </div>
        </ul>
    </div>
</template>

<script>
import store from '@/stores';
import wxRequest from '@/utils/request';

export default {
    data() {
        return {
            Data: {
                pageNo: 1,
                pageSize: 10,
                data: []
            }
        }
    },
    methods: {
        statementDefault(e) {
            wx.navigateTo({
                url: `/pages/statementDefault/main?id=${e.currentTarget.dataset.id}`,
            });
        }
    },
    computed: {
        baseUrl() {
            return store.state.baseUrl;
        }
    },
    onPullDownRefresh() {
        this.Data.pageNo = 1;
        let obj = {
            pageNo: this.Data.pageNo,
            pageSize: this.Data.pageSize,
        }

        wxRequest({
            url: '/feedbackController/list',
            data: obj
        }, true).then(response => {
            if(response.data.list.length > 0) {
                this.Data.pageNo++
            }
            this.Data.data = response.data.list;
            store.commit('setStatement', this.Data.data)
            wx.stopPullDownRefresh();
        })
    },
    onReachBottom() {
        let obj = {
            pageNo: this.Data.pageNo,
            pageSize: this.Data.pageSize,
        }
        wxRequest({
            url: '/feedbackController/list',
            data: obj
        }, true).then((response) => {
            if(response.data.list.length > 0) {
                this.Data.pageNo++
            }
            this.Data.data = [...this.Data.data, ...response.data.list];
        })
    },
    onShow() {
        Object.assign(this.$data, this.$options.data());
        let obj = {
            pageNo: this.Data.pageNo,
            pageSize: this.Data.pageSize,
        }

        wxRequest({
            url: '/feedbackController/list',
            data: obj
        }, true).then(response => {
            if(response.data.list.length > 0) {
                this.Data.pageNo++
            }
            this.Data.data = response.data.list;
            store.commit('setStatement', this.Data.data)
            wx.stopPullDownRefresh();
        })
    }
}
</script>

<style scoped>
.statement {
    width: 100%;
    box-sizing: border-box;
}

.statement-item {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 15px 13px;
    border-bottom: 1px solid #f2f2f2;
    align-items: center;
}

.statement-default {
    flex: 1;
    padding-left: 20px;
}

.statement-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.statement-info {
    font-size: 12px;
    color: #666666;
}

.statement-btn button {
    font-size: 14px;
}

.appealStatus {
    font-size: 14px;
}

.success {
    color: #ff9000;
}

.fail {
    color: #69c44e;
}

.wait {
    color: #888888;
}
</style>

