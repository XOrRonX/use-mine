import React, { useEffect, createContext, useReducer , useContext} from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import "./DarkMode.scss";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/NewPassword";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from './components/screens/UserProfile';
import PaymentSuccess from './components/screens/PaymentSuccess';
import Terms from './components/screens/Terms';
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    } else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin')
      }
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      <Route path="/success">
        <PaymentSuccess />
      </Route>
      <Route path="/terms">
        <Terms />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Header />
        <Routing />
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
