import { Link, Route, Routes } from 'react-router'

import { Button, buttonVariants } from '@/components/ui/button'

function TrangChu() {
  return (
    <main className="min-h-screen bg-[#F6F4EE] px-6 py-16 text-[#243B34]">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#20634F]">
          Kiểm tra shadcn/ui
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Mộc HSK
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-[#52635D]">
          React Router, Tailwind CSS và shadcn/ui đang cùng hoạt động
          trong dự án học tiếng Trung.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/kiem-tra-router"
            className={buttonVariants({ size: 'lg' })}
          >
            Sang trang kiểm tra Router
          </Link>

          <Button
            type="button"
            variant="outline"
            size="lg"
          >
            shadcn/ui hoạt động
          </Button>
        </div>

        <section className="mt-12 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
          <p className="text-sm text-[#66736E]">
            Component Button hiện tại được sinh trực tiếp bởi shadcn/ui
            với preset Maia và Base UI.
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
          Routing, Tailwind CSS và shadcn/ui đều đã được tích hợp.
        </p>

        <Link
          to="/"
          className={buttonVariants({
            variant: 'outline',
            size: 'lg',
            className: 'mt-7',
          })}
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
