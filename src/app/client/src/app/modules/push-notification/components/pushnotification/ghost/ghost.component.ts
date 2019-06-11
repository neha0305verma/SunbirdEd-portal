import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ghost',
  templateUrl: './ghost.component.html',
  styleUrls: ['./ghost.component.scss']
})
export class GhostComponent implements OnInit {
  @Input() ghosts: any[];
  constructor() { }

  ngOnInit() {
  }

}
