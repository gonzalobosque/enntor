import {chromium} from 'playwright'; import assert from 'node:assert/strict';
const b=await chromium.launch();try {
const p=await b.newPage({viewport:{width:320,height:720}});await p.route('https://**',r=>r.abort());
p.setDefaultTimeout(12000);
const btt=(n,s=p)=>s.getByRole('button',{name:n,exact:true});
await p.goto((process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5176') + '/#/climb/F01.01');
await btt('Continue to Predict').press('Enter');await p.getByLabel('Your prediction',{exact:true}).fill('22');
await btt('Commit prediction & run').press('Enter');
const mod=p.getByRole('region',{name:/^Modify/});const ed=mod.getByRole('textbox',{name:'Modify Python code'});
await ed.waitFor();
const saved=()=>p.evaluate(()=>Object.entries(localStorage).find(([k])=>k.startsWith('enntor.draft.F01.01.modify')&&!k.endsWith('.previous'))?.[1]);
await ed.fill('def total(base, extra):');
await ed.press('End');await ed.press('Enter');
assert.match(await saved(),/\n {4}$/);
await p.keyboard.insertText('if base:');await ed.press('Enter');
assert.match(await saved(),/\n {8}$/);
await p.keyboard.insertText('value = "colon:"');await ed.press('Enter');
assert.match(await saved(),/\n {8}$/);
await ed.press('Shift+Tab');assert.match(await saved(),/\n {4}$/);
await ed.press('Tab');assert.match(await saved(),/\n {8}$/);
await ed.press('Meta+z');assert.match(await saved(),/\n {4}$/);
await ed.press('Meta+Shift+z');assert.match(await saved(),/\n {8}$/);
await ed.press('Escape');await p.keyboard.press('Tab');
assert.equal(await ed.evaluate(e=>e===document.activeElement),false);
await ed.fill('def total(base, extra):\n    # comment\n    print("hello", 5)\n    return (base + extra) * 3');
for(const cls of ['keyword','function','string','comment','literal']) assert(await mod.locator('.python-'+cls).count(),cls);
assert(await mod.locator('.python-function').filter({hasText:'print'}).count(),'call token highlighted');
await p.reload();await mod.getByText('Previous draft restored',{exact:true}).waitFor();
assert.match(await ed.innerText(),/print/);
await btt('Check solution',mod).press('Enter');
await mod.getByText('All public cases passed.',{exact:true}).waitFor();
await ed.fill('while True:\n    pass');await btt('Run',mod).press('Enter');await p.waitForTimeout(800);
await btt('Stop',mod).press('Enter');await mod.getByText('Execution stopped.',{exact:true}).waitFor();
await ed.fill('print(42)');await btt('Run',mod).press('Enter');await mod.getByText(/stdout\s+42/).waitFor();
p.once('dialog',d=>d.accept());await btt('Reset',mod).press('Enter');
assert.match(await ed.innerText(),/return base \+ extra \* 3/);
for(const theme of ['light','dark']){
 if(await p.locator('html').getAttribute('data-theme')!==theme) await btt('Switch to '+theme+' mode').press('Enter');
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
}
console.log('Stage 2 keyboard, styling and runtime checks passed');
}finally{await b.close();}
