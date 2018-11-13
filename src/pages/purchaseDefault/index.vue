<template>
    <div class="container" :style="{overflow: (visibilityPop || VerificationPop) ? 'hidden' : 'initial', opacity: isOpacity ? 1 : 0 }">
        <div class="form-group">
            <label for="">产品</label>
            <div class="flex-1">
                <input type="text" v-model="product" :maxlength="productLength" placeholder="产品名称、规格或型号">
                <span class="holder-right">{{productLengthValue}}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="">数量</label>
            <input class="flex-1" type="number" v-model="productNumber" placeholder="请输入采购数量">
        </div>

        <div class="form-group">
            <label for="">单位</label>
            <input class="flex-1" v-model="unitValue" placeholder="请输入单位">
        </div>

        <div class="form-group">
            <label for="">采购截至时间</label>
            <div class="flex-1">
                <picker mode="date" :value="deadline" :start="startDate" @change="bindDateChange">
                    <div class="picker" :class="{placeholder: !deadline}">
                    {{deadline ? deadline : '请选择'}}
                    </div>
                    <div v-if="!deadline" class="holder-right">></div>
                </picker>
            </div>
        </div>

        <div class="form-group">
            <label for="">信息价格(元)</label>
            <input class="flex-1" type="digit" v-model="productPrice" placeholder="请填写供应商查看时需付的信息价格" @blur="productPriceInput">
        </div>

        <div class="recorder-group">
            <div class="recorder">
                <div class="recorder-icons">
                    <i class="iconfont icon-icon_voice_b" :class="{'voice-start': voiceStatuc}" @click="voiceClick"></i>
                </div>
                <p v-if="!recorder">{{recorderStatus}}</p>
                <div v-else>
                    <div class="recorder-box">
                        {{recorderDurationText}}s
                    </div>
                </div>
            </div>
        </div>

        <div class="supplement">
            <div class="supplement-cont">
                <p class="title">请输入补充说明</p>
                <textarea :maxlength="supplementarySpecificationLength" v-model="supplementarySpecification" cols="30" rows="6"></textarea>
                <span class="holder-right">{{supplementarySpecificationLengthValue}}</span>
            </div>
            
            <div class="choose-image">
                <div v-for="(item, index) in chooseImageArr" :key="index" class="choose-item" :data-index="index" @click="previewImage">
                    <img mode="widthFix" :src="item" alt="">
                </div>
                <div class="add-btn" @click="chooseImage">
                    <img mode="widthFix" src="/static/icon-9.png" alt="" style="width:30px;">
                    <p>添加图片</p>
                </div>
            </div>
        </div>

        <div class='submit-btns'>
            <button class='primary' @click="submit" :disabled="!company">确认并提交</button>
        </div>

        <p class="company-info" @click="companyFun">
            <img 
                mode="widthFix" 
                :src="!company ? '/static/icon-11.png' : '/static/icon-12.png'" 
                alt="" 
                style="width:15px;"> 
            展开企业信息
        </p>
        
        <releasePopComponent :visibility="visibilityPop" @visibility="visibilityPopFun"></releasePopComponent>

        <releaseVerificationComponent :visibility="VerificationPop" @visibility="VerificationPopFun"></releaseVerificationComponent>
    </div>
</template>

<script>
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
import store from "@/stores";
import utils from "@/utils";
import wxRequest from "@/utils/request";
import releasePopComponent from "@/components/releasePop";
import releaseVerificationComponent from "@/components/releaseVerifications";

