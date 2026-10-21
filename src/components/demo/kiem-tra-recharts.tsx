import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const duLieuTienDo = [
  { bai: 'Bài 1', tienDo: 100 },
  { bai: 'Bài 2', tienDo: 75 },
  { bai: 'Bài 3', tienDo: 50 },
  { bai: 'Bài 4', tienDo: 20 },
  { bai: 'Bài 5', tienDo: 0 },
]

export default function KiemTraRecharts() {
  return (
    <section className="mt-8 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
        Kiểm tra Recharts
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        Tiến độ học HSK cấp 1
      </h2>

      <p className="mt-2 text-[#52635D]">
        Biểu đồ mô phỏng tỷ lệ hoàn thành của năm bài học đầu tiên.
      </p>

      <div className="mt-6 h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={duLieuTienDo}
            margin={{
              top: 10,
              right: 10,
              bottom: 0,
              left: -15,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="bai"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [`${value}%`, 'Hoàn thành']}
            />

            <Bar
              dataKey="tienDo"
              name="Hoàn thành"
              fill="#20634F"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-sm text-[#52635D] sm:grid-cols-5">
        {duLieuTienDo.map((item) => (
          <div
            key={item.bai}
            className="rounded-xl bg-[#F6F4EE] px-3 py-2 text-center"
          >
            <p>{item.bai}</p>
            <p className="mt-1 font-semibold text-[#20634F]">
              {item.tienDo}%
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

