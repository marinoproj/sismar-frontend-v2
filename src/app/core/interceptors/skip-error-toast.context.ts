import { HttpContextToken } from '@angular/common/http';

/** Marca uma requisição para não exibir o toast global de erro (ex.: um 404 que representa um estado válido, não uma falha). */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);
