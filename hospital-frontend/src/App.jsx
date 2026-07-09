import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";


import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import DoctorList from "./components/DoctorList";
import AppointmentList from "./components/AppointmentList";
import BillingList from "./components/BillingList";
import AdmissionList from "./components/AdmissionList";
import MedicalRecordList from "./components/MedicalRecordList";
import Medicine from "./components/Medicine";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";


import {
  isAuthenticated,
  removeToken
} from "./services/auth";


import "./App.css";



function App(){


const [loggedIn,setLoggedIn]=
useState(isAuthenticated());



const handleLogout=()=>{

removeToken();

setLoggedIn(false);

};



return(

<Router>


<div className="App">



<header className="app-header">

<h1>
🏥 Hospital Management System
</h1>

<p>
International-ready healthcare admin portal
</p>


{
loggedIn &&

<button
onClick={handleLogout}
>
লগআউট
</button>

}


</header>





{
loggedIn &&

<nav className="navbar">


<Link to="/">
ড্যাশবোর্ড
</Link>


<Link to="/patients">
রোগী
</Link>


<Link to="/doctors">
ডাক্তার
</Link>


<Link to="/appointments">
অ্যাপয়েন্টমেন্ট
</Link>


<Link to="/admissions">
ভর্তি
</Link>


<Link to="/medical-records">
মেডিকেল রেকর্ড
</Link>


<Link to="/billing">
বিলিং
</Link>


<Link to="/medicines">
💊 মেডিসিন
</Link>


</nav>

}





<main>


<Routes>



<Route

path="/login"

element={

loggedIn

?

<Navigate to="/" />

:

<Login onLogin={()=>setLoggedIn(true)}/>

}

/>




<Route

path="/"

element={

<ProtectedRoute>

<Dashboard/>

</ProtectedRoute>

}

/>



<Route
path="/patients"
element={
<ProtectedRoute>
<PatientList/>
</ProtectedRoute>
}
/>



<Route
path="/patients/:id"
element={
<ProtectedRoute>
<PatientDetails/>
</ProtectedRoute>
}
/>



<Route
path="/doctors"
element={
<ProtectedRoute>
<DoctorList/>
</ProtectedRoute>
}
/>



<Route
path="/appointments"
element={
<ProtectedRoute>
<AppointmentList/>
</ProtectedRoute>
}
/>



<Route
path="/admissions"
element={
<ProtectedRoute>
<AdmissionList/>
</ProtectedRoute>
}
/>



<Route
path="/medical-records"
element={
<ProtectedRoute>
<MedicalRecordList/>
</ProtectedRoute>
}
/>



<Route
path="/billing"
element={
<ProtectedRoute>
<BillingList/>
</ProtectedRoute>
}
/>



<Route
path="/medicines"
element={
<ProtectedRoute>
<Medicine/>
</ProtectedRoute>
}
/>



<Route
path="*"
element={
<Navigate to="/" />
}
/>



</Routes>


</main>




<footer>

© 2026 Hospital Management System

</footer>


</div>


</Router>


);


}


export default App;