import React  from "react";
import {  Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {  Link,useNavigate } from "react-router-dom";
import { baseUrl } from "../../Api/Api";
import { BsEnvelopeFill,BsKeyFill,BsFillPersonFill,BsKey } from "react-icons/bs";
import'./Register.css';
const iconSize = "2em";
const iconMarginLeft = "10px";
const iconMarginRight = "10px";

function Register() {
    const history = useNavigate()
    const signupform = async (e)=>{
        e.preventDefault();

        const data ={
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
            password2: e.target.password2.value,
        };
        
        if (data.password!==data.password2){
             Swal.fire({
                title: 'Error',
                text: 'Password do not match!',
                icon: 'error',
              });

            return;
        }
        if (data.password.length<8){
            Swal.fire({
                title: 'Error',
                text: 'Password should have at least 8 digits!',
                icon: 'error',
              });
            return;
        }
        try {
            const response = await fetch(`${baseUrl}register/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username': data.username,
                    'email': data.email,
                    'password': data.password,
                    'password2': data.password,
                })
            });
        
            if (response.status === 400) {
                Swal.fire({
                    title: 'Error',
                    text: 'Registration failed. Please check your inputs!',
                    icon: 'error',
                });
            } else if (response.status === 200) {
                Swal.fire({
                    title: 'success',
                    text: 'Sign Up successfully!',
                    icon: 'success',
                });
                
                 history('/login');
            }else if (response.status === 404) {
                response.json()
                    .then(data => {
                        Swal.fire({
                            title: 'Error',
                            text: data.text,
                            icon: 'error', 
                        });
                    })
                    .catch(error => {
                        console.error('Error parsing JSON:', error);
                    });
            }
            
             else {
                Swal.fire({
                    title: 'Error',
                    text: 'Something went wrong. Please try again later.',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.log("Registration error:", error);
            Swal.fire({
                title: 'Error',
                // text: 'An error occurred. Please try again later.',
                text:error,
                icon: 'error',
            });
        }
        
    }

  return (
    <div className="containera">
        <div className="header">
            <div className="text">Sign Up</div>
            <div className="underline"></div>
        </div>
        <Form onSubmit={(e) => signupform(e)}>

            <div className="inputs">

            
                <div className="input">
                <BsFillPersonFill style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>

                    <input type="text" placeholder="Username" name="username" required/>
                </div> 

                <div className="input">
                <BsEnvelopeFill style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>

                    <input type="email" placeholder="Email" name="email" required/>
                </div> 

                <div className="input">
                <BsKey style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>

                    <input type="password" placeholder="Password" name="password" required/>
                </div>  

                <div className="input">
                <BsKeyFill style={{ fontSize: iconSize,marginLeft: iconMarginLeft,marginRight: iconMarginRight, }}/>

                    <input type="password" placeholder="Confirm password" name="password2" required/>
                </div>  

            </div>

            <div className="submit-containar">
                <button className="submit" type="submit" >Sign Up</button>
            </div>

        </Form>
        <p className="text-center text-muted ">Already have an account? <br /> <Link to={"/login"}> <u className="fw-bold text-body" >Login here</u></Link></p>

    </div>
  )
}

export default Register
