import "./globals.css";
import ReduxProvider from "./provider/ReduxProvider";

export const metadata = {
  title: "Vetox AI",
  description: "Chat with Vetox AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
