
import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import 'jquery.fancytree';
import { IFancytreeOptions } from '../../interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';
import { nodeChildrenAsMap } from '@angular/router/src/utils/tree';



@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html',
  styleUrls: ['./fancy-tree.component.scss']
})
export class FancyTreeComponent implements AfterViewInit, OnInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() enrolledDate: any;
  @Input() public options: IFancytreeOptions;
  @Output() public itemSelect: EventEmitter<
    Fancytree.FancytreeNode
  > = new EventEmitter();
  date: Date;

  ngOnInit() {
    _.forEach(this.nodes, topic => {
      topic['expanded'] = true;
      if (this.enrolledDate) {
        topic.startDate = this.addDate(topic.model.activitystart);
        topic.endDate = this.addDate(topic.model.activityend);
        topic.title = topic.title + '<span class="date">' + topic.startDate + ' - ' + topic.endDate + '</span>';

        _.forEach(topic.children, child => {
          if (child.children.length) {
            child['startDate'] = this.addDate(child.model.activitystart);
            child['endDate'] = this.addDate(child.model.activityend);
            child['title'] = child.title + '<span class="date">' + child.startDate + '-' + child.endDate + '</span>';
          }


        });
      }

    });
  }

  addDate(day) {
    return moment(this.enrolledDate).add(day, 'days').format('D MMMM YYYY');
  }
  ngAfterViewInit() {
    let flag = true;
    let options: IFancytreeOptions = {
      extensions: ['glyph'],
      clickFolderMode: 3,
      source: this.nodes,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'fa fa-folder-o fa-lg',
          folderOpen: 'fa fa-folder-open-o fa-lg'
        }
      },
      renderNode:  (event, data) => {
        // Optionally tweak data.node.span
        if (flag) {
          if (data.node.data.activityType) {
            $(data.node.span).append(
            '<span class=\'activitytypeicon fas fa-' +
              data.node.data.activityType +
              '\'></span>'
          );
         }
        }
      },
      click: (event, data): boolean => {
        flag = false;
        const node = data.node;
        this.itemSelect.emit(node);
        return true;
      }
    };
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
  }
}
