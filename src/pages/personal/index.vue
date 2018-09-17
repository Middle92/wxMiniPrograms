<template>
    <div class="container">
        <div v-for="(item, index) in personalList" :key="index" :data-index="index" class='personal-item' @click="item.clickType(index)" :class="{mb20: index === 3}">
            <div class='input'>
                <p class="title">{{item.title}}</p>
                <p v-if="parsonalData[item.key] && item.key != 'image'">
                  {{parsonalData[item.key]}}
                </p>
                <img v-else-if="parsonalData[item.key] && item.key == 'image'" :src="parsonalData[item.key]" alt="">
                <p v-else>{{item.placeholder}}</p>
            </div>
        </div>
        <!-- <div class='submit-btns'>
            <button class='primary'>递名片</button>
        </div> -->
    </div>
</template>

<script>
import store from "../../stores";
export default {
  data() {
    return {
      personalList: [
        {
          title: "头像",
          key: "image",
          placeholder: ">",
          clickType: this.chooseImage
        },
        {
          title: "姓名",
          key: "name",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "邮箱",
          key: "mail",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "手机号码",
          key: "phone",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "申述",
          key: "statement",
          placeholder: ">",
          clickType: this.statement
        },
        {
          title: "我的发布",
          key: "release",
          placeholder: ">",
          clickType: this.release
        },
        {
          title: "微信号",
          key: "wechatNumber",
          placeholder: ">",
          clickType: function() {}
        },
        {
          title: "所在公司",
          key: "company",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "公司地址",
          key: "companySite",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "所在职位",
          key: "job",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "主营产品",
          key: "product",
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "品牌",
          key: 'brand',
          placeholder: "未填写 >",
          clickType: this.editType1
        },
        {
          title: "新手引导",
          placeholder: ">",
          key: "guidance",
          clickType: function() {}
        }
      ]
    };
  },
  computed: {
    parsonalData() {
      return store.state.parsonal;
    }
  },
  watch: {
    parsonalData(val, oldvalue){
      console.log(val, oldvalue)
    }
  },
  methods: {
    // 编辑
    editType1(inde) {
      let filterData = this.personalList.filter(
        (item, index) => index === inde
      );
      let name = filterData[0].title;
      let key = filterData[0].key;
      wx.navigateTo({
        url: "/pages/editparsonal/main?name=" + name + "&key=" + key,
      });
    },
    // 选择头像
    chooseImage() {
      let self = this;
      wx.chooseImage({
        count: 1,
        success(res) {
          let tempFilePaths = res.tempFilePaths;
          store.commit("setParsonal", { image: tempFilePaths });
        }
      });
    },
    // 申述
    statement() {
      wx.navigateTo({
        url: "/pages/statement/main",
      });
    },
    // 我的发布
    release() {
      wx.navigateTo({
        url: "/pages/release/main",
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f7f7f7; /*f7f7f7*/
}
/* pages/personal/personal.wxss */
/* personal-item */
.personal-item {
  border-bottom: 1px solid #f2f2f2;
  padding: 5px 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
}

/* submit-btns */
.submit-btns {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f7f7f7;
}

/* clear */
.clear {
  clear: both;
}

.input {
  display: flex;
  color: #cccccc;
  line-height: 0.8rem;
  font-size: 0.3rem;
  align-items:center;
}

.input > .title {
  flex: 1;
  color: #343434;
}

.input > image {
  width: .8rem;
  height: .8rem;
  border-radius: 50%;
}

.mb20 {
  margin-bottom: 0.25rem;
}
</style>


