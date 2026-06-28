fetch('http://localhost:5173/src/index.css').then(r=>r.text()).then(t=>{console.log('Has 10 10 10:', t.includes('10 10 10')); console.log('Has 15 23 42:', t.includes('15 23 42')); })
