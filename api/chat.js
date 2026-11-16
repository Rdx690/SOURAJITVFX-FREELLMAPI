const { getGateway } = require('./_gateway');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const {url,auth}=getGateway(req);
    const body=req.body||{};
    if (!Array.isArray(body.messages) || body.messages.length===0) return res.status(400).json({error:'messages is required'});
    const payload={...body,model:body.model||'auto',stream:body.stream!==false};
    const upstream=await fetch(url+'/v1/chat/completions',{method:'POST',headers:{authorization:auth,'content-type':'application/json'},body:JSON.stringify(payload)});
    if (!upstream.ok) { const t=await upstream.text(); return res.status(upstream.status).send(t); }
    res.status(200);
    res.setHeader('content-type',upstream.headers.get('content-type')||'text/event-stream');
    res.setHeader('cache-control','no-cache, no-transform');
    res.setHeader('connection','keep-alive');
    if (!upstream.body) return res.end();
    const reader=upstream.body.getReader();
    try { while(true){const {done,value}=await reader.read();if(done)break;res.write(Buffer.from(value));} res.end(); }
    catch(e){res.end();}
  } catch(e) { return res.status(e.status||502).json({error:e.message||'Gateway unavailable'}); }
};