export default {
  data() {
    return {
      // 产品
      product: null,
      // 产品字符长度
      productLength: 30,
      // 展示产品字符长度
      productLengthValue: 30,
      // 产品数量
      productNumber: null,
      // 产品单位值
      unitValue: null,
      // 截止时间
      deadline: null,
      // 产品价格
      productPrice: null,
      // 录音图标状态
      voiceStatuc: false,
      // 录音时间
      recorderTime: 90,
      // 录音状态
      recorderStatus: "添加90秒语音描述",
      // 录音文件
      recorder: null,
      // 录音时间
      recorderDuration: null,
      recorderDurationText: null,
      // 补充说明
      supplementarySpecification: null,
      // 补充说明字符串长度
      supplementarySpecificationLength: 200,
      // 展示补充说明字符串长度
      supplementarySpecificationLengthValue: 200,
      // 图片数组
      chooseImageArr: [],
      // 企业信息
      company: false,
      // 弹窗展示
      visibilityPop: false,
      // 验证弹窗
      VerificationPop: false,
      // 加载完成展示
      isOpacity: false
    };
  },
  methods: {
    // 点击录音
    voiceClick() {
      this.voiceStatuc = !this.voiceStatuc;
      if(this.voiceStatuc) {
        const options = {
          duration: 90000,
          sampleRate: 44100,
          numberOfChannels: 1,
          encodeBitRate: 192000,
          format: "aac",
          frameSize: 50
        };
        recorderManager.start(options);
        
        recorderManager.onStart(() => {
          console.log("开始录音");
          this.recorder = null;
          this.recorderStatus = "录音中..."
        })
      } else {
        recorderManager.stop();

        recorderManager.onStop(res => {
          console.log("停止录音", res);
          this.recorder = res.tempFilePath;
          this.recorderDuration = res.duration;
          this.recorderDurationText = Math.ceil(res.duration/1000);
        })
      }
    },
    // 播放音频事件
    playRecorder() {
      if (this.recorder) {
        // this.startIcon = "/static/icon-17.png";
        // this.stopIcon = "/static/icon-19.png";
        // this.playIcon = "/static/icon-22.png";
        innerAudioContext.src = this.recorder;
        innerAudioContext.play();
      }
    },
    // 点击企业信息
    companyFun() {
      let {
        company,
        companyAddress,
        jobTitle,
        mainProduct,
        trademark
      } = this.parsonalData;

      if (company && companyAddress && jobTitle && mainProduct && trademark) {
        this.company = !this.company;
      } else {
        this.visibilityPop = true;
      }
    },
    // 截止事件change事件
    bindDateChange(e) {
      this.deadline = e.mp.detail.value;
    },
    // 选择图片
    chooseImage() {
      let self = this;
      // 选择图片
      wx.chooseImage({
        success(res) {
          self.chooseImageArr = res.tempFilePaths;
        }
      });
    },
    // 弹窗回调
    visibilityPopFun(options) {
      this.visibilityPop = options;
    },
    VerificationPopFun(options) {
      this.VerificationPop = options;
    },
    // 提交
    submit() {
      let returnName = str => {
        switch (str) {
          case "product":
            return "产品";
            break;
          case "number":
            return "数量";
            break;
          case "unit":
            return "单位";
            break;
          case "buyDeadline":
            return "采购截至时间";
            break;
          case "price":
            return "信息价格";
            break;
          case "audioFile" || "duration":
            return "语音";
            break;
          case "explained":
            return "请输入补充说明";
            break;
          case "imgs":
            return "添加图片";
            break;
        }
      };
      let obj = {
        product: this.product, // 产品名称
        number: this.productNumber, // 数量
        unit: this.unitValue, // 单位
        buyDeadline: this.deadline, // 采购截止时间（yyyy-MM-dd HH:mm:ss）
        price: this.productPrice, // 价格
        audioFile: this.recorder, // 语音文件路劲
        duration: this.recorderDuration, // 语音时间
        explained: this.supplementarySpecification, // 补充说明
        imgs: this.chooseImageArr // 图片路径
        // company:     this.company //是否展示企业信息
      };

      for (let key in obj) {
        if (!obj[key] && key != "imgs") {
          wx.showToast({
            mask: true,
            icon: "none",
            title: `${returnName(key)}不能未空！`
          });
          return false;
        }
        if (typeof obj[key] == "string" && isEmojiCharacter(obj[key])) {
          wx.showToast({
            mask: true,
            icon: "none",
            title: `${returnName(key)}不能存在表情！`
          });
          return false;
        }
        if (key == "number") {
          let r = /^[0-9]*[1-9][0-9]*$/; //正整数
          if (!r.test(obj[key])) {
            wx.showToast({
              title: "数量为正整数",
              icon: "none",
              mask: true
            });
            return false;
          }
        }
        if (key == "buyDeadline") {
          if (
            new Date(
              new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate()
            ).getTime() > new Date(obj[key]).getTime()
          ) {
            wx.showToast({
              title: "采购截至时间大于当前时间",
              icon: "none",
              mask: true
            });
            return false;
          }
        }
      }

      let { mobile } = this.parsonalData;
      if (!mobile) {
        // 没有填写联系方式
        this.VerificationPop = true;
        return false;
      }

      wx.showLoading({
        title: "提交中...",
        mask: true
      });

      new Promise((resolve, reject) => {
        let arr = [];
        if (this.chooseImageArr.length == 0) {
          obj.imgs = arr.join(",");
          resolve();
        } else {
          this.chooseImageArr.forEach(item => {
            wx.uploadFile({
              url: store.state.baseUrl + "/buyer/fileController/upload", //仅为示例，非真实的接口地址
              filePath: item,
              name: "file",
              header: { buyer_token: store.state.requestKey },
              formData: {
                resourceType: "image"
              },
              success: res => {
                const data = JSON.parse(res.data);
                arr.push(data.data);
                if (arr.length == this.chooseImageArr.length) {
                  obj.imgs = arr.join(",");
                  resolve();
                }
              }
            });
          });
        }
      })
        .then(res => {
          return new Promise((resolve, reject) => {
            wx.uploadFile({
              url: store.state.baseUrl + "/buyer/fileController/upload", //仅为示例，非真实的接口地址
              filePath: this.recorder,
              name: "file",
              header: { buyer_token: store.state.requestKey },
              formData: {
                resourceType: "voice"
              },
              success(response) {
                let data = JSON.parse(response.data);
                obj.audioFile = data.data;
                resolve();
              },
              fail(response) {
                wx.showToast({
                  title: JSON.stringify(response),
                  icon: "none",
                  mask: true
                });
              }
            });
          });
        })
        .then(res => {
          wxRequest(
            {
              url: "/PurchaseController/publish",
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              data: obj
            },
            true
          )
          .then(response => {
            let id = response.data.id;
            wx.navigateTo({
              url: `/pages/success/main?id=${id}&status=1`
            });
          })
          .catch(response => {
            wx.showToast({
              title: response.data.message,
              icon: "none",
              mask: true
            });
          });
          wx.hideLoading();
        })
        .catch(res => {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            mask: true
          });
        });
    },
    // 预览图片
    previewImage(e) {
      let index = e.currentTarget.dataset.index;
      this.chooseImageArr;
      wx.previewImage({
        urls: this.chooseImageArr,
        current: this.chooseImageArr[index]
      });
    },
    // 价格保留一位数
    productPriceInput(event) {
      this.productPrice = utils.fixed(Number(event.target.value), 1)
    }
  },
  beforeMount() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
  },
  mounted(options) {
    // 监听音频停止事件
    // innerAudioContext.onStop(() => {
    //   console.log("监听音频停止事件");
    // });
    // 监听音频自然播放至结束的事件
    // innerAudioContext.onEnded(() => {
    //   console.log("监听音频自然播放至结束的事件");
    // });

    setTimeout(() => {
      this.isOpacity = true;
      wx.hideLoading();
    }, 300)
    
  },
  watch: {
    // 产品字符长度变化
    product(value, oldValue) {
      if (value) {
        this.productLengthValue = this.productLength - value.length;
      }
    },
    // 补充说明字符长度变化
    supplementarySpecification(value, oldValue) {
      if (value) {
        this.supplementarySpecificationLengthValue =
          this.supplementarySpecificationLength - value.length;
      }
    }
  },
  computed: {
    // 个人信息
    parsonalData() {
      return store.state.parsonal;
    },
    // 路劲
    baseUrl() {
      return store.state.baseUrl;
    },
    // 最少开始时间
    startDate() {
      let date = new Date(Date.now());
      let Year = date.getFullYear();
      let Month =
        date.getMonth() + 1 < 10
          ? "0" + date.getMonth() + 1
          : date.getMonth() + 1;
      let Day = date.getDate() + 1;
      return Year + "-" + Month + "-" + Day;
    }
  },
  components: {
    releasePopComponent,
    releaseVerificationComponent
  },
  onLoad(options) {
    if (!options.init) {
      Object.assign(this.$data, this.$options.data());
    }
  },
  onUnload() {
    recorderManager.stop();
  }
};

