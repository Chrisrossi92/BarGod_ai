import supabase from "@/lib/supabaseClient";
import {
  generateBaseAttributes,
  getHometownBonus,
  computeEffectiveAttributes,
  computeOVR,
} from "@/logic/battlerStats";

function mapBuildToRow(build) {
  const base_attributes = generateBaseAttributes(build.archetype);
  const bonus_attributes = getHometownBonus(build.hometown);
  const effective = computeEffectiveAttributes(base_attributes, bonus_attributes);
  const ovr = computeOVR(effective);

  return {
    name: build.name?.trim(),
    title: build.title?.trim() || null,
    archetype: build.archetype || null,
    hometown: build.hometown || null,
    avatar_seed: build.avatarSeed || null,
    moves: build.moves || [],
    appearance: build.appearance || {},
    base_attributes,
    bonus_attributes,
    attributes: effective, // optional, if you still want a combined field
    level: 1,
    xp: 0,
    unspent_points: 0,
    ovr,
  };
}

export async function createBattler(build) {
  const row = mapBuildToRow(build);
  if (!row.name || !row.archetype) {
    throw new Error("Battler needs at least a name and archetype.");
  }

  const { data, error } = await supabase
    .from("battlers")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listBattlers() {
  const { data, error } = await supabase
    .from("battlers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBattlerById(id) {
  if (!id) throw new Error("Battler id is required");
  const { data, error } = await supabase
    .from("battlers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
