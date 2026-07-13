import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalScripts from "./components/GlobalScripts";

export const metadata = {
  title: "Rivertide | The Wellness OS for Oncology",
  description:
    "Rivertide — a secure, agentic voice-as-an-OS tool for oncology patients. Fight cancer with intelligence that fights with you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface selection:bg-soft-lavender antialiased">
        <Header />
        {children}
        <Footer />
        <GlobalScripts />
      </body>
    </html>
  );
}
