import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '../../../shared/services/dialog.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { catchError, EMPTY, finalize, switchMap } from 'rxjs';
import { IProduct } from '../../../shared/models/product.interface';
import { MatTableModule } from '@angular/material/table';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '../../components/table/table.component';
import { WebCreateFormComponent } from '../../../shared/web-components/create-product/create-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, TableComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private service: ProductsService = inject(ProductsService);
  private snackbar: SnackbarService = inject(SnackbarService);
  private dialog: DialogService = inject(DialogService);

  displayedColumns: string[] = ['id', 'name', 'description', 'cost', 'sku'];
  products: IProduct[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;

    this.service.getProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (products) => {
          if(products) this.products = products;
        },
        error: (err) => {
          console.error('Error fetching data:', err);
        },
      });
  }

  saveOrEdit(editionItem?: IProduct) {
    this.dialog.open(WebCreateFormComponent, {
      data: editionItem,
      config: {
        width: '100%',
        height: '100%',
      },
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((product: IProduct) => {
        if (!product) return EMPTY;
        return editionItem ? this.service.updateProduct(product) : this.service.createProduct(product) ;
      }),
      catchError(err => {
        this.snackbar.show(err.error.message || 'Error saving product!');
        return EMPTY;
      })
    ).subscribe(() => {
        this.snackbar.show(`Product ${ editionItem ? 'edited' : 'saved' } successfully!`);
        this.getProducts();
    })
  }

  delete(id: number) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: id,
      config: {
        width: '100%',
        height: '100%',
      },
    })
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((ok: boolean) => {
        if (!ok) return EMPTY;
        return this.service.deleteProduct(id);
      }),
      catchError(err => {
        this.snackbar.show(err.error.message || 'Error deleting product!');
        return EMPTY;
      })
    )
    .subscribe(() => {
      this.snackbar.show('Product deleted successfully!');
      this.getProducts();
    });
  }
  
}
