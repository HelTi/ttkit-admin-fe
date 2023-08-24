import { queryGetChatWsUrl } from "@/services/gpt"
import { StatusMapConfig, TTSRecorder } from "@/utils/gpt"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button, Input } from 'antd'
import MessageItem from "./components/MessageItem"
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MainLayout from "@/components/main-layout/MainLayout"
import styles from './styles/ai.module.scss'
import { PlusCircleFilled, RedditOutlined, UserOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input
let bigModel = null
export default function Ai() {
  const [wsUrl, setWsUrl] = useState('')
  // const [bigModel, setBigModel] = useState({})
  const [inquiryContent, setInquiryContent] = useState('')
  const [status, setStatus] = useState('')
  const [tabList, setTabList] = useState([])
  const [curTab, setCurTab] = useState({}) // 当前展示的tab

  const [currentTabMessageItems, setCurrentTabMessageItems] = useState([])
  // 标记返回到信息是否持续插入最后一个messageItem
  const msgRef = useRef('')
  const responseWrapperRef = useRef(null)

  useEffect(() => {
    async function getWsUrl() {
      const res = await queryGetChatWsUrl()
      console.log('res', res)
      setWsUrl(res.data)
    }

    getWsUrl()
  }, [])

  // 初始化ws
  const initWs = useCallback((url) => {
    if (url) {
      console.log('initWs')
      let model = new TTSRecorder({
        url,
        onMessage: onMessage,
        onClose: onClose,
        onWillStatusChange: onWillStatusChange
      })
      bigModel = model
      bigModel.start()
    }
  }, [])

  // 监听
  useEffect(() => {
    console.log('wsUrl 改变', wsUrl)
    initWs(wsUrl)
  }, [wsUrl, initWs])



  // 查询内容change
  const inquiryContentChange = (e) => {
    const text = e.target.value
    setInquiryContent(text)
  }

  // 发送询问内容
  const sendInquiryContentHandle = () => {
    msgRef.current = ''
    startInquiry()
    // 上下文或者单条聊天模式
    const sessionContext = currentTabMessageItems.map(item => {
      return {
        content: item.content,
        role: item.role,
      }
    })
    sessionContext.push(
      {
        "role": "user",
        "content": inquiryContent
      }
    )
    console.log('sessionContext###',sessionContext)
    bigModel.webSocketSend(sessionContext)
  }

  // 开始
  const startInquiry = () => {
    // 开始发送内容，检查是否有tab标签,currentTabMessage是否为空
    console.log('curTab', curTab)
    if (!currentTabMessageItems.length) {
      // 创建新的tab会话
      const seeionId = uuidv4()
      const tab = {
        title: inquiryContent,
        id: seeionId
      }
      console.log('tab', tab)
      // 设置新的tab
      setCurTab(tab)
      setTabList([tab, ...tabList])
      setCurrentRoleMessage(inquiryContent)
    } else {
      setCurrentRoleMessage(inquiryContent)
    }
  }

  // 设置问答消息
  const setCurrentRoleMessage = useCallback((messageContent) => {
    // 要发送到内容
    console.log('curTab currentTabMessageItems', curTab, currentTabMessageItems)
    const userInquiryMessageItem = {
      content: messageContent,
      role: 'user',
      tabId: curTab.id // 用于归类tab
    }
    // ai回答 
    const assistantMessageItem = {
      content: '',
      role: "assistant",
      tabId: curTab.id // 用于归类tab
    }
    setCurrentTabMessageItems([...currentTabMessageItems, userInquiryMessageItem, assistantMessageItem])
  }, [curTab, currentTabMessageItems])



  // 发送消息，填充数据到messageItem
  function onMessage(messgae) {
    let jsonData = JSON.parse(messgae)
    console.log('jsonData', jsonData)
    const curReponseText = getPayloadText(jsonData)
    msgRef.current += curReponseText
    // 设置currentTabMessage
    setCurrentTabMessageItems((prev) => {
      const p = prev.slice(0, prev.length - 1)
      const assistantMessageItem = {
        content: msgRef.current,
        role: 'assistant',
        tabId: curTab.id // 用于归类tab
      }
      const messages = [...p, assistantMessageItem]
      console.log('messages---------', messages)
      return messages
    })

    if (jsonData.header.code !== 0) {
      alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
      console.error(`${jsonData.header.code}:${jsonData.header.message}`)
      return
    }
    if (jsonData.header.code === 0 && jsonData.header.status === 2) {
      // 返回结束
      // msgRef.current = ''
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

  function onWillStatusChange(status) {
    console.log('status', status)
    setStatus(status)
  }

  // 创建新对话
  const onAddNewSession = () => {
    // 清空页面会话信息
    setCurrentTabMessageItems([])
    setCurTab(null)

  }

  useEffect(() => {
    console.log('mmmmm', responseWrapperRef.current)
    const y = responseWrapperRef.current.scrollHeight - responseWrapperRef.current.clientHeight
    responseWrapperRef.current.scrollTop = y
  }, [currentTabMessageItems])


  return (
    <MainLayout left={
      <>
        <Button style={{ width: '100%' }} onClick={onAddNewSession} type="dashed" icon={<PlusCircleFilled />}>新建对话</Button>
        {/* 历史对话 */}
        <div className={styles.historyDialogueList}>
          {tabList.map(tab => <div className={styles.tabItem} key={tab.id}>{tab.title}</div>)}
        </div>

      </>

    }>
      <div className={styles.responseWrapper} ref={responseWrapperRef}>
        {currentTabMessageItems.map((message, index) => (
          <div key={index} className={styles.userWrapper}>
            <div className={styles.userIcon}>
              {message.role === 'user' ? <UserOutlined /> : <RedditOutlined />}
            </div>
            <div className={styles.inqueryText}>
              {message.role === 'user' ? message.content : <MessageItem reponseTexts={message.content} />}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.bottomFixed}>
        <div className={styles.chatInput}>
          <TextArea rows={3} onChange={inquiryContentChange} />
          <Button size="small" loading={status === StatusMapConfig.SENDING} className={styles.sendButton} disabled={status === StatusMapConfig.SENDING || status === StatusMapConfig.INIT || !inquiryContent} type="primary" onClick={sendInquiryContentHandle}>
            {
              status === StatusMapConfig.SENDING ? '发送中' : '发送'
            }
          </Button>
        </div>
      </div>

    </MainLayout>
  )
}


