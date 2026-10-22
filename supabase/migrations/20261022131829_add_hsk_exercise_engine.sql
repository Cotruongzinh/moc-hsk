-- =========================================================
-- Mộc HSK
-- Exercise Engine cho curriculum HSK 1-6
-- =========================================================
--
-- Cấu trúc:
--
-- lesson
--   └── exercise_sets
--         └── exercises
--               ├── exercise_options
--               └── exercise_answer_keys
--
-- exercise_answer_keys không được expose cho frontend.
-- =========================================================


-- =========================================================
-- 1. NHÓM BÀI TẬP
-- =========================================================

create table public.exercise_sets (
  id bigint generated always as identity primary key,

  lesson_id bigint not null
    references public.lessons(id)
    on delete cascade,

  code text not null,

  title_vi text not null,

  description_vi text,

  skill_type text not null,

  set_type text not null default 'practice',

  display_order smallint not null,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint exercise_sets_code_not_blank
    check (length(trim(code)) > 0),

  constraint exercise_sets_title_not_blank
    check (length(trim(title_vi)) > 0),

  constraint exercise_sets_order_positive
    check (display_order > 0),

  constraint exercise_sets_skill_type_valid
    check (
      skill_type in (
        'vocabulary',
        'grammar',
        'listening',
        'reading',
        'writing',
        'pronunciation',
        'mixed'
      )
    ),

  constraint exercise_sets_set_type_valid
    check (
      set_type in (
        'practice',
        'review',
        'quiz'
      )
    ),

  constraint exercise_sets_unique_code_per_lesson
    unique (
      lesson_id,
      code
    ),

  constraint exercise_sets_unique_order_per_lesson
    unique (
      lesson_id,
      display_order
    )
);


create index exercise_sets_lesson_id_idx
  on public.exercise_sets(lesson_id);


-- =========================================================
-- 2. CÂU BÀI TẬP
--
-- Các loại hỗ trợ:
--
-- single_choice
-- multiple_choice
-- true_false
-- fill_blank
-- sentence_order
-- matching
-- listening_choice
-- reading_choice
-- hanzi_input
-- short_answer
-- free_writing
-- =========================================================

create table public.exercises (
  id bigint generated always as identity primary key,

  exercise_set_id bigint not null
    references public.exercise_sets(id)
    on delete cascade,

  exercise_type text not null,

  instruction_vi text not null,

  prompt_zh text,

  prompt_vi text,

  public_content_json jsonb not null
    default '{}'::jsonb,

  grading_mode text not null
    default 'exact',

  points numeric(6, 2) not null
    default 1.00,

  display_order smallint not null,

  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint exercises_instruction_not_blank
    check (
      length(trim(instruction_vi)) > 0
    ),

  constraint exercises_type_valid
    check (
      exercise_type in (
        'single_choice',
        'multiple_choice',
        'true_false',
        'fill_blank',
        'sentence_order',
        'matching',
        'listening_choice',
        'reading_choice',
        'hanzi_input',
        'short_answer',
        'free_writing'
      )
    ),

  constraint exercises_grading_mode_valid
    check (
      grading_mode in (
        'exact',
        'partial',
        'manual'
      )
    ),

  constraint exercises_points_positive
    check (points > 0),

  constraint exercises_order_positive
    check (display_order > 0),

  constraint exercises_unique_order_per_set
    unique (
      exercise_set_id,
      display_order
    )
);


create index exercises_exercise_set_id_idx
  on public.exercises(exercise_set_id);

create index exercises_type_idx
  on public.exercises(exercise_type);


-- =========================================================
-- 3. PHƯƠNG ÁN / ITEM
--
-- Không có is_correct tại bảng này để tránh frontend
-- tải câu hỏi rồi nhìn thấy luôn đáp án đúng.
-- =========================================================

