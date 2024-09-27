<?php

namespace App\Http\Controllers;

use App\Models\ProductClassification;
use App\Models\Unit;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductClassifiactionRequest;
use App\Http\Requests\UpdateProductClassifiactionRequest;
use App\Http\Resources\ProductClassificationResource;
use Inertia\Inertia;
use Inertia\Response;
class ProductClassificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productClassifications = ProductClassificationResource::collection(ProductClassification::paginate(10));
        return Inertia::render('ProductClassification',['productClassifications'=>$productClassifications]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('NewProductClassification');

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductClassifiactionRequest $request)
    {
        $parent_id;
        $rawInput =$request->validated();  
        if(isset($rawInput['parent_name']))
        {
            $parent_id = ProductClassification::where('name',$rawInput['parent_name'])->first()->id;
            $rawInput['parent_id']=$parent_id; 
        }
        unset($rawInput['parent_name']);
        $brand_id=Brand::where('name',$rawInput['brand_name'])->first()->id;
        $unit_id=Unit::where('name',$rawInput['unit_name'])->first()->id;
        unset($rawInput['brand_name']);
        unset($rawInput['unit_name']);
        $rawInput['brand_id']=$brand_id;
        $rawInput['unit_id']=$unit_id;
      
        ProductClassification::create($rawInput);
        return back();
    }

    public function fetch(string $input)
    {
       return ProductClassification::where('name','like','%'.$input.'%')->orWhere('description','like','%'.$input.'%')->get()->pluck('name');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductClassifiaction $productClassifiaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductClassifiaction $productClassifiaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductClassifiactionRequest $request, ProductClassifiaction $productClassifiaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductClassifiaction $productClassifiaction)
    {
        //
    }

}
