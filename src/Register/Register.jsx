import React, { useEffect, useState } from 'react'
import './register.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
function Register() {
  const [firstName, setName] = useState("");
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [Cpassword, setCpassword] = useState("")
  const Navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.post("https://tasty-shift.cyclic.app/api/register", { firstName, lastName, email, password, Cpassword }, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
      if (res.data.error) {
        alert(res.data.msg);
        return;
      }
      localStorage.setItem("tk", res.data?.data?.token);
      Navigate('/')
    }).catch((err) => console.log(err))
  }

  useEffect(() => {
    let token = localStorage.getItem("tk");
    token && Navigate('/')
  }, [])
  return (
    <div className='login-container'>
      <div className="form_back">
        <div className="form_details">SignUp</div>
        <input placeholder="Firstname" className="input" type="text" onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Lastname" className="input" type="text" onChange={(e)=>setLastName(e.target.value)} />
        <input placeholder="email" className="input" type="text" onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" className="input" type="password" onChange={(e)=>setPassword(e.target.value)} />
        <input placeholder="Confirm Password" className="input" type="password" onChange={(e)=>setCpassword(e.target.value)} />
        <button className="btn" onClick={(e)=>submitHandler(e)}>Signup</button>
        <span className="switch">Already have an account?
          <label className="signup_tog" for="signup_toggle">
            <Link to="/login"> Sign In</Link>
          </label>
        </span>
      </div>
    </div>
  )
}

export default Register