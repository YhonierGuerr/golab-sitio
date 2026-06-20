/* =========================================================
   GO-LAB — Configuración
   ---------------------------------------------------------
   MODO DEMOSTRACIÓN (por defecto): el Panel guarda los datos
   en ESTE navegador (localStorage). Sirve para probar todo ya.

   PARA USAR LA BASE DE DATOS REAL (Supabase):
   1) Crea tu proyecto en https://supabase.com (gratis).
   2) Copia la URL y la "anon key" del proyecto y pégalas abajo.
   3) Sigue la guía: GUIA-BASE-DE-DATOS.md
   ========================================================= */
window.GOLAB_CONFIG = {
    SUPABASE_URL: '',       // ej: 'https://abcdxyz.supabase.co'
    SUPABASE_ANON_KEY: '',  // tu clave pública "anon"

    // Contraseña SOLO para el modo demostración. ¡Cámbiala!
    // (Con Supabase se usará un inicio de sesión real y seguro.)
    DEMO_PASSWORD: 'golab2026'
};
