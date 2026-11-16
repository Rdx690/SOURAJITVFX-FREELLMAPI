const { getGateway } = require('./_gateway');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  try {
    const {url,auth}=getGateway(req);
    const upstream=await fetch(url+'/v1/models',{headers:{authorization:auth}});
    const body=await upstream.text();
    res.status(upstream.status).setHeader('content-type',upstream.headers.get('content-type')||'application/json');
    return res.send(body);
  } catch(e) { return res.status(e.status||502).json({error:e.message||'Gateway unavailable'}); }
};
