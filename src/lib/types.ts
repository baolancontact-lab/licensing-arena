export type GameStatus = "LOBBY"|"COUNTDOWN"|"QUESTION_OPEN"|"QUESTION_LOCKED"|"REVEAL"|"LEADERBOARD"|"FINAL_RESULTS"|"PAUSED"|"ENDED";
export type Option = "A"|"B"|"C"|"D";
export interface Game { id:string; room_code:string; status:GameStatus; current_question_index:number; question_started_at:string|null; question_ends_at:string|null; paused_from:GameStatus|null; created_at:string }
export interface Team { id:string; game_id:string; team_number:number; auth_user_id:string|null; total_score:number; streak:number; best_streak:number; boost_used:boolean; joined_at:string|null }
export interface Question { id:string; position:number; question_text:string; options:Record<Option,string>; difficulty:string; max_points:number; correct_option?:Option; explanation?:string }
export interface Answer { team_id:string; selected_option?:Option; submitted_at:string; response_ms:number; is_correct?:boolean; awarded_points?:number; boost_applied:boolean }
export interface Snapshot { game:Game; teams:Team[]; question:Question|null; answers:Answer[]; my_team_id?:string|null }
