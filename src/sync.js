const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();const store={};const errs=[];let reqs=0;
  const mk=async(name)=>{const ctx=await b.newContext({viewport:{width:390,height:780},hasTouch:true});
    await ctx.route('https://megzgnuzoggettaxeqjq.supabase.co/**',async route=>{const rq=route.request();reqs++;
      const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};
      if(rq.method()==='OPTIONS')return route.fulfill({status:204,headers:cors});
      const h=rq.headers(),u=new URL(rq.url());
      if(!h['x-party']||h['x-party'].length<16||!h.apikey)return route.fulfill({status:401,headers:cors,body:'[]'});
      if(rq.method()==='GET'){const p=u.searchParams.get('party').replace('eq.','');const row=p===h['x-party']?store[p]:null;
        return route.fulfill({status:200,headers:cors,contentType:'application/json',body:JSON.stringify(row?[{body:row}]:[])});}
      const rows=JSON.parse(rq.postData());for(const r of rows){if(r.party!==h['x-party'])return route.fulfill({status:403,headers:cors});store[r.party]=r.body;}
      return route.fulfill({status:201,headers:cors});});
    const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+' PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(name+' '+m.text());});
    await p.goto('http://localhost:8765/');await p.waitForTimeout(600);return p;};
  const A=await mk('A'),B=await mk('B');
  await A.click('[data-go=prefs]');await A.fill('#chef1','Mara');await A.check('#al-peanut');await A.click('[data-act=saveprefs]');
  await A.click('[data-go=share]');await A.screenshot({path:'shot-link.png',fullPage:true});
  await A.click('[data-act=linknew]');await A.waitForTimeout(1200);
  const code=await A.inputValue('#linkcode');console.log('code',code,'A cloud',await A.evaluate(()=>window.__sr.cloud));
  await A.screenshot({path:'shot-linked.png',fullPage:true});
  // B has its own stale local round first, then joins
  await B.click('[data-go=share]');await B.fill('#joincode','  '+code.toUpperCase()+' ');await B.click('[data-act=linkjoin]');await B.waitForTimeout(1500);
  console.log('B after join',JSON.stringify(await B.evaluate(()=>({chefs:window.__sr.S.chefs,ok:window.__sr.S.prefs.ok,al:window.__sr.S.prefs.al,cloud:window.__sr.cloud}))));
  await A.click('[data-go=home]');await A.click('[data-act=draw][data-mode=deck]');await A.click('[data-act=start]');await A.click('[data-act=tojudge]');
  await B.waitForTimeout(7000);await B.click('[data-go=home]');
  console.log('B sees round',await B.evaluate(()=>window.__sr.S.cur&&window.__sr.S.cur.stage));
  await B.click('[data-go=judge]');
  // both rate at the same moment
  await Promise.all([ (async()=>{for(const k of [0,1,2])await A.click(`[data-act=rate][data-c="0"][data-k="${k}"][data-v="5"]`)})(), (async()=>{for(const k of [0,1,2])await B.click(`[data-act=rate][data-c="1"][data-k="${k}"][data-v="4"]`)})() ]);
  await A.waitForTimeout(9000);
  console.log('A r',JSON.stringify(await A.evaluate(()=>window.__sr.S.cur.r)),'B r',JSON.stringify(await B.evaluate(()=>window.__sr.S.cur.r)));
  await B.fill('#dish','Synced Supper');await B.waitForTimeout(7000);
  console.log('A dish',await A.evaluate(()=>window.__sr.S.cur.dish));
  await A.click('[data-act=finish]');await B.waitForTimeout(7000);
  console.log('B log',JSON.stringify(await B.evaluate(()=>window.__sr.S.log.map(r=>[r.name,r.win,r.xp]))),'B cur',await B.evaluate(()=>window.__sr.S.cur));
  // wrong code sees nothing
  const C=await mk('C');await C.click('[data-go=share]');await C.fill('#joincode','sr-aaaa-bbbb-cccc-dddd');await C.click('[data-act=linkjoin]');await C.waitForTimeout(1200);
  console.log('C (wrong code) prefs ok:',await C.evaluate(()=>window.__sr.S.prefs.ok),'stores',Object.keys(store).length,'requests',reqs);
  console.log('errors',errs);await b.close();
})();
