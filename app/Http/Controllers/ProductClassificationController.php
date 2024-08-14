<?php

namespace App\Http\Controllers;

use App\Models\ProductClassification;
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
        $rawInput =$request->validated();  
        $parent_id = ProductClassification::where('name',$rawInput['parent_name'])->first()->id;
        unset($rawInput['parent_name']);
        $rawInput['parent_id']=$parent_id; 
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