create table public.exercise_options (
  id bigint generated always as identity primary key,

  exercise_id bigint not null
    references public.exercises(id)
    on delete cascade,

  option_key text not null,

  text_zh text,

  text_vi text,

  content_json jsonb not null
    default '{}'::jsonb,

  display_order smallint not null,

  is_published boolean not null default true,

  created_at timestamptz not null default now(),

  constraint exercise_options_key_not_blank
    check (
      length(trim(option_key)) > 0
    ),

  constraint exercise_options_order_positive
    check (
      display_order > 0
    ),

  constraint exercise_options_has_content
    check (
      (
        text_zh is not null
        and length(trim(text_zh)) > 0
      )
      or
      (
        text_vi is not null
        and length(trim(text_vi)) > 0
      )
      or
      content_json <> '{}'::jsonb
    ),

  constraint exercise_options_unique_key
    unique (
      exercise_id,
      option_key
    ),

  constraint exercise_options_unique_order
    unique (
      exercise_id,
      display_order
    )
);


create index exercise_options_exercise_id_idx
  on public.exercise_options(exercise_id);


-- =========================================================
-- 4. ĐÁP ÁN / LỜI GIẢI
--
-- Bảng này tách riêng hoàn toàn.
--
-- Frontend KHÔNG được SELECT trực tiếp.
--
-- answer_json ví dụ:
--
-- single_choice:
-- { "option_key": "B" }
--
-- multiple_choice:
-- { "option_keys": ["A", "C"] }
--
-- true_false:
-- { "value": true }
--
-- fill_blank:
-- { "accepted_answers": ["你好"] }
--
-- sentence_order:
-- { "option_keys": ["word-2", "word-1", "word-3"] }
-- =========================================================

create table public.exercise_answer_keys (
  exercise_id bigint primary key
    references public.exercises(id)
    on delete cascade,

  answer_json jsonb not null,

  explanation_vi text,

  solution_json jsonb not null
    default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint exercise_answer_keys_answer_not_null
    check (
      answer_json <> 'null'::jsonb
    )
);


-- =========================================================
-- 5. ROW LEVEL SECURITY
-- =========================================================

alter table public.exercise_sets
  enable row level security;

alter table public.exercises
  enable row level security;

alter table public.exercise_options
  enable row level security;

alter table public.exercise_answer_keys
  enable row level security;


-- =========================================================
-- 6. RLS: EXERCISE SET
-- =========================================================

create policy "Đọc nhóm bài tập đã xuất bản"
on public.exercise_sets
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.lessons
    where lessons.id =
      exercise_sets.lesson_id
      and lessons.is_published = true
  )
);


-- =========================================================
-- 7. RLS: EXERCISE
-- =========================================================

create policy "Đọc câu bài tập đã xuất bản"
on public.exercises
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.exercise_sets
    join public.lessons
      on lessons.id =
        exercise_sets.lesson_id
    where exercise_sets.id =
      exercises.exercise_set_id
      and exercise_sets.is_published = true
      and lessons.is_published = true
  )
);


-- =========================================================
-- 8. RLS: OPTIONS
-- =========================================================

create policy "Đọc phương án bài tập đã xuất bản"
on public.exercise_options
for select
to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.exercises
    join public.exercise_sets
      on exercise_sets.id =
        exercises.exercise_set_id
    join public.lessons
      on lessons.id =
        exercise_sets.lesson_id
    where exercises.id =
      exercise_options.exercise_id
      and exercises.is_published = true
      and exercise_sets.is_published = true
      and lessons.is_published = true
  )
);


-- =========================================================
-- 9. ANSWER KEYS
--
-- Cố ý KHÔNG tạo SELECT policy cho
-- public.exercise_answer_keys.
-- =========================================================


-- =========================================================
-- 10. DATA API PRIVILEGES
-- =========================================================

revoke all
on table public.exercise_sets
from anon, authenticated;

revoke all
on table public.exercises
from anon, authenticated;

revoke all
on table public.exercise_options
from anon, authenticated;

revoke all
on table public.exercise_answer_keys
from anon, authenticated;


grant select
on table public.exercise_sets
to anon, authenticated;

grant select
on table public.exercises
to anon, authenticated;

grant select
on table public.exercise_options
to anon, authenticated;


-- =========================================================
-- Không grant quyền frontend cho exercise_answer_keys.
-- =========================================================
