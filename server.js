const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const os = require('os'); 

const app = express();
const server = http.createServer(app);

// Configura CORS para permitir solicitudes desde http://localhost:3000
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"] 
    }
});

app.use(express.static('public'));

const getCpuUsage = () => {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });
    return 100 - (100 * totalIdle / totalTick).toFixed(2);
};

const getMemoryUsage = () => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return ((totalMemory - freeMemory) / totalMemory * 100).toFixed(2);
};

const startService = (serviceName, callback) => {
    exec(`sc start ${serviceName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al iniciar el servicio: ${error.message}`);
            callback(false);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            callback(false);
            return;
        }
        console.log(`Servicio ${serviceName} iniciado correctamente.`);
        callback(true);
    });
};

const stopService = (serviceName, callback) => {
    exec(`sc stop ${serviceName}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al detener el servicio: ${error.message}`);
            callback(false);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            callback(false);
            return;
        }
        console.log(`Servicio ${serviceName} detenido correctamente.`);
        callback(true);
    });
};

const restartService = (serviceName, callback) => {
    stopService(serviceName, (success) => {
        if (success) {
            startService(serviceName, callback);
        } else {
            callback(false);
        }
    });
};

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    const getServices = () => {
        exec('sc queryex state=all', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }

            const services = [];
            const lines = stdout.split('\n');
            let service = {};

            lines.forEach(line => {
                // Extrae el nombre del servicio
                if (line.includes('NOMBRE_DE_SERVICIO:')) {
                    service.name = line.split(':')[1].trim();
                }
                if (line.includes('NOMBRE_SERVICIO:')) {
                    service.name = line.split(':')[1].trim();
                }

                // Extraer el PID (Identificador del proceso)
                if (line.includes('PID')) {
                    service.pid = line.split(':')[1].trim();
                }

                // Extraer el tipo de servicio
                if (line.includes('TIPO')) {
                    service.type = line.split(':')[1].trim();
                }

                // Extrae el estado del servicio
                if (line.includes('ESTADO')) {
                    const state = line.split(':')[1].trim();
                    if (state.includes('RUNNING')) {
                        service.state = 'RUNNING';
                    } else if (state.includes('STOPPED')) {
                        service.state = 'STOPPED';
                    } else {
                        service.state = 'FAILED';
                    }
                    services.push(service);
                    service = {}; 
                }
            });

            console.log('Servicios procesados:', services); 

            const running = services.filter(s => s.state === 'RUNNING').length;
            const stopped = services.filter(s => s.state === 'STOPPED').length;
            const failed = services.filter(s => s.state === 'FAILED').length;

            
            const cpuUsage = getCpuUsage();
            const memoryUsage = getMemoryUsage();

            // Enviar datos al cliente
            socket.emit('services', {
                services,
                running,
                stopped,
                failed,
                cpuUsage,
                memoryUsage,
            });
        });
    };

    getServices();
    setInterval(getServices, 5000);

    socket.on('startService', (serviceName) => {
        startService(serviceName, (success) => {
            if (success) {
                getServices(); 
            }
        });
    });

    socket.on('stopService', (serviceName) => {
        stopService(serviceName, (success) => {
            if (success) {
                getServices(); 
            }
        });
    });

    socket.on('restartService', (serviceName) => {
        restartService(serviceName, (success) => {
            if (success) {
                getServices(); 
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(3001, () => {
    console.log('Servidor escuchando en el puerto 3001');
});