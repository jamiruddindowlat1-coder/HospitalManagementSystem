import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";


export default function AppointmentChart({ data = [] }) {


  return (

    <div
      style={{
        width: "100%",
        height: 350,
        marginTop: "30px"
      }}
    >

      <h3>
        📅 Appointment Status
      </h3>


      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >

            {
              data.map((entry,index)=>(
                <Cell
                  key={index}
                />
              ))
            }

          </Pie>


          <Tooltip />

          <Legend />

        </PieChart>


      </ResponsiveContainer>


    </div>

  );

}