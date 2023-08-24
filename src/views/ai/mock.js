
const mockData = [
  {
    title: '你是谁',
    id: '1',
    messageItems: [
      {
        // payload:{
        //   message:{
        //     text:[
        //       {"role": "user", "content": "你是谁"}, 
        //       {"role": "assistant", "content": "....."},
        //       {"role": "user", "content": "你会做什么"}
        //   ]
        //   }
        // },
        content: '你是谁',
        role: 'user',
      },
      {
        role: 'assistant',
        content: '```javascriptfunction bubbleSort(arr) {  let len = arr.length;  for (let i = 0; i < len - 1; i++) {    for (let j = 0; j < len - 1 - i; j++) {      if (arr[j] > arr[j + 1]) {        let temp = arr[j];        arr[j] = arr[j + 1];        arr[j + 1] = temp;      }    }  }  return arr;}```', // 一次对话后的内容拼接
      }
    ]
  },
  {
    title: '使用js实现冒泡排序',
    id: '2',
    messageItems: [
      {
        content: '使用js实现冒泡排序',
        role: 'user',
      },
      {
        role: 'assistant',
        content: '```javascriptfunction bubbleSort(arr) {  let len = arr.length;  for (let i = 0; i < len - 1; i++) {    for (let j = 0; j < len - 1 - i; j++) {      if (arr[j] > arr[j + 1]) {        let temp = arr[j];        arr[j] = arr[j + 1];        arr[j + 1] = temp;      }    }  }  return arr;}```', // 一次对话后的内容拼接
      }
    ]
  }
]