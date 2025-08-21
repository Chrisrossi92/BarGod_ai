import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function useBattlersQuery() {
  const [battlers, setBattlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("battlers")
        .select("id,name,bio,photo_url,stats")
        .order("name", { ascending: true });
      if (!ignore) {
        if (error) setError(error.message);
        else setBattlers(data || []);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return { battlers, loading, error };
}
