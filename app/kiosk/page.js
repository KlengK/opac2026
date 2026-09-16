import { kioskLinks } from "@/data/curatedLinks.js";
import KioskLauncher from "@/components/KioskLauncher.jsx";

export const metadata = {
  title: "Kiosk",
  description: "Touch-friendly launcher for library terminals.",
};

export default function KioskPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <KioskLauncher links={kioskLinks()} />
    </div>
  );
}
