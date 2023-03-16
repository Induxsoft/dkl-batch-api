# Batch API

[Vea la documentación en docs.induxsoft.net](https://docs.induxsoft.net/es/api/apps/batch/)


## Instalación 
## Requisitos previos
* Tener instalado un servidor web(nginx)
* Tener Descargado devkron

## Crear base de datos de API BATCH
* Necesita de [DDM](https://github.com/Induxsoft/dkl-ddm) en la carpeta de binarios de Devkron 
* Se necesita el archivo batch-api.ddm que se encuentra en este repositorio (src/install)
* Ejecutar en line de comando el archivo batch-api.ddm como lo muestra en el repositorio de DDM
* Ejecutar el script SQL que nos proporcionó DDM, en el gestor de base de datos (MYSQL)


# Configuración
* En el archivo batch.config.dkl en la variable @batch_db especificar el nombre cualificado de una conexión de base de datos
* Coloque la carpeta batch de este repositorio hacia carpeta de binarios de Devkron
* Coloque la carpeta _protected en su host a utilizar (binarios_devkron/web/Host)


## Uso de la API BATCH
- Colocar una carpeta dentro de la carpeta batch que se encuentra dentro de la carpeta de binarios de Devkron, con el nombre del campo sys_guid 
	de la tabla jobsgroup de la base de datos antes creada.
- Crear un programa que realice cierto trabajo en la carpeta antes creada
- Invocar el servicio API BATCH con el proceso de crear un trabajo como lo muestra la documentación de la API


## Nota
Es responsabilidad del proceso por lotes de actualizar el estado del trabajo, así como también notificar a cierto tiempo el estado que se encuentra un trabajo y de mandar un mensaje de finalización cuando  culmine dicho trabajo.
