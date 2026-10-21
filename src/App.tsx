import { useQuery } from '@tanstack/react-query'
import { Link, Route, Routes } from 'react-router'

import { KiemTraZod } from '@/components/demo/kiem-tra-zod'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  type AudioSpeed,
  useLearningPreferencesStore,
} from '@/stores/learning-preferences-store'

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

const audioSpeeds = [0.75, 1, 1.25] as const

function CaiDatHocThu() {
  const showPronunciation = useLearningPreferencesStore(
    (state) => state.showPronunciation,
  )

  const autoPlayAudio = useLearningPreferencesStore(
    (state) => state.autoPlayAudio,
  )

  const audioSpeed = useLearningPreferencesStore(
    (state) => state.audioSpeed,
  )

  const togglePronunciation = useLearningPreferencesStore(
    (state) => state.togglePronunciation,
  )

  const toggleAutoPlay = useLearningPreferencesStore(
    (state) => state.toggleAutoPlay,
  )

  const setAudioSpeed = useLearningPreferencesStore(
    (state) => state.setAudioSpeed,
  )

  return (
    <section className="mt-8 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
        Kiểm tra Zustand
      </p>

      <div className="mt-5 rounded-2xl bg-[#F6F4EE] p-6 text-center">
        <p className="text-5xl font-semibold">
          你好
        </p>

        {showPronunciation && (
          <p className="mt-3 text-[#20634F]">
            nǐ hǎo
          </p>
        )}

        <p className="mt-2 text-[#52635D]">
          Xin chào
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div>
          <p className="mb-2 text-sm font-medium">
            Phiên âm
          </p>

          <Button
            type="button"
            variant={showPronunciation ? 'default' : 'outline'}
            onClick={togglePronunciation}
          >
            {showPronunciation ? 'Đang hiện' : 'Đang ẩn'}
          </Button>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">
            Tự động phát âm
          </p>

          <Button
            type="button"
            variant={autoPlayAudio ? 'default' : 'outline'}
            onClick={toggleAutoPlay}
          >
            {autoPlayAudio ? 'Đang bật' : 'Đang tắt'}
          </Button>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">
            Tốc độ đọc
          </p>

          <div className="flex flex-wrap gap-2">
            {audioSpeeds.map((speed: AudioSpeed) => (
              <Button
                key={speed}
                type="button"
                variant={audioSpeed === speed ? 'default' : 'outline'}
                onClick={() => setAudioSpeed(speed)}
              >
                {speed}x
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
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
          Kiểm tra Zustand
        </p>

        <h1 className="text-5xl font-bold tracking-tight">
          Mộc HSK
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-8 text-[#52635D]">
          TanStack Query quản lý dữ liệu từ máy chủ, còn Zustand
          quản lý trạng thái giao diện trên máy người học.
        </p>

        <section className="mt-10 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
            Dữ liệu bài học — TanStack Query
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

        <CaiDatHocThu />

        <KiemTraZod />
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
          Toàn bộ stack nền vẫn hoạt động bình thường.
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

