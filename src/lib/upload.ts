import { supabase } from "./supabase";

export async function uploadPublicImage(
  file: File,
  folder: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}
