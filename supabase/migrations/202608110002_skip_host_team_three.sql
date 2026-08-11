begin;

-- Nhóm 3 là đội quản trò, nên bảy slot thi đấu là 1, 2, 4, 5, 6, 7, 8.
alter table public.teams drop constraint if exists teams_team_number_check;

-- Chuyển slot số 3 của các phòng đã tạo thành slot số 8.
update public.teams
set team_number = 8
where team_number = 3;

alter table public.teams
  add constraint teams_team_number_check
  check (team_number in (1, 2, 4, 5, 6, 7, 8));

create or replace function public.create_game(p_room_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  g uuid;
begin
  insert into public.games(room_code)
  values (p_room_code)
  returning id into g;

  insert into public.teams(game_id, team_number)
  select g, team_number
  from unnest(array[1, 2, 4, 5, 6, 7, 8]) as team_number;

  perform public.emit_event(g, 'CREATED');
  return g;
end
$$;

revoke all on function public.create_game(text) from public;
grant execute on function public.create_game(text) to service_role;

commit;
