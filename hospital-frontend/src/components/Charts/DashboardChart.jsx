import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";


export default function DashboardChart({data}) {


  return (

    <div className="dashboard-chart">

      <h3>
        📊 Hospital Statistics
      </h3>


      <ResponsiveContainer
        width="100%"
        height={90}
      >

        <BarChart data={data}>

          <CartesianGrid 
            strokeDasharray="3 3"
          />


          <XAxis 
            dataKey="name"
          />


          <YAxis />


          <Tooltip />


          <Bar
            dataKey="value"
          />


        </BarChart>


      </ResponsiveContainer>


    </div>

  );

}
