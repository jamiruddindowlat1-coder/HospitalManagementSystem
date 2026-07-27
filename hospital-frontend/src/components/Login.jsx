import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { saveToken, saveRefreshToken } from "../services/auth";

import "./Login.css";


function Login({ onLogin }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();



  const handleSubmit = async(e)=>{

    e.preventDefault();

    setError("");
    setLoading(true);


    try{


      const response = await api.post("/Auth/login",{

        email,
        password

      });



      const data = response.data;



      console.log(
        "LOGIN RESPONSE:",
        data
      );


      // ROLE DEBUG

      console.log(
        "ROLE FROM API:",
        data.role
      );


      console.log(
        "ROLES FROM API:",
        data.roles
      );




      // TOKEN SAVE

      if(data.token){

        saveToken(data.token);

        localStorage.setItem(
          "token",
          data.token
        );

      }



      if(data.refreshToken){

        saveRefreshToken(
          data.refreshToken
        );

      }





      // ROLE GET

      let userRole =
        data.role ||
        data.roles?.[0] ||
        "User";



      userRole = userRole.trim();



      console.log(
        "FINAL ROLE:",
        userRole
      );



      localStorage.setItem(
        "role",
        userRole
      );



      localStorage.setItem(
        "userName",
        data.userName ||
        data.fullName ||
        data.email
      );



      localStorage.setItem(
        "email",
        data.email || email
      );




      if(onLogin){

        onLogin(data);

      }




      // =====================
      // ROLE REDIRECT
      // =====================


      switch(userRole.toLowerCase()){


        case "admin":

          navigate("/admin-dashboard");

          break;



        case "doctor":

          navigate("/doctor-dashboard");

          break;



        case "nurse":

          navigate("/nurse-dashboard");

          break;



        case "accountant":

          navigate("/account-dashboard");

          break;



        case "patient":

          navigate("/patient-dashboard");

          break;



        case "receptionist":

          navigate("/receptionist-dashboard");

          break;



        default:

          navigate("/");

          break;


      }



    }
    catch(err){


      console.log(
        "LOGIN ERROR:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Login Failed"
      );


    }
    finally{

      setLoading(false);

    }


  };




return(

<div className="login-wrapper">


<form
onSubmit={handleSubmit}
className="login-form"
>


<h2>
🏥 HMS Login
</h2>




<div className="form-group">

<label>
Email
</label>


<input

type="email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

placeholder="admin@hospital.local"

required

/>

</div>





<div className="form-group">

<label>
Password
</label>


<input

type="password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

placeholder="********"

required

/>

</div>




{
error &&

<p className="error">
{error}
</p>

}




<p className="forgot">

<Link to="/forgot-password">

Forgot Password?

</Link>

</p>





<div className="login-hint">

<p>
Admin:
<br/>
admin@hospital.local
<br/>
Admin123!
</p>



<p>
Doctor:
<br/>
sarah.khan@hospital.local
<br/>
Doctor123!
</p>


</div>




<button
type="submit"
disabled={loading}
>

{
loading
?
"Checking..."
:
"Login"
}

</button>



</form>


</div>

);


}


export default Login;