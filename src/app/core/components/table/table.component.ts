import { TitleCasePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatIconModule, TitleCasePipe, MatButtonModule, MatProgressSpinnerModule, MatTooltipModule, MatPaginatorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableComponent implements OnInit, OnChanges {
  @Input({ required: true }) displayedColumns: string[] = [];
  @Input({ required: true }) dataSource: any[] = [];
  @Input() loading: boolean = true;
  @Output() details: EventEmitter<number> = new EventEmitter<number>();
  @Output() edit: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Output() create: EventEmitter<void> = new EventEmitter<void>();

  editing: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSourceWithPaginator: MatTableDataSource<any> = new MatTableDataSource<any>();

  ngOnInit(): void {
    this.displayedColumns = [...this.displayedColumns, 'actions'];
    this.dataSourceWithPaginator.data = this.dataSource;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dataSource']) {
      this.dataSourceWithPaginator.data = this.dataSource;
      this.dataSourceWithPaginator.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    this.dataSourceWithPaginator.paginator = this.paginator;
  }

  filter(name: string) {
    this.dataSourceWithPaginator.filter = name.trim().toLowerCase();
  }
}

