import { createSlice } from "@reduxjs/toolkit";

//cart 데이터
let cart = createSlice({
    name : 'cart',
    initialState : [],
    reducers : {
        //상품 수량을 증가시키는 함수
        addCount(state, action){
                let target = state.find(item => item.id === action.payload.id && item.size === action.payload.size); //파라미터로 받은 값(id)를 현재 state.id랑 비교
                 //id가 존재하면 count 1증가
                    target.count = action.payload.newCount;

        },
        //상품을 추가하는 함수
        addItem(state, action){
            let target = state.find(item => item.id === action.payload.id && item.size === action.payload.size);  //파라미터로 받은 값 중 id를 현재 state.id랑 비교 

            if(target){ //존재하는 상품이면 count 1증가
                target.count += 1;
            }else{      //없는 상품이면 상품 추가
                state.push(action.payload);
            }
        },
        //상품을 삭제하는 함수
        deleteItem(state, action){
            let target = state.find(item => item.id === action.payload && item.size === action.payload.size);

            state.forEach((item, i) => { //반복문을 통해 삭제버튼을 눌렀을때의 id값과 상품 id값을 비교
                if(item.id === target.id){
                    state.splice(i, 1); //해당하는 index에 있는 상품 1개 삭제
                }
            })
        },
        //상품 전체를 삭제하는 함수
        deleteAllItem(state, action){
            state.splice(0);
        }
    }
})
export let {addCount, addItem, deleteItem, deleteAllItem} = cart.actions; //state 변경함수 export
export default cart;