<template>
    <div class="export-modle" :class="{'hide': !visibility}">
        <div class="export-element">
            <h1>我们会将供应商信息发到你的邮箱</h1>
            <div class="export-content">
                <label for="">邮箱</label>
                <input type="text" placeholder="请输入正确邮箱地址">
            </div>
            <div class="export-btns">
                <div class="btn">
                    <button @click="$emit('visibility', false)">取消</button>
                </div>
                <div class="btn">
                    <button class="primary" @click="$emit('visibility', false)">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visibility: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    }
}
</script>

<style scoped>
    .export-modle {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        z-index: 20;
        display:flex;
    }

    .export-element {
        width:290px;
        margin:auto;
        background-color:#fff;
        border-radius: 6px;
        padding: 15px;
    }

    .export-element h1 {
        font-size: 14px;
        text-align: center;
        color: #555555;
        height: 45px;
        line-height: 45px;
        /* margin-bottom: 20px; */
    }

    .export-content {
        display: flex;
        vertical-align: middle;
        align-items: center;
        margin-top: 10px;
        /* padding-bottom: 20px; */
        border-bottom: 1px solid #dcdcdc;
        /* margin-bottom: 20px; */
        height: 50px;
        line-height: 50px;
    }

    .export-content label {
        margin-right: 10px;
        font-size: 14px;
    }

    .export-content input {
        flex: 1;
        font-size: 11px;
    }

    .export-btns {
        width: 100%;
        display: table;
        margin-top: 40px;
        margin-bottom: 20px;
    }

    .export-btns .btn {
        width: 50%;
        display: table-cell;
        text-align: center;
    }

    .export-btns .btn button {
        display: inline-block;
        font-size: 15px;
        width: 50%;
    }

    .hide {
        display: none;
    }
</style>


