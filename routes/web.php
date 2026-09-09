<?php

use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductClassificationController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\Platform\TenantController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\TenantUserController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

   
Route::middleware(['auth', 'tenant', 'branch'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('transactions',[ProductController::class,'transactions'])->name('transactions');
    Route::get('transactions/search',[ProductController::class,'transactionsSearch'])->name('transactions.search');
    Route::resource('brand', BrandController::class);
    Route::resource('unit', UnitController::class);
    Route::resource('category', CategoryController::class);
    Route::resource('product',ProductController::class);
    Route::get('profitAndLostGivenDate',[ProductController::class,'profitAndLostGivenDate'])->name('product.profitAndLostGivenDate');
    Route::get('profitAndLost',[ProductController::class,'profitAndLost'])->name('product.profitAndLost');
    Route::get('sale',[ProductController::class,'sale'])->name('sale');
    Route::get(uri: 'dealer/{type}',action: [DealerController::class,'dealer'])->name('dealer.create');
    Route::get(uri: 'dealer/edit/{type}/{id}',action: [DealerController::class,'editDealer'])->name('dealer.edit');
    Route::put(uri: 'dealer/update/{id}',action: [DealerController::class,'updateDealer'])->name('updateDealer');
    Route::delete(uri: 'dealer/{id}',action: [DealerController::class,'deleteDealer'])->name('deleteDealer');
    Route::get('dealers/customers',action: [DealerController::class,'customers'])->name('dealers.customers');
    Route::get('dealers/suppliers',action: [DealerController::class,'suppliers'])->name('dealers.suppliers');
    Route::post('newDealer',action: [DealerController::class,'newDealer'])->name('newDealer');
    Route::get('receive',[ProductController::class,'receive'])->name('receive');
    Route::get('pendings/{type}',[ProductController::class,'pendings'])->name('pendings');
    Route::get('pending/{id}',[ProductController::class,'showPending'])->name('pending.show');
    Route::post('completePending',[ProductController::class,'completePending'])->name('completePending');
    Route::post('returns',[ProductController::class,'returnTransaction'])->name('returns.store');
    Route::get('reports/financial-summary', [ReportController::class, 'financialSummary'])->name('reports.financial-summary');
    Route::get('soldPaginate',[ProductController::class,'soldPaginate'])->name('product.soldPaginate');
    Route::get('receivedPaginate',[ProductController::class,'receivedPaginate'])->name('product.receivedPaginate');
    Route::get('productClassificationName/{input}',[ProductClassificationController::class,'getName'])->name('productClassification.getName');
    Route::get('productPriceCostVariation',[ProductClassificationController::class,'priceCostVariation'])->name('productClassification.priceCostVariation');
    Route::get('productPriceCostVariationIndex',[ProductClassificationController::class,'priceCostVariationIndex'])->name('productClassification.priceCostVariationIndex');
    Route::get('brandFetch/{input}',[BrandController::class,'fetch'])->name('brand.fetch');
    Route::get('brandRowFetch/{input}',[BrandController::class,'fetchRow'])->name('brand.fetchRow');
    Route::get('brandCheck/{input}',[BrandController::class,'check'])->name('brand.check');
    Route::get('unitCheck/{input}',[UnitController::class,'check'])->name('unit.check');
    Route::get('unitFetch/{input}',[UnitController::class,'fetch'])->name('unit.fetch');
    Route::get('categoryCheck/{input}',[CategoryController::class,'check'])->name('category.check');
    Route::get('customerFetch/{input}',[DealerController::class,'fetchCustomer'])->name('customerFetch');
    Route::get('supplierFetch/{input}',[DealerController::class,'fetchSupplier'])->name('supplierFetch');
    Route::get('categoryFetch/{input}',[CategoryController::class,'fetch'])->name('category.fetch');
    Route::get('categoryRowFetch/{input}',[CategoryController::class,'fetchRow'])->name('category.fetchRow');
    Route::post('productClassificationCostPrice',[ProductClassificationController::class,'productClassificationCostPrice'])->name('productClassificationCostPrice');
    Route::get('productClassificationFetchWithUnit/{input}',[ProductClassificationController::class,'fetchWithUnit'])->name('productClassification.fetchWithUnit');
    Route::get('productClassificationFetch/{input}',[ProductClassificationController::class,'fetch'])->name('productClassification.fetch');
    Route::resource('productClassification', ProductClassificationController::class);
    Route::get('stock',[ProductController::class,'currentStock'])->name('stock');
    Route::get('findProducts/',[ProductClassificationController::class,'findProduct'])->name('productClassification.findProduct'); 
    Route::get('findProductsView',[ProductClassificationController::class,'findProductView'])->name('productClassification.findProductView');
    Route::get('dashboard',[ProductController::class,'index'])->name('dashboard');
    Route::get('getNames/{input}',[ProductClassificationController::class,'getNames'])->name('productClassification.getNames');
    Route::get('getTypes/{input}/{name?}',[ProductClassificationController::class,'getTypes'])->name('productClassification.getTypes');
    Route::post('branches/{branch}/switch', [BranchController::class, 'switch'])->name('branches.switch');
});

Route::middleware(['auth', 'tenant', 'branch', 'tenant.role:owner,manager'])->prefix('settings')->name('settings.')->group(function () {
    Route::get('users', [TenantUserController::class, 'index'])->name('users.index');
    Route::post('users', [TenantUserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [TenantUserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [TenantUserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware(['auth', 'platform'])->prefix('platform')->name('platform.')->group(function () {
    Route::resource('tenants', TenantController::class)->only(['index', 'create', 'store', 'update']);
});

require __DIR__.'/auth.php';
