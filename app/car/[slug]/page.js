import Header from "../../../components/Header";
import Showroom from "../../../components/Showroom";
import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CarPage({ params }) {
  const { data: dealerData } = await supabase
    .from("dealers")
    .select("*")
    .limit(1);

  const dealership = dealerData?.[0] || {};

  const { data: vehicleData } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .limit(1);

  const vehicle = vehicleData?.[0];

  if (!vehicle) {
    notFound();
  }

  const { data: clipsData } = await supabase
    .from("vehicle_inspect_clips")
    .select("*")
    .eq("vehicle_id", vehicle.id)
    .order("position", { ascending: true });

  const car = {
    id: vehicle.id,
    slug: vehicle.slug,
    title: vehicle.title,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    gearbox: vehicle.gearbox,
    body: vehicle.body,
    status: "Available",

    teaserVideo: vehicle.teaser_video,
    walkaroundVideo: vehicle.walkaround_video,

    details: [
      ["Mileage", vehicle.mileage],
      ["Fuel", vehicle.fuel],
      ["Gearbox", vehicle.gearbox],
      ["Body", vehicle.body],
    ],

    inspectVideos:
      clipsData
        ?.filter((clip) => clip.cloudflare_video_id)
        .map((clip) => ({
          label: clip.label,
          icon: clip.icon,
          video: clip.cloudflare_video_id,
          preview:
            clip.cloudflare_preview_id ||
            clip.cloudflare_video_id,
        })) || [],
  };

  return (
    <>
      <Header dealership={dealership} />
      <Showroom car={car} />
    </>
  );
}