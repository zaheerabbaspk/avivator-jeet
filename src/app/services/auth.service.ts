import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  // Observable tracking the current user
  user$: Observable<User | null> = authState(this.auth);

  // Simple boolean check for guards
  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  async signUp(email: string, pass: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, pass: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, pass);
      return credential.user;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    return signOut(this.auth);
  }
}
