import jwtDecode from "jwt-decode";
import { getLocal } from "./Auth";
import Login from "../Components/Login/Login";
import Admin from "../Components/Admin/Admin";
import Home from "../Components/Home/Home";
export function CrossChecks() {
    let response =getLocal()
    
   
    if (response) {
        const decode_data =jwtDecode(response)
        
        if (decode_data.is_admin) {
            return <Admin/>
        }
        else{
            return<Home/>
        }

    }
    else{
        return <Login/>
    }
    
}