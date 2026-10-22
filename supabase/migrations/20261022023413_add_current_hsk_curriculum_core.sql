-- =========================================================
-- Mộc HSK
-- Curriculum Core cho hệ HSK hiện hành 6 cấp
-- =========================================================

-- =========================================================
-- 1. KHỞI TẠO 6 CẤP HSK HIỆN HÀNH
--
-- Vocabulary target là số từ TÍCH LŨY theo chuẩn HSK:
--
-- HSK 1: 150
-- HSK 2: 300
-- HSK 3: 600
-- HSK 4: 1200
-- HSK 5: 2500
-- HSK 6: 5000+
--
-- Số lượng này dùng làm metadata/mục tiêu học.
-- Không có nghĩa mỗi cấp sẽ dạy lại toàn bộ từ của cấp trước.
-- =========================================================

alter table public.hsk_levels
  add column vocabulary_target integer;

alter table public.hsk_levels
  add constraint hsk_levels_vocabulary_target_positive
  check (
    vocabulary_target is null
    or vocabulary_target > 0
  );

insert into public.hsk_levels (
  id,
  name_vi,
  description_vi,
  display_order,
  vocabulary_target,
  is_published
)
values
(
  1,
  'HSK 1',
  'Cấp độ nền tảng của hệ HSK hiện hành. Mục tiêu tích lũy khoảng 150 từ vựng thông dụng.',
  1,
  150,
  true
),
(
  2,
  'HSK 2',
  'Cấp độ sơ cấp của hệ HSK hiện hành. Mục tiêu tích lũy khoảng 300 từ vựng thông dụng.',
  2,
  300,
  true
),
(
  3,
  'HSK 3',
  'Cấp độ trung cấp đầu của hệ HSK hiện hành. Mục tiêu tích lũy khoảng 600 từ vựng thông dụng.',
  3,
  600,
  true
),
(
  4,
  'HSK 4',
  'Cấp độ trung cấp của hệ HSK hiện hành. Mục tiêu tích lũy khoảng 1200 từ vựng thông dụng.',
  4,
  1200,
  true
),
(
  5,
  'HSK 5',
  'Cấp độ trung cao cấp của hệ HSK hiện hành. Mục tiêu tích lũy khoảng 2500 từ vựng thông dụng.',
  5,
  2500,
  true
),
(
  6,
  'HSK 6',
  'Cấp độ cao nhất của hệ HSK hiện hành. Người học cần nắm khoảng 5000 từ vựng trở lên.',
  6,
  5000,
  true
)
on conflict (id)
do update set
  name_vi = excluded.name_vi,
  description_vi = excluded.description_vi,
  display_order = excluded.display_order,
  vocabulary_target = excluded.vocabulary_target,
  is_published = excluded.is_published;


-- =========================================================
-- 2. TỪ VỰNG THUỘC CẤP HSK NÀO
--
-- Khác với lesson_vocabulary.
--
-- hsk_level_vocabulary:
--   "Từ này thuộc danh mục HSK cấp nào?"
--
-- lesson_vocabulary:
--   "Mộc dạy từ này trong bài học nào?"
-- =========================================================

create table public.hsk_level_vocabulary (
  hsk_level_id smallint not null
    references public.hsk_levels(id)
    on delete cascade,

  vocabulary_id bigint not null
    references public.vocabulary(id)
    on delete restrict,

  display_order integer not null,

  created_at timestamptz not null default now(),

  primary key (
    hsk_level_id,
    vocabulary_id
  ),

  constraint hsk_level_vocabulary_order_positive
    check (display_order > 0),

  constraint hsk_level_vocabulary_unique_order
    unique (
      hsk_level_id,
      display_order
    )
);

create index hsk_level_vocabulary_vocabulary_id_idx
  on public.hsk_level_vocabulary(vocabulary_id);


-- =========================================================
-- 3. KHO ĐIỂM NGỮ PHÁP
--
-- Grammar point là đơn vị kiến thức độc lập.
--
-- Ví dụ:
--   是...的
--   不 / 没
--   了
--   过
--   把
--   被
--
-- Chúng không hard-code trực tiếp vào lesson.
-- Một điểm ngữ pháp có thể được giới thiệu rồi ôn lại
-- ở nhiều bài khác nhau.
-- =========================================================

