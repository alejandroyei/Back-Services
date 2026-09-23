import { HttpInterceptorFn } from '@angular/common/http';

/** Adjunta el JWT de user-service a las solicitudes que requieren autenticación. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = sessionStorage.getItem('co360_access_token');
  return next(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request);
};
