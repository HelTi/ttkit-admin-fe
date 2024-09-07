const isDev = process.env.NODE_ENV === 'development'

const ApiUrl = {
    ManApiUrl: isDev ? 'http://localhost:3003' : 'https://api.zhuhuilong.com',
    StaticUrl: isDev ? 'http://localhost:3000' : 'https://www.zhuhuilong.com',
}


export default ApiUrl
