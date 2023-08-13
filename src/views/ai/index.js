import { queryGetChatWsUrl } from "@/services/gpt"
import { TTSRecorder } from "@/utils/gpt"
import { useEffect, useState } from "react"
import { Button, Input } from 'antd'
import MessageItem from "./components/MessageItem"
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const { TextArea } = Input
let bigModel = null
export default function Ai() {

  const [wsUrl, setWsUrl] = useState('')
  // const [bigModel, setBigModel] = useState({})
  const [inquiryContent, setInquiryContent] = useState('')
  const [reponseTexts, setReponseTexts] = useState('')

  useEffect(() => {
    async function getWsUrl() {
      const res = await queryGetChatWsUrl()
      console.log('res', res)
      setWsUrl(res.data)
    }

    getWsUrl()
  }, [])

  useEffect(() => {
    console.log('wsUrl 改变', wsUrl)
    initWs(wsUrl)
  }, [wsUrl])

  const initWs = (url) => {
    if (url) {
      console.log('initWs')
      let model = new TTSRecorder({
        url,
        onMessage: onMessage,
        onClose: onClose
      })
      bigModel = model
      bigModel.start()
    }
  }

  // 查询内容change
  const inquiryContentChange = (e) => {
    const text = e.target.value
    setInquiryContent(text)
  }

  const sendInquiryContent = () => {
    const readyState = bigModel.readyState();
    console.log('readyState', readyState)
    bigModel.webSocketSend(inquiryContent)
  }

  function onMessage(messgae) {
    let jsonData = JSON.parse(messgae)
    console.log('jsonData', jsonData)
    const curReponseText = getPayloadText(jsonData)
    setReponseTexts(prevText => prevText + curReponseText)
    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
      console.error(`${jsonData.header.code}:${jsonData.header.message}`)
      return
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      bigModel.setStatus("init")
    }
  }

  function onClose(e) {
    console.log('closed', e)
  }

  function getPayloadText(jsonData) {
    const { payload } = jsonData
    const text = payload?.choices?.text

    const textStr = text.map(item => {
      return item.content
    }).join('')
    console.log('textStr', textStr)
    return textStr
  }

  return (
    <div className="main-layout">
      <div className="response_wrapper">
        <MessageItem reponseTexts={reponseTexts} />
      </div>

      <div className="chat-input">
        <TextArea rows={3} onChange={inquiryContentChange} />
        <Button type="primary" onClick={sendInquiryContent}>发送</Button>
      </div>
    </div >
  )
}


