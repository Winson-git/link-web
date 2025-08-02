import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Link in Bio",
  description: "Link in Bio - Create your own link page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main>
            {children}
        </main>
    </div>
  );
}
