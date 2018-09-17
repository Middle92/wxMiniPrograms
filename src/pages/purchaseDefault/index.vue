<template>
    <div class="container">
        <div class="form-group">
            <label for="">产品</label>
            <div class="flex-1">
                <input type="text" v-model="product" placeholder="产品名称、规格或型号">
                <span class="holder-right">30</span>
            </div>
        </div>

        <div class="form-group">
            <label for="">数量</label>
            <input class="flex-1" type="digit" v-model="productNumber" placeholder="请输入采购数量">
        </div>

        <div class="form-group">
            <label for="">单位</label>
            <div class="flex-1">
                <!-- <div class="select">
                    请选择
                    <span class="holder-right">></span>
                </div> -->
                <picker :value="companyValue" :range="company" @change="bindPickerChange">
                    <div class="picker" :class="{placeholder: !companyValue}">
                    {{companyValue ? companyValue : '请选择'}}
                    </div>
                    <div v-if="!companyValue" class="holder-right">></div>
                </picker>
            </div>
        </div>

        <div class="form-group">
            <label for="">采购截至时间</label>
            <div class="flex-1">
                <!-- <div class="select">
                    请选择
                    <span class="holder-right">></span>
                </div> -->
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
            <!-- <div v-if="recorder" class="recorderFile" @click="playAudio">{{recorder}}</div>  @touchend="touchend" -->
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
                    {{JSON.stringify(recorderStatus)}}
                </div>
                <!-- <div class="recorder-icons" :class="{hide: !showIcon}">
                    <div class="recorder-icon" v-for="(item, index) in recorderIcons" :key="index" @click="item.callback">
                        <img mode="widthFix" :src="item.icon" alt="" style="width:30px;">
                    </div>
                </div> -->
            </div>
        </div>

        <div class="supplement" v-show="supplement">
            <div class="supplement-cont">
                <p class="title">请输入补充说明</p>
                <textarea name="" id="" cols="30" rows="6"></textarea>
                <span class="holder-right">200</span>
            </div>
            
            <div class="choose-image">
                <div class="add-btn">
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
            <button class='primary'>确认并提交</button>
        </div>

        <p class="company-info" @click="companyFun">
            <img 
                mode="widthFix" 
                :src="!company ? '/static/icon-11.png' : '/static/icon-12.png'" 
                alt="" 
                style="width:15px;"> 
            展开企业信息
        </p>
    </div>
</template>

<script>
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
// let timer = null
export default {
    data() {
        return {
            // 录音文件
            recorder: null,
            // 展开补充说明
            supplement: false,
            // 企业信息
            company: false,
            // 产品
            product: null,
            // 产品数量
            productNumber: null,
            // 产品价格
            productPrice: null,
            // 产品单位
            company: ['px', 'rpx', 'rem', '...'],
            companyValue: null,
            // 截止时间
            deadline: null,
            // 录音图标
            startIcon: '/static/icon-17.png',
            playIcon: '/static/icon-21.png',
            stopIcon: '/static/icon-19.png',
            // 录音时间
            recorderTime: 90,
            // 录音按钮s
            // recorderIcons: [
                // {
                //     title: '停止',
                //     icon: '/static/icon-19.png',
                //     callback: () => {
                //         this.stopRecorder();
                //     }
                // }, 
                // {
                //     title: '暂停',
                //     icon: '/static/icon-20.png',
                //     callback() {
                //         recorderManager.pause()
                //     }
                // }, 
                // {
                //     title: '播放',
                //     icon: '/static/icon-21.png',
                //     callback: () => {
                //         console.log(this.recorder)
                //         if(this.recorder) {
                //             console.log(2)
                //             innerAudioContext.src = this.recorder.tempFilePath;
                //             innerAudioContext.play();
                //         }
                //     }
                // }, 
            // ],
            // 显示录音按钮
            showIcon: true,
            // 录音状态
            recorderStatus: '添加90秒语音描述'
        }
    },
    methods: {
        // 音频开始录音
        startRecorder() {
            const options = {
                duration: 90000,
                sampleRate: 44100,
                numberOfChannels: 1,
                encodeBitRate: 192000,
                format: 'aac',
                frameSize: 50
            }
            recorderManager.start(options);
        },
        // 结束录音
        stopRecorder() {
            recorderManager.stop()
        },
        // 播放音频事件
        playRecorder() {
            this.startIcon = '/static/icon-17.png';
            this.stopIcon= '/static/icon-19.png';
            this.playIcon = '/static/icon-22.png';
            innerAudioContext.src = this.recorder.tempFilePath;
            innerAudioContext.play();
        },
        // 补充说明事件
        supplementFun() {
            this.supplement = !this.supplement;
        },
        // 点击企业信息
        companyFun() {
            this.company = !this.company;
        },
        // 单位change事件
        bindPickerChange(e) {
            let index = e.mp.detail.value
            this.companyValue = this.company[index];
        },
        // 截止事件change事件
        bindDateChange(e) {
            this.deadline = e.mp.detail.value;
        }
    },
    mounted() {
        recorderManager.onStart(() => {
            console.log('开始录音')
            this.startIcon = '/static/icon-18.png';
            this.stopIcon= '/static/icon-19.png';
            this.playIcon = '/static/icon-21.png';
            this.recorderStatus = '录音中...';
        })
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
        recorderManager.onStop((res) => {
            console.log('停止录音', res);
            this.recorder = res;
            this.startIcon = '/static/icon-17.png';
            this.stopIcon= '/static/icon-20.png';
            this.playIcon = '/static/icon-21.png';
        })
        // recorderManager.onFrameRecorded((res) => {
        //     const { frameBuffer } = res
        //     console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        // })
        innerAudioContext.onStop(() => {
            console.log('监听音频停止事件');
            this.startIcon = '/static/icon-17.png';
            this.stopIcon= '/static/icon-19.png';
            this.playIcon = '/static/icon-21.png';
        })
        innerAudioContext.onEnded(() => {
            console.log('监听音频自然播放至结束的事件');
            this.startIcon = '/static/icon-17.png';
            this.stopIcon= '/static/icon-19.png';
            this.playIcon = '/static/icon-21.png';
        })
    }
}

</script>

<style scoped>
.container {
    background-color: #f5f5f5;
    padding-top: 10px;
    display:inherit;
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

.flex-1 .holder-right, .flex-1 .select {
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
    margin: auto
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

.supplement-cont .title{
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

.choose-image .add-btn {
    font-size: 14px;
    width: 100px;
    height: 100px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #bbbbbb;
    background-color: #f0f0f0;
    border-radius: 6px;
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
</style>

