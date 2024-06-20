import { dingCodeLogin } from '@/http/api';

export function getUrlParams(): object {
    let str: string = window.location.search
    let params: any = {}
    if (str.indexOf('?') > -1) {
        let strArr: string[] = str.substr(1).split('&')    //  ['?key=val', 'key2=val2']  ->  ['key', 'val'] and ['key
        strArr.map(item => {
            params[item.split('=')[0]] = item.split('=')[1]  //  ['key', 'val']  ->  params.key = val  and  params
        })
    } else {
        params = null;
    }
    return params
}
type tokenObjType = {
    auth_code?: any,
    [key: string]: any
}
type dingCodeType = {
    client_id: string, 	// 应用程序的Client ID。你的应用程序的Web页面中展示在一个凭
    client_secret: string,
    auth_code: string, 	// 获取Access Token的回调代码。回调代码返回Access Token和Refresh Token以
}

export async function dingCodeLoginFunc(auth_code: tokenObjType) {
    let params: dingCodeType = {
        client_id: 'crm-web',
        client_secret: 'ppzTX1XkAVFO8O8lvmZv6BpUvNlKP2Ir',
        auth_code: auth_code.auth_code
    }
    console.log(params)
    const data = await dingCodeLogin(params);
    console.log(data);

}
export function getLogin() {
    let urlList = {
        client_id: 'crm-web',
        client_secret: 'ppzTX1XkAVFO8O8lvmZv6BpUvNlKP2Ir',
        url: `${window.location.origin}/`
        // url:process.env.NODE_ENV === 'production'?`${window.location.href}`:`${window.location.origin}/`
    }
    window.location.href = `http://idppc.hxtide.com/login?obj=${JSON.stringify(urlList)}`
}