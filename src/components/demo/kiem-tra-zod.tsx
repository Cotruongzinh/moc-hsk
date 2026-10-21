import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { baiHocSchema } from '@/schemas/bai-hoc-schema'

const duLieuDung: unknown = {
  id: 'hsk1-bai-1',
  capDo: 'HSK cấp 1',
  soBai: 1,
  tenBai: 'Chào hỏi',
  soTuMoi: 10,
  daXuatBan: true,
}

const duLieuSai: unknown = {
  id: '',
  capDo: 'HSK cấp 1',
  soBai: 'một',
  tenBai: 123,
  soTuMoi: -10,
  daXuatBan: 'có',
}

type KetQuaKiemTra = {
  hopLe: boolean
  noiDung: string
}

export function KiemTraZod() {
  const [ketQua, setKetQua] = useState<KetQuaKiemTra | null>(null)

  function kiemTra(data: unknown) {
    const result = baiHocSchema.safeParse(data)

    if (result.success) {
      setKetQua({
        hopLe: true,
        noiDung: `${result.data.capDo} — Bài ${result.data.soBai}: ${result.data.tenBai}`,
      })

      return
    }

    const cacLoi = result.error.issues
      .map((issue) => {
        const truong = issue.path.join('.') || 'dữ liệu'
        return `${truong}: ${issue.message}`
      })
      .join(' | ')

    setKetQua({
      hopLe: false,
      noiDung: cacLoi,
    })
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
        Kiểm tra Zod
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        Xác thực dữ liệu bài học
      </h2>

      <p className="mt-2 text-[#52635D]">
        Thử gửi một bộ dữ liệu đúng và một bộ dữ liệu sai qua cùng một schema.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => kiemTra(duLieuDung)}
        >
          Kiểm tra dữ liệu đúng
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => kiemTra(duLieuSai)}
        >
          Kiểm tra dữ liệu sai
        </Button>
      </div>

      {ketQua && (
        <div
          className={`mt-5 rounded-xl border p-4 ${
            ketQua.hopLe
              ? 'border-green-200 bg-green-50 text-green-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
        >
          <p className="font-semibold">
            {ketQua.hopLe
              ? 'Dữ liệu hợp lệ'
              : 'Dữ liệu không hợp lệ'}
          </p>

          <p className="mt-2 text-sm leading-6">
            {ketQua.noiDung}
          </p>
        </div>
      )}
    </section>
  )
}
