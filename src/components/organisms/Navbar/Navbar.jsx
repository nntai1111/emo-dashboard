import { Link } from "react-router-dom";
import SparklesPreview from "../ProjectName/SparklesPreview";
export default function Navbar() {
  return (
    <header className="w-full h-16 grid grid-cols-[1fr_auto_1fr] items-center px-4 relative overflow-visible">
      {/* Left: logo (kept within navbar height) */}
      <div className="relative flex items-center min-w-0 h-full overflow-visible"></div>

      {/* Center: always centered regardless of left/right widths */}
      <div className="justify-self-center max-w-full text-center flex justify-center">
        <Link
          to="/"
          className="inline-block max-w-[70vw] sm:max-w-[60vw] md:max-w-none overflow-hidden">
          <div className="scale-90 sm:scale-100 origin-center">
            <SparklesPreview />
          </div>
        </Link>
      </div>

      {/* Right: actions */}
      <nav className="justify-self-end flex items-center gap-2 min-w-0">
        {/* <Button variant="ghost">Docs</Button>
        <Button variant="primary">Get Started</Button> */}
      </nav>
    </header>
  );
}
