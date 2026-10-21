-- =========================================================
-- Mộc HSK
-- Cấu trúc dữ liệu nội dung học tập cơ bản
-- =========================================================

-- 1. Cấp HSK
create table public.hsk_levels (
  id smallint primary key,
  name_vi text not null,
  description_vi text,
  display_order smallint not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),

  constraint hsk_levels_display_order_positive
    check (display_order > 0)
);

-- 2. Bài học
create table public.lessons (
  id bigint generated always as identity primary key,
  hsk_level_id smallint not null
    references public.hsk_levels(id)
    on delete restrict,

  lesson_number smallint not null,
  slug text not null unique,
  title_vi text not null,
  description_vi text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint lessons_number_positive
    check (lesson_number > 0),

  constraint lessons_unique_number_per_level
    unique (hsk_level_id, lesson_number)
);

-- 3. Kho từ vựng
create table public.vocabulary (
  id bigint generated always as identity primary key,

  simplified text not null,
  traditional text,
  pronunciation text not null,
  meaning_vi text not null,

  is_published boolean not null default false,
  created_at timestamptz not null default now(),

  constraint vocabulary_unique_entry
    unique (simplified, pronunciation)
);

-- 4. Liên kết bài học - từ vựng
create table public.lesson_vocabulary (
  lesson_id bigint not null
    references public.lessons(id)
    on delete cascade,

  vocabulary_id bigint not null
    references public.vocabulary(id)
    on delete restrict,

  display_order smallint not null,
  note_vi text,

  primary key (lesson_id, vocabulary_id),

  constraint lesson_vocabulary_order_positive
    check (display_order > 0),

  constraint lesson_vocabulary_unique_order
    unique (lesson_id, display_order)
);

-- =========================================================
-- INDEX
-- =========================================================

create index lessons_hsk_level_id_idx
  on public.lessons(hsk_level_id);

create index lesson_vocabulary_vocabulary_id_idx
  on public.lesson_vocabulary(vocabulary_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.hsk_levels enable row level security;
alter table public.lessons enable row level security;
alter table public.vocabulary enable row level security;
alter table public.lesson_vocabulary enable row level security;

-- =========================================================
-- POLICY: người dùng chỉ đọc nội dung đã xuất bản
-- =========================================================

create policy "Đọc cấp HSK đã xuất bản"
on public.hsk_levels
for select
to anon, authenticated
using (is_published = true);

create policy "Đọc bài học đã xuất bản"
on public.lessons
for select
to anon, authenticated
using (is_published = true);

create policy "Đọc từ vựng đã xuất bản"
on public.vocabulary
for select
to anon, authenticated
using (is_published = true);

create policy "Đọc từ vựng của bài đã xuất bản"
on public.lesson_vocabulary
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lessons
    where lessons.id = lesson_vocabulary.lesson_id
      and lessons.is_published = true
  )
);

-- =========================================================
-- DATA API GRANTS
--
-- Project Mộc HSK đã tắt:
-- Automatically expose new tables
--
-- Vì vậy ta cấp đúng quyền cần thiết.
-- Frontend hiện chỉ cần ĐỌC nội dung học.
-- =========================================================

grant select on table public.hsk_levels
to anon, authenticated;

grant select on table public.lessons
to anon, authenticated;

grant select on table public.vocabulary
to anon, authenticated;

grant select on table public.lesson_vocabulary
to anon, authenticated;
