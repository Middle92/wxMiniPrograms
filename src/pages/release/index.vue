<template>
    <div class="container">
        <ul class="release-tab">
            <li v-for="(item, index) in tab" :key="index" :class="{active: item.active}" :data-index="index" @click="tapToggle">
                {{item.title}}
            </li>
        </ul>
        
        <div class="release-content">
            <ul class="release" v-for="(item, index) in tabData" :key="index" v-show="tab[index].active">
                <li class="release-item" v-for="(ite, inde) in item" :key="inde">
                    <img src="/static/test-bg-1.png" alt="" style="width: 68px; height: 68px; border-radius: 4px;">
                    <div class="release-default">
                        <p class="release-title">{{ite.title}}</p>
                        <div class="release-info">
                            <p>规格：{{ite.spec}}</p>
                            <p>数量：{{ite.number}}</p>
                        </div>
                    </div>
                    <div class="release-btn">
                        <span class="audit" v-if="index === 0">审核中</span>
                        <span class="published" v-else-if="index === 1">已发布</span>
                        <span class="not-through" v-else>审核未通过</span>
                        <!-- <button class="primary" @click="statementDefault">申述</button> -->
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tab: [
                {
                    title: '审核中',
                    active: true
                }, {
                    title: '已发布'
                }, {
                    title: '未通过'
                }
            ],
            tabData: [
                // 审核中
                [
                    {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    },
                ],
                // 已发布
                [
                    {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    },
                ],
                // 未通过
                [
                    {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    }, {
                        title: '采购LED灯带',
                        spec: 'EVDF11',
                        number: '5件'
                    },
                ]
            ]
        }
    },
    methods: {
        tapToggle(e) {
            var index = e.target.dataset.index;
            this.tab = this.tab.map((item, inde) => {
                item.active = false;
                console.log(index, inde)
                if(index === inde) {
                    item.active = true;
                }
                return item;
            })
        }
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


