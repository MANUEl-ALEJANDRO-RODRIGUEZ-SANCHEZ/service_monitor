# 🖥️ **Monitoreo de Servicios de Windows**

Monitoreo de Servicios de Windows es una aplicación web desarrollada con Next.js, Node.js y Socket.IO que permite monitorear y gestionar los servicios de una PC con Windows en tiempo real. La aplicación muestra el estado de los servicios, el uso de recursos del sistema (CPU y memoria RAM), y permite realizar acciones como iniciar, detener y reiniciar servicios directamente desde la interfaz.

---

## 🚀 Características principales

### 📊 Monitoreo en tiempo real

* Gráfica circular: Muestra el porcentaje de servicios en ejecución, detenidos y fallidos.
* Tabla de servicios: Lista todos los servicios con su nombre, estado y acciones disponibles.
* Búsqueda y ordenación: Filtra servicios por nombre y ordénalos por nombre o estado.

### ⚙️ Gestión de servicios

* Iniciar servicios: Inicia un servicio detenido.
* Detener servicios: Detiene un servicio en ejecución.
* Reiniciar servicios: Detiene y vuelve a iniciar un servicio.

### 📈 Monitoreo de recursos del sistema

* Uso de CPU: Muestra el porcentaje de uso de la CPU.
* Uso de memoria RAM: Muestra el porcentaje de uso de la memoria RAM.

### 🎨 Interfaz intuitiva

* Diseño moderno: Interfaz limpia y fácil de usar, desarrollada con Tailwind CSS.
* Modo oscuro y claro: Diseño oscuro predeterminado para una experiencia visual cómoda.

---

## 🛠️ Tecnologías utilizadas

### Frontend:

* Next.js: Framework de React para construir aplicaciones web rápidas y escalables.
* Tailwind CSS: Framework de CSS para diseñar interfaces modernas y responsivas.
* Chart.js: Librería para crear gráficos interactivos.
* Socket.IO: Comunicación en tiempo real entre el servidor y el cliente.

### Backend:

* Node.js: Entorno de ejecución para JavaScript en el servidor.
* Express.js: Framework para construir APIs y servidores web.
* Socket.IO: Comunicación en tiempo real entre el servidor y el cliente.

---

## Pruebas de ejecución

### Interfaz principal en carga
![image](https://github.com/user-attachments/assets/1bbd4019-05af-443d-a528-a6f40762f28f)

### Interfaz principal
![image](https://github.com/user-attachments/assets/b873251b-c42c-4034-bde1-82c6ff0d7d92)

### Funciones

#### **Ocultar el monitor del sistema**

Podemos ocultar el menu lateral izquierdo
![image](https://github.com/user-attachments/assets/f6d68d0b-9ba0-40f1-98c0-f66eeca4290d)

#### **Comportamiento de grafica**

Podemos hacer hover y ocultar o mostrar la categoria deseada <br/>
![image](https://github.com/user-attachments/assets/362b4721-9ea0-4678-9406-ac184a29837d)
![image](https://github.com/user-attachments/assets/0bcea585-9cc3-4701-853b-5a20cd5e114b)

#### **Ordenamiento**

Podemos ordenar la tabla por nombre y estado de ejecución 
![image](https://github.com/user-attachments/assets/316d0295-ee2b-442e-a3c6-068f6a4cd387)
![image](https://github.com/user-attachments/assets/643c64e4-9db3-480f-a69e-3878f2be30ac)
![image](https://github.com/user-attachments/assets/d0a3687d-a9ce-4251-bdfe-1e67d445e998)

#### **Detalles del servicio**

Podemos abrir un modal para ver los detalles del servicio presionando el nombre de este o el boton de información
![image](https://github.com/user-attachments/assets/9c179e3a-5962-47d4-8ee4-482f61b22d93)
![image](https://github.com/user-attachments/assets/c679b8e9-38ea-4b32-a76a-c2daaaa75399)

#### **Manipulación de servicios**

Podemos iniciar, detener y reiniciar los servicios listados con los botones del lateral derecho
![image](https://github.com/user-attachments/assets/d6856ffa-84b8-4f0e-830c-843f30ae7295)

#### **Modo claro**

![image](https://github.com/user-attachments/assets/503003cf-a900-427e-a9fa-fff1524c7595)

---

#### Autor: 
Manuel Alejandro Rodriguez Sanchez
