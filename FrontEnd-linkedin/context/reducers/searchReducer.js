const initialState = {
    search : ""
}

const searchReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case "SEARCH":
            return {
                ...state,
                search: action.payload,
            };
        default:
            return state;
    }
}

export default searchReducer;