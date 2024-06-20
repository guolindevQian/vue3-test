import request from './request'
export const login = (data: any) => {
    return request({
        url: 'api/v1/admin',
        data,
        isToken: false,
        method: 'POST'
    })
}
type dingCodeType = {
    client_id: string, 	// 应用程序的Client ID。你的应用程序的Web页面中展示在一个凭
    client_secret: string,
    auth_code: string, 	// 获取Access Token的回调代码。回调代码返回Access Token和Refresh Token以
}
export const dingCodeLogin = (data: dingCodeType) => {
    return request({
        url: `hxLogin/oauth/token?client_id=${data.client_id}&client_secret=${data.client_secret}&grant_type=ding_code&auth_code=${data.auth_code}`,
        isToken: false,
        method: 'POST'
    })
}
export const getImage = () => {
    return request({
        url: `api/upload/stream`,
        isToken: false,
        method: 'GET'
    })
}
