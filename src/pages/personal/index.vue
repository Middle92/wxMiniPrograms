<template>
    <div class="container">
        <div v-for="(item, index) in personalList" :key="index" :data-index="index" class='personal-item' @click="item.clickType(index)" :class="{mb20: index === 3}">
            <div class='input'>
                <p class="title">{{item.title}}</p>
                <p v-if="parsonalData[item.key] && item.key != 'photo'">
                  {{parsonalData[item.key]}}
                </p>
                <img v-else-if="parsonalData[item.key] && item.key == 'photo'" :src="photoUrl" alt="">
                <p v-else>{{item.placeholder}} <i class="icon iconfont icon-htbarrowright02"></i></p>
            </div>
        </div>
        <!-- <div class='submit-btns'>
            <button class='primary'>递名片</button>
        </div> -->
    </div>
</template>

<script>
import store from "../../stores";
import wxRequest from "../../utils/request";

export default {
  data() {
    return {
      personalList: [
        {
          title: "头像",
          key: "photo",
          placeholder: "",
          clickType: this.chooseImage
        },
        {
          title: "姓名",
          key: "name",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "邮箱",
          key: "mailbox",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "手机号码",
          key: "mobile",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "申诉",
          key: "statement",
          placeholder: "",
          clickType: this.statement
        },
        {
          title: "我的发布",
          key: "release",
          placeholder: "",
          clickType: this.release
        },
        {
          title: "微信昵称",
          key: "nickname",
          placeholder: "",
          clickType: function() {}
        },
        {
          title: "所在公司",
          key: "company",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "公司地址",
          key: "companyAddress",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "所在职位",
          key: "jobTitle",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "主营产品",
          key: "mainProduct",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "品牌",
          key: "trademark",
          placeholder: "未填写 ",
          clickType: this.editType1
        },
        {
          title: "新手引导",
          placeholder: "",
          key: "guidance",
          clickType: function() {
            wx.navigateTo({
              url: "/pages/index/main?type=1"
            });
          }
        }
      ]
    };
  },
  computed: {
    parsonalData() {
      return store.state.parsonal;
    },
    baseUrl() {
      return store.state.baseUrl;
    },
    photoUrl() {
      if(store.state.parsonal.photo.indexOf('https://wx.qlogo.cn') < 0) {
        return this.baseUrl + store.state.parsonal.photo;
      }
      return store.state.parsonal.photo;
    }
  },
  watch: {
    parsonalData(val, oldvalue) {}
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
        url: "/pages/editparsonal/main?name=" + name + "&key=" + key
      });
    },
    // 选择头像
    chooseImage() {
      let self = this;
      wx.chooseImage({
        count: 1,
        success(res) {
          let tempFilePaths = res.tempFilePaths[0];
          // store.commit("editParsonal", { photo: tempFilePaths });
          wx.uploadFile({
            url: store.state.baseUrl + "/buyer/fileController/upload", //仅为示例，非真实的接口地址
            filePath: tempFilePaths,
            name: "file",
            header: { buyer_token: store.state.requestKey },
            formData: {
              resourceType: "image"
            },
            success:(res) => {
              const data = JSON.parse(res.data)
              store.commit("editParsonal", { photo: data.data });
            }
          });
        }
      });
    },
    // 申诉
    statement() {
      wx.navigateTo({
        url: "/pages/statement/main"
      });
    },
    // 我的发布
    release() {
      wx.navigateTo({
        url: "/pages/release/main"
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
  align-items: center;
}

.input > .title {
  flex: 1;
  color: #343434;
}

.input > image {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}

.mb20 {
  margin-bottom: 0.25rem;
}
</style>


