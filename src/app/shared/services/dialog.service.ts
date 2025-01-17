import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export type AlfaDialogData = {
    data: any;
    config: MatDialogConfig;
  };

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open(component: any, alfaDialogData: AlfaDialogData): Observable<any> {
    return this.openDialog(component, {
      data: alfaDialogData.data,
      config: {
      },
    } as AlfaDialogData);
  }

  private openDialog(
    component: any,
    alfaDialogData: AlfaDialogData,
  ): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      data: alfaDialogData.data,
      autoFocus: false,
      ...alfaDialogData.config,
    });

    return dialogRef.afterClosed();
  }
}
