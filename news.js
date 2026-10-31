const FEEDS = {
india:'India news',world:'World news',politics:'India politics',up:'Uttar Pradesh news',bihar:'Bihar news',
sports:'Sports news',cricket:'Cricket news',business:'Business economy India',technology:'Technology science India',
entertainment:'Bollywood entertainment',education:'Education India',health:'Health India',weather:'India weather',
crime:'India crime news',science:'Science India'
};
const ALL=['india','world','politics','up','bihar','sports','cricket','business','technology','entertainment','education','health','weather','crime','science'];
function clean(s=''){return s.replace(/<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>/g,'$1').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#(\\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/\\s+/g,' ').trim();}
function tag(block,name){const m=block.match(new RegExp('<'+name+'(?:\\\\s[^>]*)?>([\\\\s\\\\S]*?)</'+name+'>','i'));return m?clean(m[1]):'';}
exports.handler=async(event)=>{
 const cat=(event.queryStringParameters||{}).cat||'all';
 const cats=cat==='all'?ALL:[cat in FEEDS?cat:'india'];
 const tasks=cats.map(async c=>{
  const q=encodeURIComponent(FEEDS[c]||'India latest news');
  const url=`https://news.google.com/rss/search?q=${q}&hl=hi-IN&gl=IN&ceid=IN:hi`;
  try{
   const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 DailyDoseIndiaNews/1.0'}});
   if(!res.ok)return [];
   const xml=await res.text();
   return [...xml.matchAll(/<item>([\\s\\S]*?)<\\/item>/gi)].slice(0,12).map(m=>{
    const b=m[1],title=tag(b,'title'),link=tag(b,'link'),desc=tag(b,'description'),pub=tag(b,'pubDate');
    let source=tag(b,'source')||'Google News';
    return {title,link,description:desc.slice(0,360),published:pub,source,category:c};
   }).filter(x=>x.title&&x.link);
  }catch(e){return []}
 });
 const lists=await Promise.all(tasks),seen=new Set(),items=lists.flat().filter(x=>{const k=x.title.toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
 items.sort((a,b)=>new Date(b.published||0)-new Date(a.published||0));
 return {statusCode:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=45','access-control-allow-origin':'*'},body:JSON.stringify({items:items.slice(0,80),updated:new Date().toISOString()})};
};