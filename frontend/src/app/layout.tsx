import './globals.css';
import ThemeProvider from '@/components/providers/ThemeProvider';
import MainLayout from '@/components/layout/MainLayout';
import QueryProvider from '@/components/providers/QueryProvider';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
          <MainLayout>
            {children}
          </MainLayout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}