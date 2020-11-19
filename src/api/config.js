import axios from 'axios'

export default axios.create({
    baseURL: `https://wiconet.herokuapp.com/product-api/`,
    headers: {
        'Authorization': 'Token d008d5428c8cac7388db192fcfbc92862bd794b5',
    }
})
