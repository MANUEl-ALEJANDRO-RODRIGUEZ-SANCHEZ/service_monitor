"use client"
import { useEffect, useState, useMemo } from "react"
import { Chart, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import io from "socket.io-client"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CpuIcon,
  HardDrive,
  Info,
  Play,
  Power,
  RefreshCw,
  Search,
  Server,
  StopCircle,
  X,
  XCircle,
} from "lucide-react"

Chart.register(ArcElement, Tooltip, Legend)

const socket = io("http://localhost:3001")

export default function Home() {
  const [services, setServices] = useState([])
  const [running, setRunning] = useState(0)
  const [stopped, setStopped] = useState(0)
  const [failed, setFailed] = useState(0)
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [cpuUsage, setCpuUsage] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    socket.on("services", (data) => {
      setServices(data.services)
      setRunning(data.running)
      setStopped(data.stopped)
      setFailed(data.failed)
      setCpuUsage(data.cpuUsage)
      setMemoryUsage(data.memoryUsage)
      setIsLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [services, searchTerm])

  const sortedServices = useMemo(() => {
    const sortableItems = [...filteredServices]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredServices, sortConfig])

  const handleRowClick = (service) => {
    setSelectedService(service)
  }

  const closeModal = () => {
    setSelectedService(null)
  }

  const handleStartService = (serviceName) => {
    socket.emit("startService", serviceName)
  }

  const handleStopService = (serviceName) => {
    socket.emit("stopService", serviceName)
  }

  const handleRestartService = (serviceName) => {
    socket.emit("restartService", serviceName)
  }

  const chartData = {
    labels: ["En ejecución", "Detenidos", "Fallidos"],
    datasets: [
      {
        label: "Servicios",
        data: [running, stopped, failed],
        backgroundColor: ["#10b981", "#f97316", "#ef4444"],
        borderColor: ["#10b981", "#f97316", "#ef4444"],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  }

  const getStateColor = (state) => {
    switch (state) {
      case "RUNNING":
        return "text-emerald-500"
      case "STOPPED":
        return "text-amber-500"
      default:
        return "text-red-500"
    }
  }

  const getStateIcon = (state) => {
    switch (state) {
      case "RUNNING":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case "STOPPED":
        return <StopCircle className="w-5 h-5 text-amber-500" />
      default:
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <aside
        className={`${showSidebar ? "w-72" : "w-0 -ml-6"} transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center">
              <Server className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span>Service Monitor</span>
            </h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center">
                  <CpuIcon className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  CPU
                </h3>
                <span className="text-lg font-bold">{cpuUsage.toFixed(2)}%</span>
              </div>
              <ProgressBar
                value={cpuUsage}
                color={cpuUsage > 80 ? "bg-red-500" : cpuUsage > 50 ? "bg-amber-500" : "bg-emerald-500"}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium flex items-center">
                  <HardDrive className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Memoria RAM
                </h3>
                <span className="text-lg font-bold">{memoryUsage}%</span>
              </div>
              <ProgressBar
                value={memoryUsage}
                color={memoryUsage > 80 ? "bg-red-500" : memoryUsage > 50 ? "bg-amber-500" : "bg-emerald-500"}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Activity className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Estado de Servicios
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>En ejecución</span>
                  </div>
                  <span className="font-bold">{running}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Detenidos</span>
                  </div>
                  <span className="font-bold">{stopped}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Fallidos</span>
                  </div>
                  <span className="font-bold">{failed}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="h-48">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-xl font-bold flex items-center">
              <Server className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Monitoreo de Servicios
            </h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 w-64"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando servicios...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                      <th
                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => requestSort("name")}
                      >
                        <div className="flex items-center">
                          <span>Nombre del Servicio</span>
                          {sortConfig.key === "name" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : null}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => requestSort("state")}
                      >
                        <div className="flex items-center">
                          <span>Estado</span>
                          {sortConfig.key === "state" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : null}
                        </div>
                      </th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedServices.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 mb-2" />
                            <p>No se encontraron servicios que coincidan con la búsqueda</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedServices.map((service, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => handleRowClick(service)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="mr-3">{getStateIcon(service.state)}</div>
                              <span className="font-medium">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                service.state === "RUNNING"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : service.state === "STOPPED"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {service.state}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleStartService(service.name)}
                                disabled={service.state === "RUNNING"}
                                className={`p-2 rounded-lg flex items-center justify-center ${
                                  service.state === "RUNNING"
                                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                }`}
                                title="Iniciar"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStopService(service.name)}
                                disabled={service.state === "STOPPED"}
                                className={`p-2 rounded-lg flex items-center justify-center ${
                                  service.state === "STOPPED"
                                    ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                }`}
                                title="Detener"
                              >
                                <Power className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRestartService(service.name)}
                                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 flex items-center justify-center"
                                title="Reiniciar"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRowClick(service)}
                                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                                title="Ver detalles"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold flex items-center">
                <Info className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Detalles del Servicio
              </h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedService.state === "RUNNING"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : selectedService.state === "STOPPED"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {selectedService.state}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">PID:</span>
                  <span>{selectedService.pid || "No disponible"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tipo de servicio:</span>
                  <span>{selectedService.type || "No disponible"}</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                {selectedService.state !== "RUNNING" && (
                  <button
                    onClick={() => {
                      handleStartService(selectedService.name)
                      closeModal()
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar
                  </button>
                )}
                {selectedService.state !== "STOPPED" && (
                  <button
                    onClick={() => {
                      handleStopService(selectedService.name)
                      closeModal()
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Detener
                  </button>
                )}
                <button
                  onClick={() => {
                    handleRestartService(selectedService.name)
                    closeModal()
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChevronLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