// 表情包排除
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2b05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (
        hs == 0xa9 ||
        hs == 0xae ||
        hs == 0x303d ||
        hs == 0x3030 ||
        hs == 0x2b55 ||
        hs == 0x2b1c ||
        hs == 0x2b1b ||
        hs == 0x2b50
      ) {
        return true;
      }
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  padding-top: 10px;
  display: inherit;
}
.form-group {
  width: 100%;
  display: flex;
  font-size: 16px;
  background-color: #ffffff;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
}

.form-group input {
  line-height: 50px;
  height: 50px;
}

.form-group label {
  width: 100px;
}

.flex-1 {
  flex: 1;
  position: relative;
  padding: 0 20px 0 10px;
  font-size: 14px;
}

.flex-1 .holder-right {
  position: absolute;
  top: 0;
  right: 0;
}

.flex-1 .holder-right,
.flex-1 .select {
  color: #808080;
}

.recorder-group {
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 10px;
}

.recorder {
  width: 100%;
  white-space: nowrap;
  text-align: center;
  font-size: 16px;
  padding: 30px 0;
  background-color: #f0f0f0;
  margin: auto;
}

.recorder p {
  color: #888888;
  margin: 10px 0;
}

.supplement-cont {
  width: 100%;
  padding: 10px 40px 10px 10px;
  box-sizing: border-box;
  position: relative;
  /* margin-bottom: 10px; */
  background-color: #ffffff;
}

