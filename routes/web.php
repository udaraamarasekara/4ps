<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductInstanceController;
use App\Http\Controllers\PeopleController;
use App\Http\Controllers\ProjectClassificationController;
use App\Http\Controllers\PropertyClassificationController;
use App\Http\Controllers\ProductClassificationController;
use App\Http\Controllers\PeopleClassificationController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\BrandController;
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

    Route::resource('project', ProjectController::class);
    Route::resource('brand', BrandController::class);
    Route::resource('unit', UnitController::class);
    Route::resource('product',ProductController::class);
    Route::resource('property',PropertyController::class);
    Route::resource('people',PeopleController::class);
    Route::get('brandFetch{input}',[BrandController::class,'fetch'])->name('brand.fetch');
    Route::get('brandCheck{input}',[BrandController::class,'check'])->name('brand.check');
    Route::get('unitCheck{input}',[UnitController::class,'check'])->name('unit.check');
    Route::get('productInstance',[ProductInstanceController::class,'productInstanceMainPage'])->name('productInstanceMainPage');

    Route::get('unitFetch{input}',[UnitController::class,'fetch'])->name('unit.fetch');
    Route::get('projectClassificationFetch{input}',[ProjectClassificationController::class,'fetch'])->name('projectClassification.fetch');
    Route::get('productClassificationFetch{input}',[ProductClassificationController::class,'fetch'])->name('productClassification.fetch');
    Route::resource('projectClassification', ProjectClassificationController::class);
    Route::resource('productClassification', ProductClassificationController::class);
    Route::resource('propertyClassification',PropertyClassificationController::class);
    Route::resource('peopleClassification',PeopleClassificationController::class);
    Route::get('dashboard',function () { return Inertia::render('Dashboard');})->name('dashboard');

});

require __DIR__.'/auth.php';
