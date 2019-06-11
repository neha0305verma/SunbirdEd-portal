import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ghost2',
  templateUrl: './ghost2.component.html',
  styleUrls: ['./ghost2.component.scss']
})
export class Ghost2Component implements OnInit {
  @Input() ghosts2: any[];

  constructor() { }

  ngOnInit() {
  }

}
