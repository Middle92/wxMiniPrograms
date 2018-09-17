<template>
    <div class="container">
        <div class="title">
            <h1>采购用于回收液晶广告</h1>
            <p>2018-06-05  11:05丨 商机总收益<span>80.00</span>元</p>
            <!-- <img src="/static/icon-1.png" alt=""> -->
        </div>
        <div class="content">
            <ul>
                <li class="user-info">
                    <img src="/static/test_header.jpg" alt="">
                    <div>
                        <p class="user-name">何强</p>
                        <p class="company">广州一呼百应网络技术股份有限公司</p>
                    </div>
                </li>
                <li class="product-info">
                    <div class="group">
                        <label for="">采购数量</label>
                        <div class="group-content"><span>10</span>件</div>
                    </div>

                    <div class="group">
                        <label for="">价格</label>
                        <div class="group-content">
                            <span>20.00</span>元
                            <img src="/static/icon-15.png"  mode="widthFix" alt="" style="width: 18px;"/>
                        </div>
                    </div>

                    <div class="group">
                        <label for="">语音描述</label>
                        <div class="group-content">
                            <div class="voice-description">
                                <img src="/static/icon-14.png" mode="widthFix" alt="" style="width: 15px;">
                            </div>
                        </div>
                    </div>
                </li>
                <li class="supplement">
                    <div class="group">
                        <label for="">补充说明</label>
                        <div class="group-content">
                            <p>音响设备回收 仪器仪表回收 机房电瓶回收电脑设备</p>
                            <div class="images">
                                <img mode="widthFix" src="/static/test-bg-1.png" alt="">
                                <img mode="widthFix" src="/static/test-bg-2.png" alt="">
                                <img mode="widthFix" src="/static/test-bg-3.png" alt="">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="other">
            <div class="group">
                <label for=""></label>
                <div class="group-content">
                    阅读152    报价4
                    <span>广东 广州</span>
                </div>
            </div>
            <div class="over">~ 全部加载完毕 ~</div>
        </div>
        <div class="footer">
            <ul>
                <li>
                    <img src="/static/icon-5.png" mode="widthFix" alt="" style="width: 15px;">
                    分享到朋友圈
                </li>
                <li>
                    <img src="/static/icon-6.png" mode="widthFix" alt="" style="width: 15px;">
                    查看供应商
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style scoped>
.container {
    background-color: #f7f7f7;
}

.title, .content, .footer {
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
}

.title {
    margin-bottom: 10px;
    padding: 10px 20px;
}

.title > h1 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.title > p {
    font-size: 12px;
    color: #333333;
}

.title > p > span {
    color: #f77a1f;
    font-size: 16px;
    font-weight: bold;
}

.product-info, .supplement {
    padding: 0 20px;
}

.user-info {
    display: flex;
    padding: 10px 20px;
}

.user-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-info .user-name {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.user-info .company {
    font-size: 14px;
    color: #888888;
}

.group {
    display: flex;
    padding: 10px 0;
}

.group label {
    width: 80px;
    font-size: 16px;
    /* line-height: 50px; */
}

.group .group-content {
    color: #888888;
    font-size: 16px;
    /* line-height: 50px; */
    flex: 1;
}

.group-content span {
    color: #ff9000;
}

.group-content .images {
    margin: 10px 0;
}

.group-content .images > img {
    width: 30%;
    margin-right: 3%;
    margin-bottom: 5px;
}

.voice-description {
    background-color: #2ac94f;
    height: 30px;
    width: 50%;
    border-radius: 6px;
    position: relative;
    margin-left: 10px;
}

.voice-description::before {
    content: '';
    display: inline-block;
    position: absolute;
    border: 10px solid #2ac94f;
    top: 50%;
    left: -19px;
    margin-top: -10px;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
}

.voice-description img {
    position: absolute;
    top: 50%;
    margin-top: -10px;
    left: 10px;
}
.footer {
    padding: 10px 0;
    position: fixed;
    bottom: 0;
    width: 100%;
}
.footer ul li {
    width: 50%;
    box-sizing: border-box;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    color: #3f8bf4;
}

.footer ul li:first-child {
    border-right: 1px solid #e9e9e9
}

.other {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.other .group-content {
    font-size: 14px;
    color: #999999;
}

.other .group-content > span {
    color: #999999;
    float: right;
}

.other .over {
    font-size: 12px;
    text-align: center;
    color: #888888;
    margin: 20px 0 50px 0
}
</style>


