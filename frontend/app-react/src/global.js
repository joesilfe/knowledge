import { erro } from './config/msgs'

export const userKey = "__knowledge_user"
export const baseApiUrl = 'http://localhost:3000'

export function showError(e){
    if(e && e.response && e.response.data){
        erro(e.response.data)
        console.log(e.response.data)
    }else if (typeof e === 'string'){
        erro(e)
    } else {
        erro()
    }
}

export default { baseApiUrl, showError, userKey }