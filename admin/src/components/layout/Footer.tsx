export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2026 QR Tracker</p>
    </footer>
  );
}

const styles = {
  footer: {
    padding: "20px",
    textAlign: "center" as const,
    background: "#111",
    color: "#fff",
    marginTop: "auto",
  },
};
