<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use Inertia\Inertia;
use Inertia\Response;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request)
    {
      $rawInput =$request->validated();  
      Brand::create($rawInput); 
    }

    public function fetch(string $input)
    {
       $addNewBrand = false; 
       $request = new StoreBrandRequest();
       if($request->authorize()) 
       {
        $addNewBrand= true;
       }
       return [$addNewBrand,Brand::where('name','like','%'.$input.'%')->get()->pluck('name')];
    }

    public function check(string $input)
    {
      return Brand::where('name',$input)->count();
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        //
    }
}
