<template>
    <div class="container">
        <ul class="statement">
            <li class="statement-item" v-for="(item, index) in Data" :key="index">
                <img :src="item.productImg" alt="" style="width: 68px; height: 68px; border-radius: 4px;">
                <div class="statement-default">
                    <p class="statement-title">{{item.product}}</p>
                    <div class="statement-info">
                        <p>规格：{{item.complainContent}}</p>
                        <p>数量：{{item.number}}</p>
                    </div>
                </div>
                <div class="statement-btn">
                    <button class="primary" :data-id="item.id" @click="statementDefault">申述</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import store from '@/stores';
import wxRequest from '@/utils/request';

export default {
    data() {
        return {
            Data: []
        }
    },
    methods: {
        statementDefault(e) {
            wx.navigateTo({
                url: `/pages/statementDefault/main?id=${e.currentTarget.dataset.id}`,
            });
        }
    },
    mounted() {
        wxRequest({
            url: '/feedbackController/list'
        }, true).then(response => {
            this.Data = response.data.list;
            store.commit('setStatement', this.Data)
        })
    },
    onPullDownRefresh() {
        wxRequest({
            url: '/feedbackController/list'
        }, true).then(response => {
            this.Data = response.data.list;
            store.commit('setStatement', this.Data)
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
</style>

