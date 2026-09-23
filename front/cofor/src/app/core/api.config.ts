/**
 * Direcciones de los microservicios para desarrollo local.
 * En un despliegue deben apuntar a las URLs públicas de cada servicio
 * (o al API gateway si se incorpora uno).
 */
export const API_CONFIG = {
  userService: 'http://127.0.0.1:8000/api',
  companiesService: 'http://127.0.0.1:8001/api',
} as const;
