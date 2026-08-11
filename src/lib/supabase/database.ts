import type {Option,Snapshot} from "@/lib/types";
type Fn<A,R>={Args:A;Returns:R};
export interface Database {public:{Tables:Record<string,never>;Views:Record<string,never>;Functions:{
  claim_team:Fn<{p_room_code:string;p_team_number:number},{accepted:boolean}>;
  submit_answer:Fn<{p_room_code:string;p_selected_option:Option;p_use_boost:boolean},{accepted:boolean}>;
  create_game:Fn<{p_room_code:string},string>;
  host_snapshot:Fn<{p_room_code:string},Snapshot>;
  public_snapshot:Fn<{p_room_code:string},Snapshot>;
  host_action:Fn<{p_room_code:string;p_action:string;p_team_number:number|null},{accepted:boolean}>;
};Enums:{answer_option:Option};CompositeTypes:Record<string,never>}}
