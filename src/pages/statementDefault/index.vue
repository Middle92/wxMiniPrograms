<template>
    <div class="container">
        <div class="statement-default">
            <img src="/static/test_header.jpg" alt="">
            <div class="statement-default-default">
                <p class="statement-default-title">{{Data.title}}</p>
                <div class="statement-default-info">
                    <p>规格：{{Data.spec}}</p>
                    <p>数量：{{Data.number}}</p>
                </div>
            </div>
        </div>

        <div class="statement-reason">
            <p>投诉理由：<span>{{Data.complaintReasons}}</span></p>
            <textarea></textarea>
            <div class="statement-default-btn">
                <button class="primary">立即申述</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Data: {
                title: '采购LED灯带',
                spec: 'EVDF11',
                number: '5件',
                complaintReasons: '产品质量存在问题'
            }
        }
    }
}
</script>

<style scoped>
.container {
    background-color: #f7f7f7;
}

.statement-default, .statement-reason {
    width: 100%;
    box-sizing: border-box;
    padding: 15px 20px;
    background-color: #fff;
}

.statement-default {
    display:flex;
    margin-bottom: 10px;
}

.statement-default img {
    height: 68px;
    width: 68px;
    border-radius: 5px;
}

.statement-default-default {
    flex: 1;
    padding-left: 20px;
}

.statement-default-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.statement-default-info {
    font-size: 12px;
    color: #666666;
}

.statement-reason {
    font-size: 14px;
    flex: 1;
}

.statement-reason span {
    color: #f77a20;
}

.statement-reason textarea {
    height: 150px;
    box-sizing: border-box;
    overflow: auto;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    width: 100%;
    margin-top: 15px;
    padding: 10px;
}

.statement-default-btn {
    padding: 0 10px;
    margin-top: 15px;
}
</style>

