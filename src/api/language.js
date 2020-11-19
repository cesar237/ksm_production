import API from './config'

export const list = () => {
    return API.get('languages/')
}