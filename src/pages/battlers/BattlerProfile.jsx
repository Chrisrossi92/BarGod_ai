import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function BattlerProfile() {
  const { id } = useParams();
  const [row, setRow] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    let ignore = false;
    (async ()=>{
      setLoading(true);
      try {
        const { default: supabase } = await import("@/lib/supabaseClient");
        const { data, error } = await supabase
          .from("battlers")
          .select("id,name,bio,photo_url,stats")
          .eq("id", id)
          .single();
        if (ignore) return;
        if (error) throw error;
        setRow(data);
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return ()=>{ ignore = true; };
  }, [id]);

  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',padding:24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link to="/battlers" style={{color:'#fff',textDecoration:'none',opacity:.8}}>← Back</Link>
        <Link to={`/battlers/${id}/upload`} style={{color:'#b9ff66',textDecoration:'none',fontWeight:800}}>Upload Battle</Link>
      </div>

      {loading && <div style={{opacity:.7,marginTop:12}}>Loading…</div>}
      {err && <div style={{marginTop:12,color:'#ffbfbf'}}>Error: {err}</div>}
      {!loading && !err && row && (
        <>
          <h1 style={{fontSize:24,fontWeight:800,marginTop:16}}>{row.name}</h1>
          {row.photo_url && (
            <div style={{aspectRatio:'16/7',background:'#0f0f0f',borderRadius:12,overflow:'hidden',marginTop:12}}>
              <img src={row.photo_url} alt={row.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
          )}
          {row.bio && <p style={{opacity:.8,marginTop:12}}>{row.bio}</p>}
          <div style={{marginTop:12,opacity:.7,fontSize:12}}>
            (Ratings UI coming soon.)
          </div>
        </>
      )}
    </div>
  );
}
