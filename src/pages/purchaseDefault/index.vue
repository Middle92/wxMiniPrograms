<template>
    <div class="container" :style="{overflow: (visibilityPop || VerificationPop) ? 'hidden' : 'initial'}">
        <div class="form-group">
            <label for="">产品</label>
            <div class="flex-1">
                <input type="text" v-model="product" :maxlength="productLength" placeholder="产品名称、规格或型号">
                <span class="holder-right">{{productLengthValue}}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="">数量</label>
            <input class="flex-1" type="digit" v-model="productNumber" placeholder="请输入采购数量">
        </div>

        <div class="form-group">
            <label for="">单位</label>
            <div class="flex-1">
                <picker :value="unitValue" :range="unit" @change="bindPickerChange">
                    <div class="picker" :class="{placeholder: !unitValue}">
                    {{unitValue ? unitValue : '请选择'}}
                    </div>
                    <div v-if="!unitValue" class="holder-right">></div>
                </picker>
            </div>
        </div>

        <div class="form-group">
            <label for="">采购截至时间</label>
            <div class="flex-1">
                <picker mode="date" :value="deadline" @change="bindDateChange">
                    <div class="picker" :class="{placeholder: !deadline}">
                    {{deadline ? deadline : '请选择'}}
                    </div>
                    <div v-if="!deadline" class="holder-right">></div>
                </picker>
            </div>
        </div>

        <div class="form-group">
            <label for="">价格</label>
            <input class="flex-1" type="digit" v-model="productPrice" placeholder="请填写供应商查看时需付的价格">
        </div>

        <div class="recorder-group">
            <div class="recorder">
                <div class="recorder-icons">
                    <div class="recorder-icon">
                        <img mode="widthFix" :src="stopIcon" alt="" style="width:28px;" @click="stopRecorder">
                    </div>

                    <div class="recorder-icon">
                        <img mode="widthFix" :src="startIcon" alt="" style="width:28px;" @click="startRecorder">
                    </div>
                    
                    <div class="recorder-icon">
                        <img mode="widthFix" :src="playIcon" alt="" style="width:28px;" @click="playRecorder">
                    </div>
                </div>
                <p v-if="!recorder">{{recorderStatus}}</p>
                <div v-else>
                    <div class="recorder-box">
                        {{recorder.duration/1000}}
                    </div>
                </div>
            </div>
        </div>

        <div class="supplement" v-show="supplement">
            <div class="supplement-cont">
                <p class="title">请输入补充说明</p>
                <textarea :maxlength="supplementarySpecificationLength" v-model="supplementarySpecification" cols="30" rows="6"></textarea>
                <span class="holder-right">{{supplementarySpecificationLengthValue}}</span>
            </div>
            
            <div class="choose-image">
                <div v-for="(item, index) in chooseImageArr" :key="index" class="choose-item">
                    <img mode="widthFix" :src="item" alt="">
                </div>
                <div class="add-btn" @click="chooseImage">
                    <img mode="widthFix" src="/static/icon-9.png" alt="" style="width:30px;">
                    <p>添加图片</p>
                </div>
            </div>
        </div>

        <p class="supplement-btn" @click="supplementFun">
            补充说明
            <img 
                mode="widthFix" 
                src="/static/icon-10.png" 
                alt="" 
                style="width:10px;"
                :style="!supplement && 'transform:rotate(180deg)'">
        </p>

        <div class='submit-btns'>
            <button class='primary' :disabled="!company" @click="submit">确认并提交</button>
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
import store from "../../stores";
import releasePopComponent from "../../components/releasePop";
import releaseVerificationComponent from "../../components/releaseVerifications";
import wxRequest from "@/utils/request";

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
      // 产品单位
      unit: ["px", "rpx", "rem", "..."],
      // 产品单位值
      unitValue: null,
      // 截止时间
      deadline: null,
      // 产品价格
      productPrice: null,
      // 录音图标
      startIcon: "/static/icon-17.png",
      playIcon: "/static/icon-21.png",
      stopIcon: "/static/icon-19.png",
      // 录音时间
      recorderTime: 90,
      // 显示录音按钮
      // showIcon: true,
      // 录音状态
      recorderStatus: "添加90秒语音描述",
      // 录音文件
      recorder: null,
      // 展开补充说明
      supplement: false,
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
      VerificationPop: false
    };
  },
  methods: {
    // 音频开始录音
    startRecorder() {
      const options = {
        duration: 90000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: "aac",
        frameSize: 50
      };
      recorderManager.start(options);
    },
    // 结束录音
    stopRecorder() {
      recorderManager.stop();
    },
    // 播放音频事件
    playRecorder() {
      this.startIcon = "/static/icon-17.png";
      this.stopIcon = "/static/icon-19.png";
      this.playIcon = "/static/icon-22.png";
      innerAudioContext.src = this.recorder.tempFilePath;
      innerAudioContext.play();
    },
    // 补充说明事件
    supplementFun() {
      this.supplement = !this.supplement;
    },
    // 点击企业信息
    companyFun() {
      let { company, companyAddress, jobTitle, mainProduct, trademark } = this.parsonalData;

      if (company && companyAddress && jobTitle && mainProduct && trademark) {
        this.company = !this.company;
      } else {
        this.visibilityPop = true;
      }
    },
    // 单位change事件
    bindPickerChange(e) {
      let index = e.mp.detail.value;
      this.unitValue = this.unit[index];
    },
    // 截止事件change事件
    bindDateChange(e) {
      this.deadline = e.mp.detail.value;
    },
    // 选择图片
    chooseImage() {
      let self = this;
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
      let obj = {
        product: this.product, // 产品名称
        number: this.productNumber, // 数量
        unit: this.unitValue, // 单位
        buyDeadline: this.deadline, // 采购截止时间（yyyy-MM-dd HH:mm:ss）
        price: this.productPrice, // 价格
        audioFile: 'http://hao.haolingsheng.com/ring/000/995/fdd1115ac2c3e1dc84ea878082741e1b.mp3', // this.recorder, // 语音文件路劲
        explained: this.supplementarySpecification, // 补充说明
        imgs: this.chooseImageArr.join(',') // 图片路径
      }
      let returnName = (str) => {
        switch(str) {
          case 'product':
            return '产品';
            break;
          case 'number':
            return '数量';
            break;
          case 'unit':
            return '单位';
            break;
          case 'buyDeadline':
            return '采购截至时间';
            break;
          case 'price':
            return '价格';
            break;
          case 'audioFile':
            return '语音';
            break;
          case 'explained':
            return '请输入补充说明';
            break;
          case 'imgs':
            return '添加图片';
            break;
        }
      }
      for(let key in obj) {
        if(!obj[key]) {
          wx.showToast({
            icon: 'none',
            title: `${returnName(key)}不能未空！`,
          })
          return false;
        }
      }

      wxRequest({
        url: "/PurchaseController/publish",
        method: 'POST',
        data: obj
      }, true).then((response) => {
        console.log(response);
        this.VerificationPop = true;
      })
      // let { mobile } = this.parsonalData;

      // if (mobile) {
        // 已填写联系方式
        // wx.navigateTo({
          // url: "/pages/success/main"
        // });
      // } else {
        // 没有填写联系方式
        
      // }
    }
  },
  mounted(options) {
    let timer;
    // 开始录音
    recorderManager.onStart(() => {
      console.log("开始录音");
      this.startIcon = "/static/icon-18.png";
      this.stopIcon = "/static/icon-19.png";
      this.playIcon = "/static/icon-21.png";
      this.recorder = null;
      this.recorderStatus = "录音中..." + this.recorderTime;
      clearInterval(timer);
      timer = setInterval(() => {
        this.recorderStatus = "录音中..." + (this.recorderTime -= 1);
      }, 1000);
    });
    // recorderManager.onPause((res) => {
    //     console.log('暂停录音', res)
    //     this.recorder = res;
    //     this.startIcon = '/static/icon-17.png';
    //     this.recorderStatus = '暂停录音';
    // })
    // recorderManager.onResume(() => {
    //     console.log('继续录音')
    //     this.startIcon = '/static/icon-18.png';
    //     this.recorderStatus = '录音中';
    // })
    // 停止录音
    recorderManager.onStop(res => {
      console.log("停止录音", res);
      this.recorder = res;
      this.startIcon = "/static/icon-17.png";
      this.stopIcon = "/static/icon-20.png";
      this.playIcon = "/static/icon-21.png";
      clearInterval(timer);
      this.recorderTime = 90;
    });
    // recorderManager.onFrameRecorded((res) => {
    //     const { frameBuffer } = res
    //     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    // })
    // 监听音频停止事件
    innerAudioContext.onStop(() => {
      console.log("监听音频停止事件");
      this.startIcon = "/static/icon-17.png";
      this.stopIcon = "/static/icon-19.png";
      this.playIcon = "/static/icon-21.png";
    });
    // 监听音频自然播放至结束的事件
    innerAudioContext.onEnded(() => {
      console.log("监听音频自然播放至结束的事件");
      this.startIcon = "/static/icon-17.png";
      this.stopIcon = "/static/icon-19.png";
      this.playIcon = "/static/icon-21.png";
    });
  },
  watch: {
    product(value, oldValue) {
      if(value) {
        this.productLengthValue = this.productLength - value.length;
      }
    },
    supplementarySpecification(value, oldValue) {
      if(value) {
        this.supplementarySpecificationLengthValue = this.supplementarySpecificationLength - value.length;
      }
    }
  },
  computed: {
    parsonalData() {
      return store.state.parsonal;
    }
  },
  components: {
    releasePopComponent,
    releaseVerificationComponent
  },
  onLoad(options) {
    // console.log('page index onLoad', options, this);
    if(options.init) {
      Object.assign(this.$data, this.$options.data())
    }
  },
};
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

.recorder-icons {
  display: flex;
}

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
</style>

