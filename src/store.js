import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './store/user';
import cart from './store/cart';


let stock = createSlice({
    name : 'stock',
    initialState : [10, 11, 12]
})

//state를 사용할 수 있게 export 시킴
export default configureStore({
    reducer: { 
        user: user.reducer, //store에 js파일 따로 빼서 컴포넌트화 시켜서 불러옴
        stock: stock.reducer,
        cart: cart.reducer //store에 js파일 따로 빼서 컴포넌트화 시켜서 불러옴
    }
}) 