
export function getToken() {
  let TokenKey = 'Admin-Token'
let TokenData = 'Admin-Data'
let TokenMsg = 'Admin-Msg'
  let time = localStorage.getItem('loginTime') || '0'

  const nowTime = new Date().getTime();
  if((nowTime-60*60*1000)>time || time=='0'){
    removeToken()
  }
  localStorage.setItem('loginTime',new Date().getTime()+'')
  return localStorage.getItem(TokenKey) || null
}

export function setToken(token, data) {
  let TokenKey = 'Admin-Token'
let TokenData = 'Admin-Data'
let TokenMsg = 'Admin-Msg'
  localStorage.setItem('loginTime', new Date().getTime()+'');
  localStorage.setItem(TokenData, JSON.stringify(data));
  return localStorage.setItem(TokenKey, token)
}
export function setLoginToken(data) {
  let TokenKey = 'Admin-Token'
let TokenData = 'Admin-Data'
let TokenMsg = 'Admin-Msg'
  localStorage.setItem(TokenMsg, data);
}

export function removeToken() {
  let TokenKey = 'Admin-Token'
let TokenData = 'Admin-Data'
let TokenMsg = 'Admin-Msg'
  localStorage.setItem('loginTime', '');
  return localStorage.setItem(TokenKey,'')
}

export function getSession() {
  let TokenKey = 'Admin-Token'
let TokenData = 'Admin-Data'
let TokenMsg = 'Admin-Msg'
  const user = JSON.parse(localStorage.getItem(TokenKey));
  return user.id;
}
