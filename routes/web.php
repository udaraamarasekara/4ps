<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\ProjectClassificationController;
use App\Http\Controllers\PropertyClassificationController;
use App\Http\Controllers\ProductClassificationController;
use App\Http\Controllers\PeopleClassificationController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

   
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('transactions',[ProductController::class,'transactions'])->name('transactions');
    Route::get('transactions/search',[ProductController::class,'transactionsSearch'])->name('transactions.search');
    Route::resource('project', ProjectController::class);
    Route::resource('brand', BrandController::class);
    Route::resource('unit', UnitController::class);
    Route::resource('category', CategoryController::class);
    Route::resource('product',ProductController::class);
    Route::resource('property',PropertyController::class);
    Route::get('profitAndLost',[ProductController::class,'profitAndLost'])->name('product.profitAndLost');
    Route::get('sale',[ProductController::class,'sale'])->name('sale');
    Route::get('receive',[ProductController::class,'receive'])->name('receive');
    Route::get('thirdPartyPeopleFetch/{input}/{operation}',[PeopleController::class,'thirdPartyFetch'])->name('people.thirdPartyFetch');
    Route::resource('people',PeopleController::class);
    Route::get('productClassificationName/{input}',[ProductClassificationController::class,'getName'])->name('productClassification.getName');
    Route::get('productPriceCostVariation',[ProductClassificationController::class,'priceCostVariation'])->name('productClassification.priceCostVariation');
    Route::get('productPriceCostVariationIndex',[ProductClassificationController::class,'priceCostVariationIndex'])->name('productClassification.priceCostVariationIndex');
    Route::get('brandFetch/{input}',[BrandController::class,'fetch'])->name('brand.fetch');
    Route::get('brandRowFetch/{input}',[BrandController::class,'fetchRow'])->name('brand.fetchRow');
    Route::get('brandCheck/{input}',[BrandController::class,'check'])->name('brand.check');
    Route::get('unitCheck/{input}',[UnitController::class,'check'])->name('unit.check');
    Route::get('unitFetch/{input}',[UnitController::class,'fetch'])->name('unit.fetch');
    Route::get('categoryCheck/{input}',[CategoryController::class,'check'])->name('category.check');
    Route::get('categoryFetch/{input}',[CategoryController::class,'fetch'])->name('category.fetch');
    Route::get('categoryRowFetch/{input}',[CategoryController::class,'fetchRow'])->name('category.fetchRow');
    Route::get('projectClassificationFetch/{input}',[ProjectClassificationController::class,'fetch'])->name('projectClassification.fetch');
    Route::post('productClassificationCostPrice',[ProductClassificationController::class,'productClassificationCostPrice'])->name('productClassificationCostPrice');
    Route::get('peopleClassification/{input}',[PeopleClassificationController::class,'fetch'])->name('peopleClassification.fetch');
    Route::get('productClassificationFetchWithUnit/{input}',[ProductClassificationController::class,'fetchWithUnit'])->name('productClassification.fetchWithUnit');
    Route::get('productClassificationFetch/{input}',[ProductClassificationController::class,'fetch'])->name('productClassification.fetch');
    Route::resource('projectClassification', ProjectClassificationController::class);
    Route::resource('productClassification', ProductClassificationController::class);
    Route::resource('propertyClassification',PropertyClassificationController::class);
    Route::resource('peopleClassification',PeopleClassificationController::class);
    Route::get('people/{input}',[PeopleController::class,'fetch'])->name('people.fetch');
    Route::get('stock',[ProductController::class,'currentStock'])->name('stock');
    Route::get('dashboard',function () { return Inertia::render('Dashboard');})->name('dashboard');

});

require __DIR__.'/auth.php';
