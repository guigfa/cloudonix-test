import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { of, throwError } from 'rxjs';
import { ProductsService } from './products.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { WebCreateFormComponent } from '../../../shared/web-components/create-product/create-product.component';
import { IProduct } from '../../../shared/models/product.interface';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getProducts', 'createProduct', 'updateProduct', 'deleteProduct']);
    const dialogServiceSpy = jasmine.createSpyObj('DialogService', ['open']);
    const snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
    snackbarService = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }] as IProduct[];
    productsService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should handle error when fetching products', () => {
    const consoleSpy = spyOn(console, 'error');
    productsService.getProducts.and.returnValue(throwError(() => new Error('Error fetching data')));

    component.ngOnInit();

    expect(productsService.getProducts).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', jasmine.any(Error));
  });

  it('should save a new product', () => {
    const mockProduct = { id: 1, name: 'New Product' } as IProduct;
    dialogService.open.and.returnValue(of(mockProduct));
    productsService.createProduct.and.returnValue(of(mockProduct));

    component.saveOrEdit();

    expect(dialogService.open).toHaveBeenCalledWith(WebCreateFormComponent, jasmine.any(Object));
    expect(productsService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(snackbarService.show).toHaveBeenCalledWith('Product saved successfully!');
  });

  it('should edit an existing product', () => {
    const mockProduct = { id: 1, name: 'Edited Product' } as IProduct;
    dialogService.open.and.returnValue(of(mockProduct));
    productsService.updateProduct.and.returnValue(of(mockProduct));

    component.saveOrEdit(mockProduct);

    expect(dialogService.open).toHaveBeenCalledWith(WebCreateFormComponent, jasmine.any(Object));
    expect(productsService.updateProduct).toHaveBeenCalledWith(mockProduct);
    expect(snackbarService.show).toHaveBeenCalledWith('Product edited successfully!');
  });

  it('should delete a product', () => {
    const productId = 1;
    dialogService.open.and.returnValue(of(true));
    productsService.deleteProduct.and.returnValue(of());

    component.delete(productId);

    expect(dialogService.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.any(Object));
    expect(productsService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(snackbarService.show).toHaveBeenCalledWith('Product deleted successfully!');
  });

  it('should handle error when saving a product', () => {
    const mockProduct = { id: 1, name: 'New Product' } as IProduct;
    dialogService.open.and.returnValue(of(mockProduct));
    productsService.createProduct.and.returnValue(throwError(() => new Error('Error saving product')));

    component.saveOrEdit();

    expect(dialogService.open).toHaveBeenCalledWith(WebCreateFormComponent, jasmine.any(Object));
    expect(productsService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(snackbarService.show).toHaveBeenCalledWith('Error saving product!');
  });

  it('should handle error when deleting a product', () => {
    const productId = 1;
    dialogService.open.and.returnValue(of(true));
    productsService.deleteProduct.and.returnValue(throwError(() => new Error('Error deleting product')));

    component.delete(productId);

    expect(dialogService.open).toHaveBeenCalledWith(ConfirmationDialogComponent, jasmine.any(Object));
    expect(productsService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(snackbarService.show).toHaveBeenCalledWith('Error deleting product!');
  });
});
