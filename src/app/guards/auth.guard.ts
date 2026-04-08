import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        // Redirection logic. For now, we'll return false, 
        // as the home page handles opening the modal if not logged in.
        // But for routes like 'crash-game', this is essential.
        return false;
      }
    }),
    tap(isAllowed => {
      if (!isAllowed) {
        // Redirection logic to prevent blank screen
        router.navigate(['/home']);
      }
    })
  );
};
