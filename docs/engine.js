(function(root){
'use strict';
const mod=(n,m)=>(n%m+m)%m;
function makePath(y,reverse=false){const p=[{x:-500,y},{x:1500,y},{x:1500,y:-900-y},{x:-500,y:-900-y},{x:-500,y}],cum=[0];for(let i=1;i<p.length;i++)cum.push(cum[i-1]+Math.hypot(p[i].x-p[i-1].x,p[i].y-p[i-1].y));if(reverse)for(const point of p)point.x=1000-point.x;return {p,cum,length:cum.at(-1)};}
function at(path,d){d=mod(d,path.length);let low=0,high=path.cum.length-1;while(high-low>1){let m=(low+high)>>1;if(path.cum[m]<=d)low=m;else high=m;}const a=path.p[low],b=path.p[high],t=(d-path.cum[low])/(path.cum[high]-path.cum[low]);return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,a:Math.atan2(b.y-a.y,b.x-a.x)};}
function nearest(paths,x,y){let best={distance:Infinity};paths.forEach((path,track)=>{for(let i=1;i<path.p.length;i++){const a=path.p[i-1],b=path.p[i],dx=b.x-a.x,dy=b.y-a.y;const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));const distance=Math.hypot(x-a.x-dx*t,y-a.y-dy*t);if(distance<best.distance)best={track,d:path.cum[i-1]+t*(path.cum[i]-path.cum[i-1]),distance};}});return best;}
class World{
constructor(){this.stage=0;this.elapsed=0;this.total=0;this.trains=[];this.serial=0;this.view={left:0,right:1000};this.reset();}
reset(){this.paths=[makePath(370,true),makePath(650)];this.trains=[];this.crossings=this.paths.map((p,track)=>({track,d:1000,y:p.p[0].y,requested:false,closed:false}));this.cars=[{y:50,dir:1,color:'#ed986a'},{y:940,dir:-1,color:'#70a5c2'},{y:-200,dir:1,color:'#e8c85c'},{y:1190,dir:-1,color:'#bd9acb'}];}
occupied(c){return this.cars.some(car=>Math.abs(car.y-c.y)<88);}
spawn(x,y,type){const n=nearest(this.paths,x,y),train={id:++this.serial,track:n.track,d:n.d,traveled:0,type,age:0,speed:115+type*5};const c=this.crossings[n.track];if(this.occupied(c)&&train.d>c.d-85&&train.d<c.d+185)train.d=c.d-95;if(this.trains.length>=12)this.trains.shift();this.trains.push(train);this.gates();return train;}
gates(){for(const c of this.crossings){c.requested=this.trains.some(t=>{if(t.track!==c.track)return false;const length=this.paths[t.track].length;return mod(c.d-t.d,length)<340||mod(t.d-c.d,length)<190;});c.closed=c.requested&&!this.occupied(c);}}
move(dt){this.gates();for(const t of this.trains){let advance=t.speed*dt;const c=this.crossings[t.track],ahead=mod(c.d-t.d,this.paths[t.track].length);if(!c.closed&&c.requested&&ahead>=80&&ahead-advance<80)advance=ahead-80;t.age+=dt;t.d+=advance;t.traveled+=advance;
// Change rows only once the last carriage has fully cleared the viewport.
const pos=at(this.paths[t.track],t.d),rightward=t.track===1;
if((rightward&&pos.x>this.view.right+150)||(!rightward&&pos.x<this.view.left-150)){const entryX=rightward?this.view.right+40:this.view.left-40;t.track=1-t.track;t.d=t.track===0?1500-entryX:entryX+500;t.traveled=0;}}
this.gates();for(const dir of [1,-1]){const lane=this.cars.filter(c=>c.dir===dir).sort((a,b)=>(b.y-a.y)*dir);for(let i=0;i<lane.length;i++){const car=lane[i];let next=car.y+dir*82*dt;for(const c of this.crossings){const stop=c.y-dir*100;if(c.requested&&(stop-car.y)*dir>=-0.001&&(next-stop)*dir>0)next=stop;}if(i>0)next=dir===1?Math.min(next,lane[i-1].y-70):Math.max(next,lane[i-1].y+70);car.y=next;}for(const car of lane){if(car.y>1350)car.y=-180;if(car.y< -350)car.y=1180;}}this.gates();}
step(dt){let changed=false;while(dt>1e-9){const slice=Math.min(dt,.025,30-this.elapsed);this.move(slice);this.elapsed+=slice;this.total+=slice;dt-=slice;if(this.elapsed>=30-1e-8){this.elapsed=0;this.stage=(this.stage+1)%4;this.reset();changed=true;}}return changed;}
}
root.Rail={World,at,nearest,mod};if(typeof module!=='undefined')module.exports=root.Rail;
})(typeof window==='undefined'?globalThis:window);
