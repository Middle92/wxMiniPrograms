<template>
    <div class="container" :style="{overflow: visibility ? 'hidden' : 'initial'}">
        <ul class="lists">
            <li class="list" v-for="(item, index) in listData.data" :key="index">
                <div class="list-content" 
                    @touchstart="touchstart" 
                    @touchmove="touchmove" 
                    @touchend="touchend"
                    @touchcancel="touchcancel"
                    :data-index="index"
                    :style="{marginLeft: index == touchIndex ? touchStyle + 'rpx' : 0 + 'rpx'}"
                    >
                    <img :src="item.comLogo" alt="">
                    <div class="info">
                        <p class="title">{{item.domian}}</p>
                        <p class="information">
                            {{item.userName}}&nbsp;&nbsp;&nbsp;
                            {{item.userPhone}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                            {{item.userProCity}}
                        </p>
                        <p class="class">主营：{{item.zycp || ''}}</p>
                    </div>
                </div>
                <div class="list-operating">
                    <div class="operating-box" :style="{width: delBtnWidth + 'rpx'}">
                        <span class="btn exportBtn" :data-userid="item.id" @click="exportFun">导出</span>
                        <span class="btn deleteBtn" :data-userid="item.id" @click="del">删除</span>
                    </div>
                </div>
            </li>
            <div v-if="listData.data.length <= 0" class="data-none">
                <span>暂无数据</span>
            </div>
        </ul>
        <div class="export">
            <button class="primary" @click="exportFun" :disabled="listData.data.length <= 0">全部导出</button>
        </div>
        <exportComponent :data="exportArr" :visibility="visibility" @visibility="visibilityFun"></exportComponent>
    </div>
</template>

<script>
import exportComponent from '../../components/export';
import wxRequest from "@/utils/request";

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
            listData: {
                pageNo: 1,
                pageSize: 10,
                data: []
            },
            purchaseOrdersId: null,
            exportArr: null
        }
    },
    methods: {
        touchstart(e) {
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
            if(e.mp.changedTouches.length==1){
                if(this.touchStyle < -(this.delBtnWidth/2)) {
                    this.touchStyle = -this.delBtnWidth;
                } else {
                    this.touchStyle = 0;
                }
            }
        },
        touchcancel(e) {
            if(this.touchStyle < -(this.delBtnWidth/2)) {
                this.touchStyle = -this.delBtnWidth;
            } else {
                this.touchStyle = 0;
            }
        },
        del(e) {
            let userid = e.currentTarget.dataset.userid;
            let self = this;
            wx.showModal({
                title: '删除',
                content: '确认删除么？',
                success(res) {
                    if(res.confirm) {
                        wxRequest({
                            url: '/supplierController/del',
                            data: {
                                userId: userid
                            }
                        }, true).then((response) => {
                            wx.showToast({
                                mask: true,
                                icon: 'success',
                                title: '删除成功',
                                success:() => {
                                    self.listData.data = self.listData.data.filter(item => item.id != userid);
                                    self.touchStyle = 0;
                                }
                            })
                        })
                    }
                }
            })
        },
        exportFun(e) {
            this.visibility = true;
            let userid = e.currentTarget.dataset.userid;
            let arr = []
            if(userid) {
                arr.push(userid)
            } else {
                arr = this.listData.data.map((item) => {
                    return item.id
                })
            }
            this.exportArr = arr.join(',');
        },
        visibilityFun(options) {
            // status -> boolean -> 隐藏弹窗
            // type -> 1:取消 2:确定
            if(options.type == 2) {
                wx.showLoading({
                    title: '导出中...',
                    mask: true
                })
                wxRequest({
                    url: '/supplierController/excelSend',
                    data: {
                        mailbox: options.mail,
                        ids: this.exportArr
                    }
                }, true).then((response) => {
                    wx.hideLoading();
                    wx.showToast({
                        mask: true,
                        icon: 'success',
                        title: '导出成功',
                        success:() => {
                            setTimeout(() => {
                                this.visibility = options.status;
                            })
                        }
                    })
                }).catch(() => {
                    wx.hideLoading();
                    wx.showToast({
                        mask: true,
                        icon: 'success',
                        title: '请求出错',
                        success:() => {
                            setTimeout(() => {
                                this.visibility = options.status;
                            })
                        }
                    })
                })
            } else {
                this.visibility = options.status
            }
        }
    },
    components: {
        exportComponent
    },
    onPullDownRefresh() {
        this.listData.pageNo = 1;
        let url;
        let obj = {
            pageNo: this.listData.pageNo,
            pageSize: this.listData.pageSize,
        }
        if(this.purchaseOrdersId) {
            obj.purchaseOrdersId = this.purchaseOrdersId
            url = '/supplierController/seekSupplier';
        } else {
            url = '/supplierController/excellenceSupplier';
        }
        
        wxRequest({
            url: url,
            data: obj
        }, true).then((response) => {
            if(response.data.list.length > 0) {
                this.listData.pageNo++
            }
            this.listData.data = response.data.list;
            wx.stopPullDownRefresh();
        })
    },
    onReachBottom() {
        let url;
        let obj = {
            pageNo: this.listData.pageNo,
            pageSize: this.listData.pageSize,
        }
        if(this.purchaseOrdersId) {
            obj.purchaseOrdersId = this.purchaseOrdersId
            url = '/supplierController/seekSupplier';
        } else {
            url = '/supplierController/excellenceSupplier';
        }
        wxRequest({
            url: url,
            data: obj
        }, true).then((response) => {
            if(response.data.list.length > 0) {
                this.listData.pageNo++
            }
            this.listData.data = [...this.listData.data, ...response.data.list];
        })
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        let url;
        let obj = {
            pageNo: this.listData.pageNo,
            pageSize: this.listData.pageSize,
        }
        if(options.purchaseOrdersId) {
            this.purchaseOrdersId = obj.purchaseOrdersId = options.purchaseOrdersId
            url = '/supplierController/seekSupplier';
        } else {
            url = '/supplierController/excellenceSupplier';
        }
        wxRequest({
            url: url,
            data: obj
        }, true).then((response) => {
            if(response.data.list.length > 0) {
                this.listData.pageNo++
            }
            this.listData.data = response.data.list;
        })
    }
}
</script>

<style scoped>
.lists {
    width: 100%;
    padding-bottom: 50px;
}

.lists > .list {
    position: relative;
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
    width: 70px;
    height: 70px;
}

.list-content > .info {
    flex: 1;
    padding: 5px 10px;
}

.info > .title {
    font-size: 15px;
    color: #333;
    margin-bottom: 5px;
}

.info > .information {
    font-size: 12px;
    color: #666666;
    margin-bottom: 10px;
}

.info > .class {
    font-size: 12px;
    color: #888888;
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
