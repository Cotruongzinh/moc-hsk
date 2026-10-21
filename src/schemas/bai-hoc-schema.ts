import * as z from 'zod'

export const baiHocSchema = z.object({
  id: z.string().min(1),
  capDo: z.string().min(1),
  soBai: z.number().int().positive(),
  tenBai: z.string().min(1),
  soTuMoi: z.number().int().nonnegative(),
  daXuatBan: z.boolean(),
})

export type BaiHoc = z.infer<typeof baiHocSchema>
