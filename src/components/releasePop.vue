<template>
    <div class="export-modle" :class="{'hide': !visibility}">
        <div class="export-element">
            <h1>为了帮你匹配到更精准的供应商请完善你的企业信息</h1>
            <div class="export-btns">
                <div class="btn left">
                    <button @click="$emit('visibility', false)">取消</button>
                </div>
                <div class="btn right">
                    <button class="primary" @click="OK">确定</button>
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
    return {};
  },
  methods: {
    OK() {
      this.$emit("visibility", false);
      wx.navigateTo({
        url: "/pages/personal/main"
      });
    }
  }
};
</script>

<style scoped>
.export-modle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
  display: flex;
}

.export-element {
  width: 210px;
  margin: auto;
  background-color: #fff;
  border-radius: 6px;
  padding: 40px;
}

.export-element h1 {
  font-size: 14px;
  text-align: center;
  color: #555555;
  height: 45px;
  line-height: 30px;
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
  /* margin-bottom: 20px; */
}

.export-btns .btn {
  width: 50%;
  display: table-cell;
  text-align: center;
}

.export-btns .btn button {
  display: inline-block;
  font-size: 15px;
  width: 100%;
}

.hide {
  display: none;
}

.left {
  padding-right: 15px;
}

.right {
  padding-left: 15px;
}
</style>

