import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageUtil } from '../helpers/localstorage.util';

@Component({
  selector: 'app-stop-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stop-watch.component.html',
  styleUrl: './stop-watch.component.css',
})
export class StopWatchComponent implements OnInit, OnDestroy {
  elapsedTime: number = 0;
  isRunning: boolean = false;
  intervalRef: any;

  ngOnInit(): void {
    const storedRunning = LocalStorageUtil.get('stopwatch_isRunning', null);
    const storedElapsed = LocalStorageUtil.get('stopwatch_elapsedTime', 0);
    const storedStartTime = LocalStorageUtil.get('stopwatch_startTime', 0);

    // If stopwatch was running before reload
    if (storedRunning === true && storedStartTime !== 0) {
      const currentTime = Date.now();
      // Calculate elapsed time
      const diffInSeconds = (currentTime - storedStartTime) / 1000;
      this.elapsedTime = storedElapsed + diffInSeconds;
      this.start();
    } else {
      // Not running or no stored state; reset the stopwatch
      this.elapsedTime = storedElapsed;
      this.isRunning = false;
    }
  }

  startStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start() {
    this.isRunning = true;
    const startTime = Date.now();
    LocalStorageUtil.set('stopwatch_isRunning', true);
    LocalStorageUtil.set('stopwatch_startTime', startTime);

    // Save the elapsed time when starting
    LocalStorageUtil.set('stopwatch_elapsedTime', this.elapsedTime);

    this.intervalRef = setInterval(() => {
      const startTime = LocalStorageUtil.get('stopwatch_startTime', 0);
      // Keep track of elapsed time by adding the difference from startTime
      this.elapsedTime =
        LocalStorageUtil.get('stopwatch_elapsedTime', 0) +
        (Date.now() - startTime) / 1000;
    }, 100);
  }

  private stop() {
    this.isRunning = false;
    clearInterval(this.intervalRef);

    LocalStorageUtil.set('stopwatch_isRunning', false);
    LocalStorageUtil.set('stopwatch_elapsedTime', this.elapsedTime);
  }

  reset() {
    this.isRunning = false;
    clearInterval(this.intervalRef);
    this.elapsedTime = 0;

    LocalStorageUtil.remove('stopwatch_isRunning');
    LocalStorageUtil.remove('stopwatch_startTime');
    LocalStorageUtil.remove('stopwatch_elapsedTime');
  }

  ngOnDestroy(): void {
    if (this.isRunning) {
      this.stop();
    }
  }
}