.supplement-cont .title {
  color: #bbbbbb;
  font-size: 14px;
  margin-bottom: 10px;
}
.supplement-cont textarea {
  font-size: 14px;
  width: 100%;
  height: 100px;
  border: 1px solid #ddd;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
}

.supplement-cont .holder-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
  color: #888888;
}

.choose-image {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
}

.choose-image .choose-item {
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #dddddd;
  display: inline-block;
  margin: 0 10px 10px 0;
}

.choose-image .choose-item img {
  width: 100%;
}

.choose-image .add-btn {
  font-size: 14px;
  width: 100px;
  height: 100px;
  color: #bbbbbb;
  background-color: #f0f0f0;
  border-radius: 6px;
  display: inline-block;
  text-align: center;
  vertical-align: top;
  margin: 0 10px 10px 0;
  padding-top: 22px;
  box-sizing: border-box;
}

.supplement-btn {
  color: #888888;
  font-size: 14px;
  text-align: center;
  padding: 30px 0;
  background: #f5f5f5;
}

.submit-btns {
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
}

.company-info {
  color: #888888;
  font-size: 14px;
  text-align: center;
  padding-bottom: 20px;
  background: #f5f5f5;
}

.company-info img {
  vertical-align: middle;
}

.recorderFile {
  padding: 10px;
  background-color: cornflowerblue;
}

.picker {
  height: 50px;
}

.placeholder {
  color: #888888;
}

/* .recorder-icons {
  display: flex;
} */

.recorder-icons.hide {
  display: none;
}

.recorder-icon {
  flex: 1;
}

.recorder-box {
  margin-top: 10px;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  background-color: #1aac19;
  text-align: left;
  height: 40px;
  line-height: 40px;
  color: #fff;
  padding: 0 10px;
}

.icon-icon_voice_b {
  font-size: 36px;
  color: #888888;
  
}

.voice-start {
  animation: voice 1.5s;
  animation-iteration-count: infinite;
}

@keyframes voice{
  0% {
    color: #2ac94f;
  }
  50% {
    color: #888888;
  }
  100% {
    color: #2ac94f;
  }
}
</style>

