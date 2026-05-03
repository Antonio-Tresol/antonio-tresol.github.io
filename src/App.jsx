import { HomePage } from "./pages/Home.jsx";
import { palette } from "./tokens.js";

export default function App() {
  return (
    <main
      style={{
        background: palette.bg,
        minHeight: "100vh",
        color: palette.body,
      }}
    >
      <HomePage />
    </main>
  );
}
