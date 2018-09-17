<template>
    <div class="container" :style="{overflow: visibility ? 'hidden' : 'initial'}">
        <ul class="lists">
            <li class="list" v-for="(item, index) in listData" :key="index">
                <div class="list-content" 
                    @touchstart="touchstart" 
                    @touchmove="touchmove" 
                    @touchend="touchend" 
                    :data-index="index"
                    :style="{marginLeft: index == touchIndex ? touchStyle + 'rpx' : 0 + 'rpx'}"
                    >
                    <img :src="item.image" alt="">
                    <div class="info">
                        <p class="title">{{item.title}}</p>
                        <p class="information">
                            {{item.userName}}&nbsp;&nbsp;&nbsp;
                            {{item.userPhone}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            {{item.site}}
                        </p>
                        <p class="class">主营：{{item.class}}</p>
                    </div>
                </div>
                <div class="list-operating">
                    <div class="operating-box" :style="{width: delBtnWidth + 'rpx'}">
                        <span class="btn exportBtn" @click="exportFun">导出</span>
                        <span class="btn deleteBtn">删除</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="export">
            <button class="primary">全部导出</button>
        </div>
        <exportComponent :visibility="visibility" @visibility="visibilityFun"></exportComponent>
    </div>
</template>

<script>
import exportComponent from '../../components/export';
export default {
    name: 'Excellent Supplier',
    data() {
        return {
            startX: null,
            delBtnWidth: 300,
            touchStyle:0,
            touchIndex: 0,
            startStyle: 0,
            visibility: false,
            listData: [
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
                {
                    image:'/static/test_header.jpg',
                    title: '北京敬业物资回收中心',
                    userName: '周先生',
                    userPhone: '13800138000',
                    site: '广东 广州',
                    class: '消防器材 安全绳 夜光牌 地贴膜'
                },
            ],
        }
    },
    methods: {
        touchstart(e) {
            // console.log("touchS", e);
            if(e.mp.touches.length==1){
                if(this.touchIndex == e.currentTarget.dataset.index) {
                    this.startStyle = this.touchStyle;
                } else {
                    this.startStyle = this.touchStyle = 0;
                    this.touchIndex = e.currentTarget.dataset.index;
                }
                this.startX = e.mp.touches[0].clientX
                
            }
        },
        touchmove(e) {
            // console.log("touchM:", e);
            if(e.mp.touches.length==1){
                let moveX = -(this.startX - e.mp.touches[0].clientX);
                if(moveX < 0) {
                    this.touchStyle = this.startStyle + moveX;
                } else {
                    if(this.startStyle + moveX < 0) {
                        this.touchStyle = this.startStyle + moveX;
                    }
                }
            }
        },
        touchend(e) {
            // console.log('touchend', e)
            if(e.mp.changedTouches.length==1){
                if(this.touchStyle < -(this.delBtnWidth/2)) {
                    this.touchStyle = -this.delBtnWidth;
                } else {
                    this.touchStyle = 0;
                }
            }
        },
        exportFun() {
            this.visibility = true;
        },
        visibilityFun(options) {
            this.visibility = options
        }
    },
    components: {
        exportComponent
    }
}
</script>

<style scoped>
.lists {
    width: 100%;
    padding-bottom: 50px;
}

.lists > .list {
    /* box-shadow:0rpx 5rpx 5rpx #ddd inset; */
    position: relative;
    /* margin-bottom:5px; */
    background-color: #cdcdcd
}

.lists > .list::after {
    content: '';
    display: block;
    height: 0px;
    width: 0px;
    clear: both;
}

.list-content {
    padding: 10px;
    display: flex;
    /* position:absolute;
    top: 0;
    left: 0; */
    width: 100%;
    box-sizing: border-box;
    float: left;
    position: relative;
    z-index: 10;
    background-color: #ffffff;
    transition: all .1s;
    box-shadow:0rpx 5rpx 5rpx #ddd inset;
}

.list-content > img {
    width: 80px;
    height: 80px;
}

.list-content > .info {
    flex: 1;
    padding: 5px 10px;
}

.info > .title {
    font-size: 18px;
    color: #313131;
    margin-bottom: 5px;
}

.info > .information {
    font-size: 14px;
    color: #6e6e6e;
    margin-bottom: 10px;
}

.info > .class {
    font-size: 12px;
    color: #878787;
}

.list-operating {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.list-operating .operating-box {
    float: right;
    height: 100%;
    display: table;
}

.list-operating .operating-box .btn {
    width: 50%;
    height: 100%;
    text-align: center;
    color: #fff;
    font-size: 16px;
    display: table-cell;
    vertical-align: middle;
}

.exportBtn {
    background-color: #cdcdcd;
}

.deleteBtn {
    background-color: #ff3b2f;
}

.export {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 10px;
    background: #fff;
    z-index:20;
}

.export button {
    width: 80%;
}
</style>
