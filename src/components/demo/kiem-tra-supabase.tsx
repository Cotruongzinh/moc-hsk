import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

type HskLevel = {
  id: number
  name_vi: string
  display_order: number
  is_published: boolean
}

async function layDanhSachCapHsk(): Promise<HskLevel[]> {
  const { data, error } = await supabase
    .from('hsk_levels')
    .select('id, name_vi, display_order, is_published')
    .order('display_order')

  if (error) {
    throw error
  }

  return data
}

export function KiemTraSupabase() {
  const query = useQuery({
    queryKey: ['supabase', 'hsk-levels'],
    queryFn: layDanhSachCapHsk,
  })

  return (
    <section className="mt-8 rounded-2xl border border-[#D8DDD8] bg-[#FFFDF8] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#20634F]">
        Kiểm tra Supabase
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        Kết nối PostgreSQL thật
      </h2>

      {query.isPending && (
        <p className="mt-4 text-[#52635D]">
          Đang kết nối tới Supabase...
        </p>
      )}

      {query.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
          <p className="font-semibold">
            Kết nối chưa thành công
          </p>

          <p className="mt-2 text-sm">
            {query.error.message}
          </p>
        </div>
      )}

      {query.isSuccess && query.data.length === 0 && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
          <p className="font-semibold">
            Kết nối Supabase thành công
          </p>

          <p className="mt-2 text-sm leading-6">
            React đã đọc được bảng hsk_levels qua Data API.
            Hiện chưa có dữ liệu HSK đã xuất bản.
          </p>
        </div>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold text-green-900">
            Đã tải {query.data.length} cấp HSK.
          </p>

          <ul className="mt-3 grid gap-2">
            {query.data.map((level) => (
              <li
                key={level.id}
                className="rounded-xl bg-[#F6F4EE] px-4 py-3"
              >
                {level.name_vi}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
