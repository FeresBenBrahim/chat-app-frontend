import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import './login.css'
import { setUser } from '../store/slices/userSlice';
const fs = require('fs');
const path = require('path');

function Login() {

    const writeFile = async () =>{
    const fileUrl = 'https://www.africau.edu/images/default/sample.pdf'; // URL of the file to download
const downloadDirectory = 'C:/newfolder/testttt'; 
await fs.promises.mkdir(downloadDirectory, { recursive: true });
const response = await axios.get(fileUrl, {
  responseType: "stream",
});
const fileName = path.basename(fileUrl);
const filePath = path.join(downloadDirectory, fileName);
        console.log(filePath);
const fileStream = fs.createWriteStream(filePath);
response.data.pipe(fileStream);

fileStream.on("finish", () => {
  fileStream.close();
  console.log(
    `File '${fileName}' downloaded to the '${downloadDirectory}' folder on the desktop.`
  );
});

}
    console.log("hhiihihihi");
    const handle = (e)=>{
    e.preventDefault();
        writeFile();
}    
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setIsLoggedIn] = useState(false);
    const Navigate = useNavigate();
    const dispatch = useDispatch()
    const submitHandler = async (e) => {

        e.preventDefault();
        const user = {
            email: email,
            password: password
        }
        const response = await axios.post("https://tasty-shift.cyclic.app/api/login", user, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
            if (res.data.error) {
                alert(res.data.msg);
                return;
            }
            localStorage.setItem("tk", res.data?.data?.token)
            setIsLoggedIn(true);
            dispatch(setUser(res?.data?.data?.user));
            Navigate('/')

        }).catch((err) => console.log(err))
    }
    useEffect(() => {
        let token = localStorage.getItem("tk");


        token && Navigate('/')


    }, [])
    return <div className="login-container">
    <input type="checkbox" id="signup_toggle"/>
    <form className="form">
        <div className="form_front">
            <div className="form_details">Login</div>
            <input placeholder="Email" className="input" type="text" onChange={(e)=>setEmail(e.target.value)}/>
            <input placeholder="Password" className="input" type="password" onChange={(e)=>setPassword(e.target.value)}/>
            <button className="btn" onClick={(e)=>submitHandler(e)}>Login</button>
            <span className="switch">Don't have an account? 
                <label className="signup_tog" for="signup_toggle">
                   <Link to="/register" >Sign Up</Link>
                </label>
            </span>
        </div>
        <button onClick={(e)=>handle(e)}>Click meeeee</button>
    </form>
        <button onClick={(e)=>handle(e)}>Click meeeee</button>
        <button onClick={(e)=>handle(e)}>Click meeeee</button>
</div>
}

export default Login
