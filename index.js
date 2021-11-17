function reduxBuilder() {
  createReduxFolder();
  createUtilsFolder();
  createActionFolder();
  createReducersFolder();
  createStoreFile();
  createActionFile();
  createReducers();
  createRootReducer();
}

function createReduxFolder() {
  var fs = require("fs");
  fs.mkdir("./redux", () => {
    console.log("Redux Root created");
  });
}

function createActionFolder() {
  var fs = require("fs");
  fs.mkdir("./redux/actions", () => {
    console.log("Action created");
  });
}

function createReducersFolder() {
  var fs = require("fs");
  fs.mkdir("./redux/reducers", () => {
    console.log("Reducer created");
  });
}

function createUtilsFolder() {
  var fs = require("fs");
  fs.mkdir("./utils", () => {
    console.log("Util created");
  });
}

function createStoreFile() {
  var fs = require("fs");
  fs.appendFile(
    "./redux/store.js",
    `import { createStore, applyMiddleware } from "redux";
  import { composeWithDevTools } from "redux-devtools-extension";
  import thunk from "redux-thunk";
  import rootReducer from "./reducers";
  import { setUserAuthToken } from "../utils/AuthToken";
  
  const initialState = {};
  const middleware = [thunk];
  
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  
  let currentState = store.getState();
  
  store.subscribe(() => {
    let previousState = currentState;
    currentState = store.getState();
    if (previousState.user.userAuthToken !== currentState.user.userAuthToken) {
      const userAuthToken = currentState.user.userAuthToken;
      setUserAuthToken(userAuthToken);
    }
  });
  
  export default store;
  `,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}

function createActionFile() {
  var fs = require("fs");
  fs.appendFile(
    "./redux/actions/action.js",
    `import axios from "axios";
    export const userRegister =
      (data) =>
      async (dispatch) => {
        try {
          const res = await axios.post("/user/signup", data);
          dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: res.data,
          });
        } catch (err) {
          let errors = "Network error";
          if (err.response) {
            errors = err.response.data.errors[0].msg;
          }
          dispatch({
            type: USER_REGISTER_FAIL,
            payload: errors,
          });
        }
      };  
  `,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}

function createReducers() {
  var fs = require("fs");
  fs.appendFile(
    "./redux/reducers/reducer.js",
    `const initialState = {
      userAuthToken: localStorage.getItem("usertoken"),
      isAuthenticated: false,
      user: null,
      errors: null,
      signupStatus: null,
    };
    
    function userAuthReducer(state = initialState, action) {
      const { type, payload } = action;
      switch (type) {
        case USER_REGISTER_SUCCESS:
          return {
            ...state,
            userAuthToken: null,
            isAuthenticated: false,
            user: null,
            signupStatus: payload.success[0].msg,
          };
        case USER_REGISTER_FAIL: {
          return {
            ...state,
            userAuthToken: null,
            isAuthenticated: false,
            user: null,
            signupStatus: null,
            errors: payload,
          };
        }
        default:
          return state;
      }
    }
    export default userAuthReducer;
    
  `,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}

function createRootReducer() {
  var fs = require("fs");
  fs.appendFile(
    "./redux/reducers/index.js",
    `import { combineReducers } from "redux";
    import userReducer from "./user";
    export default combineReducers({ userReducer});
  `,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
}
module.exports = reduxBuilder;
