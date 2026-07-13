import { useEffect, useState, useCallback } from "react";

import {
  FaCirclePlus,
  FaPen,
  FaTrash,
  FaHospital,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaClock
} from "react-icons/fa6";


import {
  getActivityLogs,
  getActivityLogEntities
} from "../services/dashboardService";

import "./ActivityLogPage.css";


function actionIcon(action) {

  if (action === "Created")
    return <FaCirclePlus className="log-icon created" />;

  if (action === "Updated")
    return <FaPen className="log-icon updated" />;

  if (action === "Deleted")
    return <FaTrash className="log-icon deleted" />;

  if (action === "Discharged")
    return <FaHospital className="log-icon discharged" />;

  return <FaCircleCheck className="log-icon" />;
}



function ActionBadge({ action }) {

  return (
    <span className={`badge badge-${action?.toLowerCase()}`}>
      {action}
    </span>
  );

}



export default function ActivityLogPage() {


  const [logs,setLogs] = useState([]);

  const [entities,setEntities] = useState([]);

  const [loading,setLoading] = useState(true);


  const [page,setPage] = useState(1);

  const [totalPages,setTotalPages] = useState(1);

  const [totalCount,setTotalCount] = useState(0);


  const [entity,setEntity] = useState("");

  const [action,setAction] = useState("");

  const [search,setSearch] = useState("");

  const [input,setInput] = useState("");



  const pageSize = 15;



  const loadData = useCallback(async()=>{


    try{


      setLoading(true);


      const result = await getActivityLogs({

        page,

        pageSize,

        entity,

        action,

        search

      });



      setLogs(result.items || []);

      setTotalPages(result.totalPages || 1);

      setTotalCount(result.totalCount || 0);


    }
    catch(error){

      console.log(error);

      setLogs([]);

    }
    finally{

      setLoading(false);

    }


  },[
    page,
    entity,
    action,
    search
  ]);






  useEffect(()=>{


    getActivityLogEntities()

    .then(res=>setEntities(res || []))

    .catch(()=>setEntities([]));


  },[]);





  useEffect(()=>{

    loadData();

  },[loadData]);







  const searchHandler=(e)=>{

    e.preventDefault();

    setPage(1);

    setSearch(input);

  };







  const clearAll=()=>{

    setEntity("");

    setAction("");

    setSearch("");

    setInput("");

    setPage(1);

  };








return (

<div className="activity-log-page">


<h2 className="activity-log-title">

<FaClock />

 Activity Log

</h2>




<div className="activity-log-toolbar">


<form onSubmit={searchHandler}>


<FaMagnifyingGlass />


<input

value={input}

onChange={
e=>setInput(e.target.value)
}

placeholder="Search..."

/>


</form>





<select

value={entity}

onChange={
e=>{
setPage(1);
setEntity(e.target.value);
}
}

>

<option value="">

All Modules

</option>


{
entities.map((x,i)=>(

<option key={i} value={x}>

{x}

</option>

))
}


</select>





<select

value={action}

onChange={
e=>{
setPage(1);
setAction(e.target.value);
}
}

>


<option value="">

All Actions

</option>


<option value="Created">

Created

</option>


<option value="Updated">

Updated

</option>


<option value="Deleted">

Deleted

</option>


<option value="Discharged">

Discharged

</option>


</select>





<button onClick={clearAll}>

Clear

</button>


</div>





<h4>

{totalCount} Records Found

</h4>






{
loading ?

<p>Loading...</p>


:

logs.length===0 ?

<p>No activity found</p>


:


logs.map((log,index)=>(


<div

className="activity-log-row"

key={index}

>


{actionIcon(log.action)}



<div>


<ActionBadge action={log.action}/>


<h4>

{log.entity}

</h4>


<p>

{log.description}

</p>


<small>

{log.userName || "System"}

&nbsp; | &nbsp;

{
new Date(
log.createdAt
).toLocaleString()
}

</small>


</div>


</div>


))


}







{
totalPages > 1 &&

<div className="activity-log-pagination">


<button

disabled={page===1}

onClick={()=>
setPage(page-1)
}

>

Previous

</button>




<span>

Page {page} / {totalPages}

</span>




<button

disabled={page===totalPages}

onClick={()=>
setPage(page+1)
}

>

Next

</button>


</div>

}



</div>


);


}