import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main style={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
  },
  main: {
    flex: 1,
    padding: "40px",
  },
};
