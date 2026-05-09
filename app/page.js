import HomeClient from "../components/HomeClient";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: dealerData } = await supabase
    .from("dealers")
    .select("*")
    .limit(1);

  const { data: vehicleData } = await supabase
    .from("vehicles")
    .select("*")
    .eq("published", true)
    .not("teaser_video", "is", null)
    .not("walkaround_video", "is", null)
    .order("created_at", { ascending: false });

  const dealership = dealerData?.[0] || {
    dealership_name: "Value Vehicles",
    phone: "01206 413177",
    whatsapp: "07939885608",
    accent_color: "#732b97",
    homepage_video: "",
    homepage_video_title: "Welcome to our online showroom",
    homepage_video_subtitle: "Step inside the car before you visit.",
  };

  const cars =
    vehicleData?.map((car) => ({
      id: car.id,
      slug: car.slug,
      title: car.title,
      price: car.price,
      mileage: car.mileage,
      fuel: car.fuel,
      gearbox: car.gearbox,
      body: car.body,
      status: "Available",
      teaserVideo: car.teaser_video,
      walkaroundVideo: car.walkaround_video,
      inspectVideos: [],
    })) || [];

  const heroVideo = dealership.homepage_video || cars[0]?.teaserVideo || "";

  return (
    <HomeClient
      dealership={dealership}
      cars={cars}
      heroVideo={heroVideo}
    />
  );
}