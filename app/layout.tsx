import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT 트레이너 회원 관리",
  description: "1인 PT 트레이너를 위한 회원 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ pointerEvents: 'auto' }}>
      <body style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
        {children}
      </body>
    </html>
  );
}

