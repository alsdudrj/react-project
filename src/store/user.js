import { createSlice } from "@reduxjs/toolkit";

let user = createSlice({
    name : 'user',
    initialState : { name : 'kim', age : 20 },
    reducers: {
        changeName(state, action){
            state.name = 'john kim';
            state.age += action.payload;
        }
    }
})
export let {changeName} = user.actions;
export default user;