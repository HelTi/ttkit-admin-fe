const isDev = process.env.NODE_ENV === 'development'

const ApiUrl = {
    ManApiUrl: isDev ? 'http://localhost:8080' : 'https://api.zhuhuilong.com',
    StaticUrl: isDev ? 'http://localhost:8082' : 'https://www.zhuhuilong.com',
}


export default ApiUrl
