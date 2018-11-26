<template>
    <div class="container">
        <ul class="release-tab">
            <li v-for="(item, index) in tab" :key="index" :class="{active: item.active}" :data-index="index" @click="tapToggle">
                {{item.title}}
            </li>
        </ul>
        
        <div class="release-content">
            <ul class="release" v-for="(item, index) in tab" :key="index" v-show="tab[index].active">
                <li class="release-item" v-for="(ite, inde) in item.data" :key="inde" :data-id="ite.id" :data-status="item.status" @click="itemDefault">
                    <img :src="ite.productImg ? baseUrl + ite.productImg : '/static/logo.png'" alt="" style="width: 68px; height: 68px; border-radius: 4px;">
                    <div class="release-default">
                        <p class="release-title">{{ite.product}}</p>
                        <div class="release-info">
                            <p>规格：{{ite.unit}}</p>
                            <p>数量：{{ite.number}}</p>
                        </div>
                    </div>
                    <div class="release-btn">
                        <span class="audit" v-if="ite.status === 0">审核中</span>
                        <span class="published" v-else-if="ite.status === 2">已发布</span>
                        <span class="not-through" v-else-if="ite.status === 1">审核未通过</span>
                    </div>
                </li>

                <div v-if="item.data.length <= 0" class="data-none">
                    <!-- <span>暂无数据</span> -->                 <img src="/static/bg-5.png" mode="aspectFit" alt="">
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
import store from '@/stores';
export default {
    data() {
        return {
            tab: [
                {
                    title: '审核中',
                    active: true,
                    pageNo: 1,
                    status: 0,
                    data: []
                }, {
                    title: '已发布',
                    pageNo: 1,
                    status: 2,
                    data: []
                }, {
                    title: '未通过',
                    pageNo: 1,
                    status: 1,
                    data: []
                }
            ]
        }
    },
    methods: {
        tapToggle(e) {
            var index = e.target.dataset.index;
            this.tab = this.tab.map((item, inde) => {
                item.active = false;
                if(index === inde) {
                    item.active = true;
                }
                return item;
            })
        },
        itemDefault(e) {
            let id = e.currentTarget.dataset.id
            let status = e.currentTarget.dataset.status
            wx.navigateTo({
                url: `/pages/purchaseOrderDefault/main?id=${id}&status=${status}`
            })
        }
    },
    computed: {
        baseUrl() {
            return store.state.baseUrl;
        }
    },
    mounted() {
        this.tab.map(item => {
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
                });
        })
    },
    onPullDownRefresh(e) {
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
        })
    },
    onReachBottom() {
        this.tab.map(item => {
            if(item.active) {
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
            }
        });
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
    }
}
</script>

<style scoped>
.release-tab {
    width: 100%;
    box-sizing: border-box;
    /* display: flex; */
    padding: 10px 0;
    background-color: #f7f7f7;
}

.release-tab li {
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: #333333;
    width:33.33%;
    float:left;
    box-sizing:border-box;
}

.release-tab li:not(:last-child) {
    border-right: 1px solid #cccccc;
}

.release-tab .active {
    color: #1576fb;
    position: relative;
}

.release-tab .active::before {
    content: '';
    width: 1rem;
    border: 1px solid #1576fb;
    position: absolute;
    left: 50%;
    margin-left: -.5rem;
    bottom: -5px;
}

.release-content {
    width: 100%;
    box-sizing: border-box;
}

.release {
    width: 100%;
    box-sizing: border-box;
}

.release-item {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 15px 13px;
    border-bottom: 1px solid #f2f2f2;
    align-items: center;
}

.release-default {
    flex: 1;
    padding-left: 20px;
}

.release-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.release-info {
    font-size: 12px;
    color: #666666;
}

.release-btn span {
    font-size: 14px;
}

.audit {
    color: #999999;
}

.not-through {
    color: #f77a1e;
}

.published {
    color: #157efb;
}
</style>


