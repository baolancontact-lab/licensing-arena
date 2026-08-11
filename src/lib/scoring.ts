export function calculateScore(maxPoints:number,responseMs:number,isCorrect:boolean,boost=false){
  if(!isCorrect) return 0;
  const seconds=Math.min(15,Math.max(0,responseMs/1000));
  const base=Math.round(maxPoints*.6+maxPoints*.4*Math.max(0,(15-seconds)/15));
  return Math.round(base*(boost?1.5:1));
}
