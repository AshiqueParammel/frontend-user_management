import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react'
import "./Login.css";
import {  Form } from 'react-bootstrap';
import { BsEnvelopeFill,BsKeyFill } from "react-icons/bs";
import { baseUrl } from '../../Api/Api';
import {getLocal} from '../../Helpers/Auth';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/UserSlice';
import Swal from 'sweetalert2';

const iconSize = "2em";
const iconMarginLeft = "10px";
const iconMarginRight = "10px";

function Login() {
    const history =useNavigate()
    const dispatch =useDispatch()
    const response = getLocal();
    
    
    
 
    useEffect(()=>{
        if (response){
            history('/');
        }
    },[response,history]);  

    const loginuser =async(e)=>{
        e.preventDefault();
        const response = await fetch(`${baseUrl}token/`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                email:e.target.email.value,
                password:e.target.password.value,
            }),
        });

        const data = await response.json();      
        try{
            const token =jwtDecode(data.access)
            const setuser={
                "user_id":token.user_id,
                "name":token.username,
                "email":token.email,
                "is_admin":token.is_admin
            }

            dispatch(setUserInfo({userinfo:setuser}))

        }catch (error){
            console.error('Error decoding JWT:',error);
        }

        if (response.status===200) {
            localStorage.setItem('authToken',JSON.stringify(data));
            history('/');

        }else if (response.status ===401){
            Swal.fire({
                title: 'Error',
                text: 'User credentials mismatch',
                icon: 'error',
              });
              history('/login');

        }
        else{
            Swal.fire({
                title: 'Error',
                text: 'Network error!',
                icon: 'error',
              });
              history('/login');


        }

    }


  return (
     <div className="containera">
        <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>
        </div>
        <Form onSubmit={(e) => loginuser(e)}>

            <div className="inputs">

                <div className="input">
                    
                    <BsEnvelopeFill style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>
                    

                    
                    <input type="email" placeholder="Email" name="email" required />
                </div> 

                <div className="input">
                    <BsKeyFill style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>
                    <input type="password" placeholder="Password" name="password" required/>
                </div>  

            </div>

            <div className="submit-containar">
                <button className="submit" type="submit" >Login</button>
            </div>

        </Form>
        <p className="text-center text-muted ">Don't yet registered? <br /><Link to={"/signup"}><u className="fw-bold text-body " >SignUp here</u></Link></p>

        

    </div>
  )
}

export default Login