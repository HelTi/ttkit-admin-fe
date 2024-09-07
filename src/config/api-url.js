const isDev = process.env.NODE_ENV === 'development'

const ApiUrl = {
    ManApiUrl: isDev ? 'http://localhost:3003' : 'https://api.ttkit.cn',
    StaticUrl: isDev ? 'http://localhost:3000' : 'https://www.ttkit.cn',
}


export default ApiUrl
