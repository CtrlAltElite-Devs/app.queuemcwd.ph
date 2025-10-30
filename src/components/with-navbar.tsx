import NavBar from "./containers/navbar";
import { ModeToggle } from "./ui/mode-toggle";

export default function WithNavbar() {
  const title = "Metropolitan Cebu Water District";

  return (
    <div className="sticky top-0 z-50">
      <NavBar title={title} />
      <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
        <ModeToggle />
      </div>
    </div>
  );
}
