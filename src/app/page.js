import Dashboard from "../../components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-6">
        <h1 className="text-3xl font-bold mb-6">Monitoreo de Servicios</h1>
        <Dashboard />
    </div>
  );
}
