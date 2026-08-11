-- Chạy sau migration + seed trong một Supabase local test project.
begin;
do $$ begin
  assert (select count(*) from public.questions)=10, 'seed must contain 10 questions';
  assert (select array_agg(max_points order by position) from public.questions)=array[50,50,50,80,80,80,120,120,160,200], 'point distribution';
end $$;
-- Các invariant còn lại được enforce bởi UNIQUE(game_id, question_id, team_id),
-- row locks trong submit_answer, server clock và teams.boost_used trong cùng transaction.
rollback;
