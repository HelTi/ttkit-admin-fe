const isDev = process.env.NODE_ENV === 'development'

const ApiUrl = {
    ManApiUrl: isDev ? 'http://localhost:8080' : 'http://api.zhuhuilong.com',
    StaticUrl: 'http://cdn.zhuhuilong.com',
}


export default ApiUrl
