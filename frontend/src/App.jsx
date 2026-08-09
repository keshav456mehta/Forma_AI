import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">
        Forma AI — Styling Foundation
      </h1>
      <p className="text-gray-700 mb-2">
        This is a placeholder page to confirm Tailwind classes apply correctly.
      </p>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
        Test Button
      </button>
    </Layout>
  );
}

export default App;