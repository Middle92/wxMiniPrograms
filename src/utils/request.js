import store from '../stores';

let baseUrl;
if(process.env.NODE_ENV === 'development') {
    process.env.type === 'test' && (baseUrl = 'http://192.168.0.81:80/bcsj-miniapp/buyer')
    process.env.type === 'dev' && (baseUrl = 'http://192.168.0.151:8082/bcsj-miniapp/buyer')
} else {
    baseUrl = 'http://192.168.0.151:8082/bcsj-miniapp/buyer/buyerController'
}


function wxRequest(obj, hasToken, duration = 3000) {
    return new Promise((resolve, rejects) => {
        const requestTask = wx.request({
            url: baseUrl + obj.url,
            method: obj.method || 'GET',
            data: obj.data,
            header: obj.header && hasToken ? Object.assign({'buyer_token': store.state.requestKey}, obj.header) : hasToken ? {'buyer_token': store.state.requestKey} : obj.header,
            complete(response) {
                if(response.data && response.data.code == "200") {
                    resolve(response.data)
                } else {
                    rejects(response)
                }
            }
        })

        setTimeout(() => {
            requestTask.abort()
        }, duration)
    })
}

export default wxRequest