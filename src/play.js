const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const scheme=process.argv[2]||'light';
  const ctx=await b.newContext({viewport:{width:390,height:780},colorScheme:scheme,deviceScaleFactor:1,hasTouch:true});
  const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text());});
  await p.goto('file:///home/claude/supper-run/preview.html');
  await p.waitForTimeout(900);
  const shot=n=>p.screenshot({path:`shot-${n}-${scheme}.png`,fullPage:true});
  await shot('home0');
  // draw must be impossible before prefs
  console.log('draw before prefs:',await p.evaluate(()=>window.__sr.draw('deck')));
  await p.click('[data-go=prefs]');
  await p.fill('#chef1','Mara');
  await p.check('#al-shellfish');await p.check('#al-peanut');
  await p.click('[data-act=noterm][data-t="mushrooms"]');await p.click('[data-act=noterm][data-t="spicy"]');await p.fill('#nolist',await p.inputValue('#nolist')+', cilantro');await p.check('#di-noredmeat');
  await shot('prefs');
  await p.click('[data-act=saveprefs]');
  // filter audit: 400 draws in each mode never contain a blocked item
  const audit=await p.evaluate(()=>{const sr=window.__sr;let bad=[],costs=[];
    sr.S.pantry.push({n:'Rice',id:'rice'},{n:'Eggs',id:'eggs'},{n:'Shrimp',id:'shrimp'},{n:'leftover chicken',id:null},{n:'Mushrooms',id:'mushroom'},{n:'Salt',id:'salt'});
    for(let i=0;i<400;i++){for(const m of ['deck','pantry']){const c=sr.draw(m);if(!c){bad.push('null '+m);continue}
      const cost=c.cards.reduce((a,x)=>a+x.c,0);costs.push(cost);
      for(const x of c.cards){if(sr.blocked(sr.resolve(x)))bad.push(x.n);if(/shrimp|peanut|mushroom|cilantro|salsa|hot sauce|jalape|kimchi|^salt|sriracha|chili|beef|pork|bacon|ham$|lamb|scallop|curry paste|taco|pepperoni|hot dog|sausage|steak|chorizo/i.test(x.n))bad.push('name '+x.n)}}}
    const hints=[];for(const k in sr.RESCUE)for(const h of sr.RESCUE[k][1].filter(h=>h[1].every(sr.allowed)))hints.push(h[0]);
    return {bad:[...new Set(bad)],maxCost:Math.max(...costs),over15:costs.filter(c=>c>15).length,n:costs.length,badHints:hints.filter(h=>/peanut|hot sauce/i.test(h)),hintCount:hints.length,deck:sr.deck(1).length};});
  console.log(JSON.stringify(audit));
  await p.reload();await p.waitForTimeout(500);
  await p.click('[data-act=draw][data-mode=deck]');await p.waitForTimeout(700);await shot('draw');
  await p.click('.have');await p.click('[data-act=redraw]');await p.waitForTimeout(600);
  await p.click('[data-act=start]');await p.waitForTimeout(300);
  const t=await p.$('[data-act=timer]');if(t)await t.click();
  await p.click('[data-act=rescueopen]');await p.click('[data-act=rescue][data-cat=spicy]');
  await shot('cook');
  await p.click('[data-act=tojudge]');
  await p.fill('#dish','The Midnight Skillet');
  for(const c of [0,1])for(const k of [0,1,2])await p.click(`[data-act=rate][data-c="${c}"][data-k="${k}"][data-v="${4}"]`);
  await p.fill('#steps','Brown things. Add other things.');
  await shot('judge');
  await p.click('[data-act=finish]');await shot('result');
  await p.click('[data-go=home]');
  // second round: a disaster from the pantry
  await p.click('[data-go=pantry]');await p.click('[data-act=pgroup][data-i="5"]');await p.click('[data-act=ptoggle][data-id=rice]');await p.click('[data-act=ptoggle][data-id=quinoa]');console.log('blocked chip disabled:',await p.evaluate(()=>{document.querySelector('[data-act=pgroup][data-i="0"]').click();return document.querySelector('[data-act=ptoggle][data-id=gbeef]').disabled&&!document.querySelector('[data-act=ptoggle][data-id=chicken]').disabled}));await p.fill('#pantryadd','eggs');await p.click('[data-act=padd]');await p.fill('#pantryadd','peanut butter');await p.click('[data-act=padd]');await shot('pantry');
  await p.click('[data-go=home]');
  const h1=await p.evaluate(()=>document.querySelector('.sheet p b').textContent);await p.click('[data-act=flip]');console.log('flip',h1,'->',await p.evaluate(()=>document.querySelector('.sheet p b').textContent));await p.click('[data-act=flip]');await p.click('[data-act=draw][data-mode=pantry]');await p.waitForTimeout(600);await shot('draw2');
  await p.click('[data-act=start]');await p.click('[data-act=tojudge]');
  await p.fill('#dish','Garlic Pancake');
  for(const c of [0,1])for(const k of [0,1,2])await p.click(`[data-act=rate][data-c="${c}"][data-k="${k}"][data-v="${1+k%2}"]`);
  await shot('judge2');
  await p.click('[data-act=finish]');await p.click('[data-go=home]');await shot('home');
  await p.click('[data-go=hall]');await shot('hall');await p.click('[data-go=home]');
  await p.click('[data-go=book]');await p.click('.entry');await shot('book');await p.click('[data-go=home]');
  await p.click('[data-go=unlocks]');await shot('unlocks');await p.click('[data-go=home]');
  await p.click('[data-go=share]');await shot('share');
  console.log(JSON.stringify(await p.evaluate(()=>({log:window.__sr.S.log.map(r=>[r.name,r.win,r.xp,r.epi,r.headName]),lvl:window.__sr.levelInfo(),h:document.documentElement.scrollWidth>innerWidth}))));
  console.log('errors',errs);
  await b.close();
})();
