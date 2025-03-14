import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {  BreakpointObserver  } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule, MatSidenavModule, MatButtonModule, MatIconModule, MatDividerModule, CommonModule, RouterModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, private cdr: ChangeDetectorRef) {}
  isOverMode = false;

  ngAfterViewInit() {
    this.observer.observe(["(max-width: 800px)"]).subscribe((res: any) => {
      this.isOverMode = res.matches;
      this.sidenav.mode = this.isOverMode ? "over" : "side";
      this.isOverMode ? this.sidenav.close() : this.sidenav.open();
      this.cdr.detectChanges();
    });
  }
}
