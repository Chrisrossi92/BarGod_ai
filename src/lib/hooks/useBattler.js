import { useEffect, useState } from "react";
import { getBattlerById } from "@/lib/battlersApi";
import archetypes from "@/logic/archetypes";
import { cities } from "@/components/therise/hometown/cityData";

export default function useBattler(id) {
  const [battler, setBattler] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const row = await getBattlerById(id);
        if (!active) return;

        const archetypeData = row.archetype
          ? archetypes[row.archetype]
          : null;
        const city = row.hometown
          ? cities.find((c) => c.id === row.hometown)
          : null;
        const hometownLabel = city?.name || null;

        const attrs =
          row.attributes || row.base_attributes || {};

        setBattler({
          raw: row,
          name: row.name,
          archetypeId: row.archetype || null,
          archetypeLabel:
            archetypeData?.name || row.archetype || "Unknown archetype",
          hometownLabel,
          level: row.level ?? 1,
          xp: row.xp ?? 0,
          ovr: row.ovr ?? 60,
          attributes: attrs,
        });
      } catch (e) {
        console.error(e);
        if (active) setError(e.message || "Failed to load battler");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  return { battler, loading, error };
}
