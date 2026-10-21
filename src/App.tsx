import { useQuery } from '@tanstack/react-query'
import { Link, Route, Routes } from 'react-router'

import { Button, buttonVariants } from '@/components/ui/button'

type BaiHocDemo = {
  capDo: string
  tenBai: string
  soTuMoi: number
}

async function layBaiHocDemo(): Promise<BaiHocDemo> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    capDo: 'HSK cấp 1',
    tenBai: 'Bài 1: Chào hỏi',
    soTuMoi: 10,
  }
}

function TrangChu() {
  const baiHocQuery = useQuery({
    queryKey: ['demo', 'bai-hoc', 1],
    queryFn: layBaiHocDemo,
  })

  return (
    <main className="min-h-screen bg-[#F6F4EE] px-6 py-16 text-[#243B34]">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#20634F]">
          Kiểm tra TanStack Query
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Mộc HSK
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-[#52635D]">
          React Router, Tailwind CSS, shadcn/ui và TanStack Query đang
          cùng hoạt động trong dự án.
        </p>

        <section className="mt-10 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
            Dữ liệu bài học
          </p>

          {baiHocQuery.isPending && (
            <p className="mt-4 text-[#66736E]">
              Đang tải dữ liệu bài học...
            </p>
          )}

          {baiHocQuery.isError && (
            <p className="mt-4 text-red-700">
              Không thể tải dữ liệu bài học.
            </p>
          )}

          {baiHocQuery.data && (
            <div className="mt-4">
              <p className="text-sm text-[#66736E]">
                {baiHocQuery.data.capDo}
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {baiHocQuery.data.tenBai}
              </h2>

              <p className="mt-2 text-[#52635D]">
                {baiHocQuery.data.soTuMoi} từ mới trong bài demo.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => baiHocQuery.refetch()}
              disabled={baiHocQuery.isFetching}
            >
              {baiHocQuery.isFetching
                ? 'Đang tải...'
                : 'Tải lại dữ liệu'}
            </Button>

            <Link
              to="/kiem-tra-router"
              className={buttonVariants()}
            >
              Kiểm tra Router
            </Link>
          </div>
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
          Routing và toàn bộ stack giao diện nền vẫn hoạt động.
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
