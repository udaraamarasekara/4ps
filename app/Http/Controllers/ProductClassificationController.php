<?php

namespace App\Http\Controllers;

use App\Models\ProductClassification;
use App\Models\Unit;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductClassifiactionRequest;
use App\Http\Requests\UpdateProductClassifiactionRequest;
use App\Http\Resources\ProductClassificationResource;
use App\Models\Category;
use App\Models\ProductValueVariation;
use Inertia\Inertia;
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
        $category_id=null;
        $rawInput =$request->validated();  
        if(isset($rawInput['category_name']))
        {
            $category_id = Category::where('name',$rawInput['category_name'])->first()->id;
            $rawInput['category_id']=$category_id; 
        }
        unset($rawInput['category_name']);

        $brand_id = Brand::where('name', $rawInput['brand_name'])->first()->id;
        $rawInput['brand_id'] = $brand_id;

        unset($rawInput['brand_name']);

        $unit_id = Unit::where('name', $rawInput['unit_name'])->first()->id;
        $rawInput['unit_id'] = $unit_id;

        unset($rawInput['unit_name']);


        $price = $rawInput['price'];
        $cost =  $rawInput['cost'];
        unset($rawInput['price']);
        unset($rawInput['cost']);
        $productClassification = ProductClassification::create($rawInput);
        ProductValueVariation::create(['product_classifications_id'=>$productClassification->id,'price'=>$price,'cost'=>$cost]);
        return back();
    }

    public function fetch(string $input)
    {
       return ProductClassification::where('name','like','%'.$input.'%')->orWhere('properties->name','like','%'.$input.'%')->get()->pluck('name');
    }
    public function fetchWithUnit(string $input)
    {
        return ProductClassification::select(
            'product_classifications.name',
            'product_classifications.id',
            'brands.name as brand',
            'units.name as unit'
        )
        ->leftJoin('brands', 'product_classifications.brand_id', '=', 'brands.id')
        ->leftJoin('units', 'product_classifications.unit_id', '=', 'units.id')
        ->where('product_classifications.name', 'like', '%'.$input.'%')
        ->orWhere('product_classifications.properties->name', 'like', '%'.$input.'%')
        ->with('latestProductValueVariation')->get();   
     }
    /**
     * Display the specified resource.
     */
  
    public function show(ProductClassification $productClassifications)
    {
        
    }
    public function getUnit(string $input)
    {
     return  ProductClassification::where('name','like','%'.$input.'%')->orWhere('properties->name','like','%'.$input.'%')->unit?->name;
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductClassification $productClassification)
    {
        return Inertia::render('EditProductClassification',['productClassification'=> new ProductClassificationResource($productClassification)]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductClassifiactionRequest $request,ProductClassification $productClassification)
    {
        $category_id=null;
        $brand_id=null;
        $unit_id=null;
        $rawInput =$request->validated();  
        if(isset($rawInput['category_name']))
        {
            $category_id = Category::where('name',$rawInput['category_name'])->first()->id;
            $rawInput['category_id']=$category_id; 
        }
        unset($rawInput['category_name']);
        if(isset($rawInput['brand_name']))
        {
          $brand_id=Brand::where('name',$rawInput['brand_name'])->first()->id;
        }
        if(isset($rawInput['unit_name']))
        {
         $unit_id=Unit::where('name',$rawInput['unit_name'])->first()->id;
        }
        if(isset($rawInput['cost']))
        {
            $cost =  $rawInput['cost'];
            ProductValueVariation::where('product_classifications_id',$productClassification->id)->latest()->first()->update(['cost'=>$cost]);
        }
        if(isset($rawInput['price']))
        {
            $price =  $rawInput['price'];
            ProductValueVariation::where('product_classifications_id',$productClassification->id)->latest()->first()->update(['price'=>$price]);
        }
        unset($rawInput['price']);
        unset($rawInput['cost']);
        unset($rawInput['brand_name']);
        unset($rawInput['unit_name']);
        isset($brand_id) && $rawInput['brand_id']=$brand_id;
        isset($unit_id) && $rawInput['unit_id']=$unit_id;
        $productClassification->update($rawInput);
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductClassification $productClassification)
    {
      $productClassification->delete();
    }

}
