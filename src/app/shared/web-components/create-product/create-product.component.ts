import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject, Input, signal, Signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductType } from '../../models/product.interface';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'web-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, TitleCasePipe, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './create-product.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebCreateFormComponent {
  private fb = inject(FormBuilder);
  public editing: boolean = false;
  public types: ProductType[] = ['furniture', 'equipment', 'stationary', 'part'];

  public form: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    description: ['', Validators.required],
    cost: [0, Validators.required],
    sku: ['', Validators.required],
    profile: this.fb.group({
      type: ['furniture', Validators.required],
      available: [true, Validators.required],
      backlog: [0],
      customProperties: this.fb.array([]),
    }),
  });

  public customPropertiesSignal = signal(this.getCustomProperties().controls);
  public profileSignal = signal(this.form.get('profile') as FormGroup);

  constructor(
    protected dialogRef: MatDialogRef<WebCreateFormComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: any
  ) {
    if (data && Object.keys(data).length > 0) {
      this.initializeForm(data);
      this.editing = true;
    }
  }

  private initializeForm(data: any): void {
    this.form.patchValue({
      ...data,
      profile: {
        ...data.profile,
        type: data.profile.type || 'furniture',
        available: data.profile.available || false,
        backlog: data.profile.backlog || 0,
      },
    });

    const propsArray = this.getCustomProperties();
    if (data.profile?.customProperties?.length) {
      data.profile.customProperties.forEach((prop: any) => {
        const fieldGroup = this.createFieldGroup(prop);
        fieldGroup.get('key')?.disable();
        propsArray.push(fieldGroup);
      });
    }

    this.form.get('sku')?.disable();
    this.updateCustomPropertiesSignal();
  }

  public save(confirm: boolean): void {
    if (confirm) {
      const requestBody = this.form.getRawValue();
      requestBody.profile.customProperties = this.getCustomProperties().value;
      this.dialogRef.close(requestBody);
    } else {
      this.dialogRef.close(null);
    }
  }

  public addField(event:any): void {
    event.preventDefault();
    this.getCustomProperties().push(this.createFieldGroup());
    this.updateCustomPropertiesSignal();
  }

  public removeField(index: number): void {
    this.getCustomProperties().removeAt(index);
    this.updateCustomPropertiesSignal();
  }

  private getCustomProperties(): FormArray {
    return this.form.get('profile.customProperties') as FormArray;
  }

  private updateCustomPropertiesSignal(): void {
    const customProperties = this.getCustomProperties();
    this.customPropertiesSignal.set(customProperties.controls);
  }

  private createFieldGroup(prop: any = { key: '', value: '' }): FormGroup {
    return this.fb.group({
      key: [prop.key],
      value: [prop.value],
    });
  }
}

