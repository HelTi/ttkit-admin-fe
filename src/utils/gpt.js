export const StatusMapConfig = {
  INIT: 'init', // 初始化
  OPENED: 'opened', // 已连接
  SENDING: 'sending',  // 发送中
  DONE: 'done',  // 接受消息完毕
  ERROR: 'error', // 出错
  CLOSED: 'closed' // 关闭
}

export class TTSRecorder {
  constructor({
    url = '',
    appId = '90d1acca',
    onMessage = null,
    onClose = null,
    onWillStatusChange = null
  } = {}) {
    this.appId = appId
    this.url = url
    this.status = 'init'
    this.onMessage = onMessage
    this.onClose = onClose
    this.ttsWS = null
    this.sendCacheText = ''
    this.onWillStatusChange = onWillStatusChange
  }

  // 修改状态
  setStatus(status) {
    this.status = status
    this.onWillStatusChange && this.onWillStatusChange(status)
  }

  // 连接websocket
  connectWebSocket() {
    this.setStatus(StatusMapConfig.INIT)
    const url = this.url
    let ttsWS
    ttsWS = new WebSocket(url)

    this.ttsWS = ttsWS
    ttsWS.onopen = e => {
      console.log('socket open', e)
      this.setStatus(StatusMapConfig.OPENED)
      if (this.sendCacheText) {
        this.webSocketSend(this.sendCacheText)
      }
    }
    ttsWS.onmessage = e => {
      this.result(e.data)
    }
    ttsWS.onerror = e => {
      this.setStatus(StatusMapConfig.ERROR)
      alert('WebSocket报错，请f12查看详情')
      console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`)
    }
    ttsWS.onclose = e => {
      console.log('socket 关闭')
      this.setStatus(StatusMapConfig.CLOSED)
      if (this.onClose) {
        this.onClose(e)
      }
    }
  }


  // websocket发送数据
  webSocketSend(text) {
    const isArray = Array.isArray(text)
    const textMsg = isArray ? text : [
      {
        "role": "user",
        "content": text
      }
    ]
    var params = {
      "header": {
        "app_id": this.appId,
        "uid": "fd3f47e4-d"
      },
      "parameter": {
        "chat": {
          "domain": "general",
          "temperature": 0.5,
          "max_tokens": 1024
        }
      },
      "payload": {
        "message": {
          "text": textMsg
        }
      }
    }
    console.log(JSON.stringify(params))
    const readyState = this.ttsWS.readyState
    if (readyState === 1) {
      this.setStatus(StatusMapConfig.SENDING)
      this.ttsWS.send(JSON.stringify(params))
      // 清空发送的消息
      this.sendCacheText = ''
    } else {
      // 保存此次发送的消息，等连接成功再次发送
      this.sendCacheText = text
    }
    // 已关闭的情况
    if (readyState === 3) {
      this.connectWebSocket()
    }

  }

  readyState() {
    // 连接状态
    return this.ttsWS.readyState
  }

  start() {
    console.log('start')
    this.connectWebSocket()
  }

  // websocket接收数据的处理
  result(resultData) {
    console.log('resultData', resultData)
    if (this.onMessage) {
      this.onMessage(resultData)
    }
  }
}
