import { createSlice } from "@reduxjs/toolkit";

/**
 * 장바구니 상태 관리를 위한 Slice
 * 상품의 추가, 삭제, 수량 변경 로직을 담당
 */
let cart = createSlice({
    name : 'cart',
    initialState : [],  //초기 상태: 빈 배열
    reducers : {
        //상품 수량을 증가시키는 함수
        addCount(state, action){
                //파라미터로 받은 값 id를 현재 state.id랑 비교
                let target = state.find(item => item.id === action.payload.id && item.size === action.payload.size); 
                 //id가 존재하면 count 1증가
                    target.count = action.payload.newCount;

        },
        //상품을 추가하는 함수
        addItem(state, action){
            //파라미터로 받은 값 중 id를 현재 state.id랑 비교 
            let target = state.find(item => item.id === action.payload.id && item.size === action.payload.size);  

            if(target){ //존재하는 상품이면 count 1증가
                target.count += 1;
            }else{      //없는 상품이면 상품 추가
                state.push(action.payload);
            }
        },
        //상품을 삭제하는 함수
        deleteItem(state, action){
            const {id, size} = action.payload;

            //해당 ID와 사이즈가 모두 일치하지 않는 아이템들만 남김
            return state.filter(item => !(item.id === id && item.size === size));
        },
        //상품 전체를 삭제하는 함수
        deleteAllItem(state, action){
            state.splice(0);
        }
    }
})
export let {addCount, addItem, deleteItem, deleteAllItem} = cart.actions; //state 변경함수 export
export default cart;