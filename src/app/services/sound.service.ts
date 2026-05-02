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

  /**
   * Unlocks audio on iOS/iPhone. 
   * Needs to be called on a user interaction (like first click).
   */
  unlockAudio() {
    if (this.ambientAudio && this.ambientAudio.paused) {
      // Play and immediately pause to unlock the context
      this.ambientAudio.play().then(() => {
        this.ambientAudio?.pause();
        console.log('🔓 SoundService: Audio unlocked for iOS');
      }).catch(e => console.log('Audio unlock failed:', e));
    }
  }

  // State to track if sounds were playing before backgrounding
  private wasAmbientPlaying = false;

  pauseAll() {
    console.log('🔇 SoundService: Pausing all audio');
    if (this.ambientAudio) {
      this.wasAmbientPlaying = !this.ambientAudio.paused;
      this.ambientAudio.pause();
      this.ambientAudio.volume = 0; // Double insurance
    }
    if (this.flyAwayAudio) {
      this.flyAwayAudio.pause();
      this.flyAwayAudio.volume = 0;
    }
  }

  resumeAll() {
    if (this.isMuted()) return;
    
    // Only resume if we were actually playing something that should loop
    if (this.ambientAudio && this.wasAmbientPlaying) {
      console.log('🔊 SoundService: Resuming ambient audio');
      this.ambientAudio.volume = 0.5;
      this.ambientAudio.play().catch(e => console.log('Resume blocked:', e));
    }
  }

  setFlight(playing: boolean, multiplier: number = 1.0) {
    if (!this.ambientAudio || this.isMuted()) return;

    if (playing) {
      if (this.ambientAudio.paused) {
        this.ambientAudio.currentTime = 0;
        this.ambientAudio.play().catch(e => console.log('Audio play blocked:', e));
      }
      const pitch = Math.min(1 + (multiplier - 1) * 0.1, 2.5);
      this.ambientAudio.playbackRate = pitch;
    } else {
      this.ambientAudio.pause();
      this.wasAmbientPlaying = false;
    }
  }

  playFlyAway() {
    if (!this.flyAwayAudio || this.isMuted()) return;
    console.log('🔊 Playing Fly Away sound...');
    this.flyAwayAudio.currentTime = 3.7;
    this.flyAwayAudio.play().catch(e => console.log('Audio play blocked:', e));
  }

  stopAll() {
    console.log('🛑 SoundService: Stopping ALL audio immediately');
    this.wasAmbientPlaying = false;
    
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio.playbackRate = 1.0;
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
