import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wall-post-list',
  templateUrl: 'wall-post-list.component.html',
  styleUrls: [
    'wall-post-list.component.css'
  ]
})
export class WallPostListComponent implements OnInit {
  @Input() wallPosts: any[] = [];

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
  }
}
