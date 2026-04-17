import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private ambientAudio: HTMLAudioElement | null = null;
  private flyAwayAudio: HTMLAudioElement | null = null;

  isMuted = signal(localStorage.getItem('sound_muted') === 'true');

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    if (typeof Audio !== 'undefined') {
      this.ambientAudio = new Audio('assets/sounds/ambient.mp3');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.5;

      this.flyAwayAudio = new Audio('assets/sounds/fly-away.mp3');
      this.flyAwayAudio.volume = 0.7;
    }
  }

  setFlight(playing: boolean, multiplier: number = 1.0) {
    if (!this.ambientAudio || this.isMuted()) return;

    if (playing) {
      if (this.ambientAudio.paused) {
        this.ambientAudio.currentTime = 0;
        this.ambientAudio.play().catch(e => console.log('Audio play blocked:', e));
      }
      // Dynamic pitch shifting based on multiplier
      // Standard engine pitch starts at 1, goes up slightly as multiplier grows
      const pitch = Math.min(1 + (multiplier - 1) * 0.1, 2.5);
      this.ambientAudio.playbackRate = pitch;
    } else {
      this.ambientAudio.pause();
    }
  }

  playFlyAway() {
    if (!this.flyAwayAudio || this.isMuted()) return;
    console.log('🔊 Playing Fly Away sound...');
    // Skip the first 3.8 seconds (fine-tuned in milliseconds)
    this.flyAwayAudio.currentTime = 3.7;
    this.flyAwayAudio.play().catch(e => console.log('Audio play blocked:', e));
  }

  stopAll() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    }
    if (this.flyAwayAudio) {
      this.flyAwayAudio.pause();
      this.flyAwayAudio.currentTime = 0;
    }
  }

  toggleMute() {
    const newState = !this.isMuted();
    this.isMuted.set(newState);
    localStorage.setItem('sound_muted', newState.toString());

    if (newState) {
      this.stopAll();
    }
  }
}
