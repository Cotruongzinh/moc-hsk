import { Link, Route, Routes } from 'react-router'

function TrangChu() {
  return (
    <main className="min-h-screen bg-[#F6F4EE] px-6 py-16 text-[#243B34]">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#20634F]">
          Kiểm tra Tailwind CSS
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Mộc HSK
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-[#52635D]">
          React Router và Tailwind CSS đang cùng hoạt động trong dự án học
          tiếng Trung.
        </p>

        <Link
          to="/kiem-tra-router"
          className="mt-8 inline-flex rounded-xl bg-[#20634F] px-5 py-3 font-semibold text-white transition hover:bg-[#184D3E]"
        >
          Sang trang kiểm tra Router
        </Link>

        <section className="mt-12 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
          <p className="text-sm text-[#66736E]">
            Nếu bạn thấy nền giấy sáng, chữ xanh đậm và nút xanh ngọc thì
            Tailwind đã hoạt động.
          </p>
        </section>
      </div>
    </main>
  )
}

function KiemTraRouter() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F4EE] px-6 text-[#243B34]">
      <div className="w-full max-w-xl rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-8 text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-[#E6EEE5] text-xl font-bold text-[#20634F]">
          ✓
        </div>

        <h1 className="text-3xl font-bold">
          React Router hoạt động
        </h1>

        <p className="mt-3 text-[#66736E]">
          URL này đang được React Router quản lý và giao diện đang được
          Tailwind CSS tạo kiểu.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex rounded-xl border border-[#20634F] px-5 py-3 font-semibold text-[#20634F] transition hover:bg-[#E6EEE5]"
        >
          Quay về trang chủ
        </Link>
      </div>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<TrangChu />} />
      <Route
        path="/kiem-tra-router"
        element={<KiemTraRouter />}
      />
    </Routes>
  )
}

export default App


