import "./globals.css";
import Header from "@/app/components/Header";

export const metadata = {
  title: "커뮤니티 앱",
  description: "커뮤니티 앱 MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
