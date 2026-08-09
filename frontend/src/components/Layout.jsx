export default function Layout({ children }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
      {children}
    </div>
  );
}