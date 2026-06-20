/* =========================================================
   GO-LAB — Datos del catálogo de equipos
   ---------------------------------------------------------
   👉 EDITA AQUÍ TUS PRODUCTOS EN STOCK.
   Cada equipo tiene:
     id        : identificador único (texto sin espacios)
     name      : nombre del equipo
     model     : referencia / modelo
     category  : una de GOLAB_CATEGORIES (abajo)
     price     : precio o "Consultar"
     stock     : "En stock", "Bajo pedido", "Agotado"...
     desc      : descripción breve
     specs     : lista de especificaciones (texto)
     img       : ruta a una foto (ej. "assets/img/catalog/switch.jpg").
                 Déjalo en "" para usar un ícono de categoría.
   ========================================================= */

window.GOLAB_CATEGORIES = ['Redes', 'CCTV', 'Computadores', 'Servidores', 'Accesorios'];

window.GOLAB_CATALOG = [
    {
        id: 'sw-tplink-sg1024d',
        name: 'Switch 24 puertos Gigabit',
        model: 'TP-Link TL-SG1024D',
        category: 'Redes',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Switch no administrable de 24 puertos Gigabit, ideal para ampliar la red cableada de oficinas e instituciones.',
        specs: ['24 puertos RJ45 10/100/1000 Mbps', 'Carcasa metálica para rack/escritorio', 'Plug & Play, sin configuración', 'Ahorro de energía 802.3az'],
        img: ''
    },
    {
        id: 'ap-unifi-u6lite',
        name: 'Access Point WiFi 6',
        model: 'Ubiquiti UniFi U6-Lite',
        category: 'Redes',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Punto de acceso WiFi 6 de alto rendimiento para cobertura empresarial con gestión centralizada UniFi.',
        specs: ['WiFi 6 (802.11ax)', 'Doble banda 2.4 / 5 GHz', 'PoE 802.3af', 'Gestión por controlador UniFi'],
        img: ''
    },
    {
        id: 'rt-mikrotik-hex',
        name: 'Router / Firewall',
        model: 'MikroTik hEX RB750Gr3',
        category: 'Redes',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Router de 5 puertos Gigabit con RouterOS para enrutamiento, VPN y control de tráfico en redes corporativas.',
        specs: ['5 puertos Gigabit', 'RouterOS L4', 'VPN y Firewall', 'CPU dual core 880 MHz'],
        img: ''
    },
    {
        id: 'cam-hik-2cd2143',
        name: 'Cámara IP domo 4MP',
        model: 'Hikvision DS-2CD2143G2-I',
        category: 'CCTV',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Cámara IP tipo domo de 4MP con visión nocturna y detección inteligente para videovigilancia profesional.',
        specs: ['Resolución 4 MP', 'Visión nocturna IR 30 m', 'Exterior IP67', 'AcuSense / detección de personas'],
        img: ''
    },
    {
        id: 'nvr-dahua-4108',
        name: 'NVR 8 canales 4K',
        model: 'Dahua NVR4108-4KS2',
        category: 'CCTV',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Grabador de red de 8 canales con soporte 4K, acceso remoto y respaldo de grabaciones para CCTV.',
        specs: ['8 canales IP', 'Soporte hasta 8 MP / 4K', '1 bahía HDD (hasta 10 TB)', 'Acceso remoto por app'],
        img: ''
    },
    {
        id: 'lap-dell-lat3540',
        name: 'Portátil empresarial',
        model: 'Dell Latitude 3540',
        category: 'Computadores',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Portátil de gama corporativa con procesador Intel Core i5 y SSD, pensado para el trabajo diario de oficina.',
        specs: ['Intel Core i5 13ª gen', '16 GB RAM', 'SSD 512 GB NVMe', 'Pantalla 15.6" Full HD'],
        img: ''
    },
    {
        id: 'pc-hp-prodesk400',
        name: 'Desktop de oficina',
        model: 'HP ProDesk 400 G7',
        category: 'Computadores',
        price: 'Consultar',
        stock: 'Bajo pedido',
        desc: 'Equipo de escritorio confiable para puestos administrativos, con buen balance de rendimiento y precio.',
        specs: ['Intel Core i5', '8 GB RAM (ampliable)', 'SSD 512 GB', 'Windows 11 Pro'],
        img: ''
    },
    {
        id: 'lap-lenovo-e14',
        name: 'Portátil ThinkPad',
        model: 'Lenovo ThinkPad E14',
        category: 'Computadores',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Portátil robusto de la línea ThinkPad, ideal para usuarios que requieren mayor potencia y durabilidad.',
        specs: ['Intel Core i7', '16 GB RAM', 'SSD 1 TB', 'Teclado resistente a derrames'],
        img: ''
    },
    {
        id: 'srv-dell-t150',
        name: 'Servidor torre',
        model: 'Dell PowerEdge T150',
        category: 'Servidores',
        price: 'Consultar',
        stock: 'Bajo pedido',
        desc: 'Servidor en torre para pequeñas y medianas organizaciones: archivos, dominio, respaldos y aplicaciones.',
        specs: ['Intel Xeon E-2314', '16 GB RAM ECC (ampliable)', 'Almacenamiento configurable', 'iDRAC para gestión remota'],
        img: ''
    },
    {
        id: 'ups-apc-1500',
        name: 'UPS / regulador 1500VA',
        model: 'APC Back-UPS BX1500M',
        category: 'Accesorios',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Respaldo de energía para proteger equipos críticos ante cortes y variaciones de voltaje.',
        specs: ['1500 VA / 900 W', 'Regulación automática (AVR)', '10 tomas', 'Pantalla LCD de estado'],
        img: ''
    },
    {
        id: 'rack-pared-9u',
        name: 'Rack de pared 9U',
        model: 'Gabinete 19" 9U',
        category: 'Accesorios',
        price: 'Consultar',
        stock: 'En stock',
        desc: 'Gabinete de pared para organizar switches, patch panels y equipos de red de forma segura y ordenada.',
        specs: ['9 unidades de rack (9U)', 'Puerta de vidrio con llave', 'Ventilación superior', 'Capacidad estándar 19"'],
        img: ''
    }
];
