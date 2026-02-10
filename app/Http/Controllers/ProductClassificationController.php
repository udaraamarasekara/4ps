<?php

namespace App\Http\Controllers;

use App\Models\ProductClassification;
use App\Models\Property;
use App\Models\Stock;
use App\Models\Unit;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use App\Http\Requests\AddCostPriceToProdClas;
use App\Http\Requests\StoreProductClassifiactionRequest;
use App\Http\Requests\UpdateProductClassifiactionRequest;
use App\Http\Resources\ProductClassificationResource;
use App\Models\Category;
use App\Models\ProductValueVariation;
use App\Models\ProductClassificationImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
class ProductClassificationController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $productClassifications = ProductClassificationResource::collection(ProductClassification::paginate(10));
    return Inertia::render('ProductClassification', ['productClassifications' => $productClassifications]);
  }
  public function priceCostVariationIndex()
  {
    return Inertia::render('ProductPriceCostVariations');
  }
 public function priceCostVariation(Request $request)
  {  

    $request->validate(['item'=>'exists:product_classifications,name',
    'from'=>'nullable|date|before:today',
    'to'=>'nullable|date|after:from',
  ]);
  $data = ProductValueVariation::whereHas('productClassification', function ($query) use ($request) {
      $query->where('name', $request->item);
    })->whereBetween('created_at', [$request->from ?? '1970-01-01', $request->to ?? now()])->orderBy('created_at','asc')->paginate(10);
    return  response()->json($data);
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
    $rawInput = $request->validated();

    // Category
    if (isset($rawInput['category_name'])) {
      $category = Category::where('name', $rawInput['category_name'])->first();
      if ($category) {
        $rawInput['category_id'] = $category->id;
      }
      unset($rawInput['category_name']);
    }

    // Brand
    if (isset($rawInput['brand_name'])) {
      $brand = Brand::where('name', $rawInput['brand_name'])->first();
      if ($brand) {
        $rawInput['brand_id'] = $brand->id;
      }
      unset($rawInput['brand_name']);
    }

    // Unit
    if (isset($rawInput['unit_name'])) {
      $unit = Unit::where('name', $rawInput['unit_name'])->first();
      if ($unit) {
        $rawInput['unit_id'] = $unit->id;
      }
      unset($rawInput['unit_name']);
    }
   if(isset($rawInput['properties'])) {
    $properties = $rawInput['properties'];

     unset($rawInput['properties']);
    // Values
    $price = $rawInput['price'];
    $cost = $rawInput['cost'];
    $initialStock = $rawInput['initial_stock_quantity'] ?? null;
    unset($rawInput['price'], $rawInput['cost'], $rawInput['initial_stock_quantity']);

    // Handle image properly
    $image_path = null;
    if ($request->hasFile('image')) {
      $image = $request->file('image');
      $imageName = time() . '.' . $image->getClientOriginalExtension();
      $image->move(public_path('product_classifications'), $imageName);
      $image_path = 'product_classifications/' . $imageName;
    }

    // Create product classification
    $productClassification = ProductClassification::create($rawInput);

    // Attach properties
    foreach ($properties as $propertyData) {
        $property = Property::firstOrCreate(['name' => $propertyData['name'], 'value' => $propertyData['type']]);
        $productClassification->properties()->attach($property->id);
    }

    // Create value variation
    ProductValueVariation::create([
      'product_classification_id' => $productClassification->id,
      'price' => $price,
      'cost' => $cost
    ]);

    // Initial stock
    if ($initialStock) {
      Stock::create([
        'product_classification_id' => $productClassification->id,
        'quantity' => $initialStock
      ]);
    }

    // Store image path
    if ($image_path) {
      ProductClassificationImage::create([
        'product_classification_id' => $productClassification->id,
        'image_path' => $image_path
      ]);
    }

    return redirect()->back();
  }

  }
  public function fetch(string $input)
  {
    return ProductClassification::where('name', 'like', '%' . $input . '%')->orWhere('properties->name', 'like', '%' . $input . '%')->get()->pluck('name');
  }
  public function fetchWithUnit(string $input)
  {
    return ProductClassificationResource::collection(ProductClassification::

      where('name', 'like', '%' . $input . '%')
      ->get());
  }
  /**
   * Display the specified resource.
   */

  public function show(ProductClassification $productClassifications)
  {

  }
  public function getUnit(string $input)
  {
    return ProductClassification::where('name', 'like', '%' . $input . '%')->orWhere('properties->name', 'like', '%' . $input . '%')->unit?->name;
  }

 public function getName(string $input)
  {
    return ProductClassification::where('name', 'like', '%' . $input . '%')->pluck('name');
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(ProductClassification $productClassification)
  {
    return Inertia::render('EditProductClassification', ['productClassification' => new ProductClassificationResource($productClassification)]);

  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateProductClassifiactionRequest $request, ProductClassification $productClassification)
  { 
    $category_id = null;
    $brand_id = null;
    $unit_id = null;
    $rawInput = $request->validated();
    if (isset($rawInput['category_name'])) {
      $category_id = Category::where('name', $rawInput['category_name'])->first()->id;
      $rawInput['category_id'] = $category_id;
    }
    unset($rawInput['category_name']);
    if (isset($rawInput['brand_name'])) {
      $brand_id = Brand::where('name', $rawInput['brand_name'])->first()->id;
    }
    if (isset($rawInput['unit_name'])) {
      $unit_id = Unit::where('name', $rawInput['unit_name'])->first()->id;
    }
    if (isset($rawInput['cost'])) {
      $cost = $rawInput['cost'];
      ProductValueVariation::where('product_classification_id', $productClassification->id)->latest()->first()->update(['cost' => $cost]);
    }
    if (isset($rawInput['price'])) {
      $price = $rawInput['price'];
      ProductValueVariation::where('product_classification_id', $productClassification->id)->latest()->first()->update(['price' => $price]);
    }
    $image_path = null;
    if ($request->hasFile('image')) {
      $image = $request->file('image');
      $imageName = time() . '.' . $image->getClientOriginalExtension();
      $image->move(public_path('product_classifications'), $imageName);
      $image_path = 'product_classifications/' . $imageName;
    }
    if (ProductClassificationImage::where('product_classification_id', $productClassification->id)->exists()) {
      $prodClasImage = ProductClassificationImage::where('product_classification_id', $productClassification->id)->first();
      $imagePath = $prodClasImage->image_path;
      if ($image_path) {
        $prodClasImage->update(['image_path' => $image_path]);
      }
    } else {
      if ($image_path) {
        ProductClassificationImage::create([
          'product_classification_id' => $productClassification->id,
          'image_path' => $image_path
        ]);
      }
    }
   if ($image_path && isset($imagePath) && file_exists(public_path($imagePath))) { 
    unlink($image_path);
}
    if(isset($rawInput['properties'])) {
      $properties = $rawInput['properties'];
      $propertyIds = [];
      foreach ($properties as $propertyData) {
          $property = Property::firstOrCreate(['name' => $propertyData['name'], 'value' => $propertyData['value']]);
          $propertyIds[] = $property->id;
      }
      $productClassification->properties()->sync($propertyIds);
    }
    unset($rawInput['price']);
    unset($rawInput['cost']);
    unset($rawInput['brand_name']);
    unset($rawInput['unit_name']);
    isset($brand_id) && $rawInput['brand_id'] = $brand_id;
    isset($unit_id) && $rawInput['unit_id'] = $unit_id;
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

  public function productClassificationCostPrice(AddCostPriceToProdClas $request)
  {
    $rawInput = $request->validated();
    return ProductValueVariation::create(['product_classification_id' => $rawInput['id'], 'cost' => $rawInput['cost'], 'price' => $rawInput['price']]);

  }

  public function findProduct(Request $request)
  {
    $request->validate(['type' => 'required|exists:properties,value','name' => 'nullable|exists:properties,name']);
    $type = $request->input('type');
    $name = $request->input('name');
    $products = ProductClassification::whereHas('properties', function ($q) use ($type,$name) {
            $q->where([['name', 'like', '%' . $name . '%'], ['value', 'like', '%' . $type . '%']]);
        })
        ->get();
    return ProductClassificationResource::collection($products);
  }

  public function findProductView()
  {
    return Inertia::render('ProductFind');
  }

  public function getTypes(string $input,string $name=null)
  {
    if(isset($name)) {
      return Property::where('name','like','%'.$name.'%')->where('value','like','%'.$input.'%')->get()->pluck('value');
    } else {

      return Property::where('value','like','%'.$input.'%')->get()->pluck('value');
    }
 }

 public function getNames(string $input)
  {
   return Property::where('name','like','%'.$input.'%')->get()->pluck('name'); 
  }

}