create table public.grammar_points (
  id bigint generated always as identity primary key,

  hsk_level_id smallint not null
    references public.hsk_levels(id)
    on delete restrict,

  code text not null unique,

  title_vi text not null,

  structure text,

  explanation_vi text not null,

  notes_vi text,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index grammar_points_hsk_level_id_idx
  on public.grammar_points(hsk_level_id);


-- =========================================================
-- 4. LIÊN KẾT BÀI HỌC - NGỮ PHÁP
--
-- relation_type:
--
-- introduce = bài đầu tiên giới thiệu kiến thức
-- review    = bài ôn lại kiến thức đã học
-- =========================================================

create table public.lesson_grammar_points (
  lesson_id bigint not null
    references public.lessons(id)
    on delete cascade,

  grammar_point_id bigint not null
    references public.grammar_points(id)
    on delete restrict,

  display_order smallint not null,

  relation_type text not null default 'introduce',

  note_vi text,

  primary key (
    lesson_id,
    grammar_point_id
  ),

  constraint lesson_grammar_points_order_positive
    check (display_order > 0),

  constraint lesson_grammar_points_relation_type_valid
    check (
      relation_type in (
        'introduce',
        'review'
      )
    ),

  constraint lesson_grammar_points_unique_order
    unique (
      lesson_id,
      display_order
    )
);

create index lesson_grammar_points_grammar_id_idx
  on public.lesson_grammar_points(grammar_point_id);


-- =========================================================
-- 5. SECTION NỘI DUNG CỦA BÀI HỌC
--
-- Một lesson không phải chỉ có title + vocabulary.
--
-- Bài học có thể gồm:
--
-- intro
-- objectives
-- pronunciation
-- vocabulary
-- grammar
-- dialogue
-- listening
-- reading
-- writing
-- culture
-- practice
-- summary
--
-- content_json cho phép lưu nội dung có cấu trúc,
-- tránh phải tạo một cột riêng cho mọi loại section.
--
-- Ví dụ dialogue có thể chứa:
--
-- {
--   "speakers": [...],
--   "lines": [...]
-- }
--
-- reading có thể chứa:
--
-- {
--   "title": "...",
--   "paragraphs": [...]
-- }
-- =========================================================

create table public.lesson_sections (
  id bigint generated always as identity primary key,

  lesson_id bigint not null
    references public.lessons(id)
    on delete cascade,

  section_type text not null,

  title_vi text,

  display_order smallint not null,

  content_json jsonb not null
    default '{}'::jsonb,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint lesson_sections_order_positive
    check (display_order > 0),

  constraint lesson_sections_type_valid
    check (
      section_type in (
        'intro',
        'objectives',
        'pronunciation',
        'vocabulary',
        'grammar',
        'dialogue',
        'listening',
        'reading',
        'writing',
        'culture',
        'practice',
        'summary'
      )
    ),

  constraint lesson_sections_unique_order
    unique (
      lesson_id,
      display_order
    )
);

create index lesson_sections_lesson_id_idx
  on public.lesson_sections(lesson_id);


-- =========================================================
-- 6. ROW LEVEL SECURITY
-- =========================================================

alter table public.hsk_level_vocabulary
  enable row level security;

alter table public.grammar_points
  enable row level security;

alter table public.lesson_grammar_points
  enable row level security;

alter table public.lesson_sections
  enable row level security;


-- =========================================================
-- 7. RLS POLICIES
-- =========================================================

create policy "Đọc từ vựng thuộc cấp HSK đã xuất bản"
on public.hsk_level_vocabulary
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.hsk_levels
    where hsk_levels.id =
      hsk_level_vocabulary.hsk_level_id
      and hsk_levels.is_published = true
  )
  and
  exists (
    select 1
    from public.vocabulary
    where vocabulary.id =
      hsk_level_vocabulary.vocabulary_id
      and vocabulary.is_published = true
  )
);


create policy "Đọc ngữ pháp đã xuất bản"
on public.grammar_points
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.hsk_levels
    where hsk_levels.id =
      grammar_points.hsk_level_id
      and hsk_levels.is_published = true
  )
);


create policy "Đọc ngữ pháp của bài đã xuất bản"
on public.lesson_grammar_points
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lessons
    where lessons.id =
      lesson_grammar_points.lesson_id
      and lessons.is_published = true
  )
  and
  exists (
    select 1
    from public.grammar_points
    where grammar_points.id =
      lesson_grammar_points.grammar_point_id
      and grammar_points.is_published = true
  )
);


create policy "Đọc section của bài đã xuất bản"
on public.lesson_sections
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.lessons
    where lessons.id =
      lesson_sections.lesson_id
      and lessons.is_published = true
  )
);


-- =========================================================
-- 8. QUYỀN DATA API
--
-- Frontend chỉ cần đọc curriculum.
-- Không cấp INSERT / UPDATE / DELETE cho client.
-- =========================================================

revoke all
on table public.hsk_level_vocabulary
from anon, authenticated;

revoke all
on table public.grammar_points
from anon, authenticated;

revoke all
on table public.lesson_grammar_points
from anon, authenticated;

revoke all
on table public.lesson_sections
from anon, authenticated;


grant select
on table public.hsk_level_vocabulary
to anon, authenticated;

grant select
on table public.grammar_points
to anon, authenticated;

grant select
on table public.lesson_grammar_points
to anon, authenticated;

grant select
on table public.lesson_sections
to anon, authenticated;
