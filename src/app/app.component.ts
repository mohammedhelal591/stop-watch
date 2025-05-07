import { Component } from '@angular/core';
import { StopWatchComponent } from './stop-watch/stop-watch.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StopWatchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
