import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { StoreProvider } from "@/components/store-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Brasa&Banana — burgers, pizza e açaí",
  description: "Peça hambúrguer, pizza, açaí e muito mais sem sair de casa.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-zinc-900">
        <StoreProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <footer className="mt-8 border-t border-zinc-900/5 bg-white/60 py-5 text-center text-sm text-zinc-500 backdrop-blur">
            🍔 <strong className="font-semibold text-zinc-700">Brasa&amp;Banana</strong> — aberto
            todos os dias, das 18h às 23h · feito só com front, sem backend 😉
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
