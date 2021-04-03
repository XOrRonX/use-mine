export const initialState = null


export const reducer = (state,action)=>{
    if(action.type==="USER"){
        return action.payload
    }
    if(action.type==="CLEAR"){
        return null
    }
    if(action.type==="UPDATE"){
        return {
            ...state,
            rating:action.payload.rating,
            myRating:action.payload.myRating
        }
    }
    if(action.type === "UPDATEPHOTO"){
        return {
            ...state,
            photo:action.payload
        }
    }
    return state
} 