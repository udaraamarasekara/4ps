<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\CurrentStockResource;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\ProductValueVariation;
use App\Models\Stock;
use App\Models\SaleItem;
use App\Utilities\StockService;
use DB;
use App\Models\People;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\ProductClassification;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Product');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $rawInput = $request->validated();
        $totalBill = 0;
        DB::beginTransaction();
        if ($rawInput['third_party']['table'] == 'People') {
            $rawInput['third_party']['peopleable_id'] = People::where('name', $rawInput['third_party']['user_name'])->first()->id;
            $rawInput['third_party']['peopleable_type'] = 'App\Models\People';
        } elseif ($rawInput['third_party']['table'] == 'Company') {
            $rawInput['third_party']['peopleable_id'] = User::where('name', $rawInput['third_party']['user_name'])->first()->id;
            $rawInput['third_party']['peopleable_type'] = 'App\Models\User';
        }
        if ($rawInput['operation'] === 'Sale') {

            $totalBill = $this->calTotalBillForSale($rawInput['items']);
            foreach ($rawInput['items'] as $item) {
                if (StockService::checkProductAvailability($item['product_classification_id'], $item['quantity'])) {
                    StockService::decreaseStock($item['product_classification_id'], $item['quantity']);
                } else {
                    DB::rollBack();
                    $productClassificationName = ProductClassification::find($item['product_classification_id'])->name ?? 'Unknown';
                    $quantity = Stock::where('product_classification_id', $item['product_classification_id'])->first()->quantity ?? 0;
                    return response()->json(['message' => 'Insufficient stock for product : ' . $productClassificationName . ' (Available: ' . $quantity . ', Requested: ' . $item['quantity'] . ')'], 500);

                }
            }
        } else {
            $totalBill = $this->calTotalBillForReceive($rawInput['items']);
            foreach ($rawInput['items'] as $item) {
                if (Stock::where('product_classification_id', $item['product_classification_id'])->exists()) {
                    StockService::increaseStock($item['product_classification_id'], $item['quantity']);

                } else {
                    StockService::initializeProductForStock($item['product_classification_id'], $item['quantity']);

                }
            }
        }
        if ($totalBill != $rawInput['total_bill']) {
            DB::rollBack();
            return response()->json(['message' => 'Total bill amount mismatch. Calculated: ' . $totalBill . ', Provided: ' . $rawInput['total_bill']], 500);
        }
        $product = Product::create([
            'deal_type' => $rawInput['operation'] == 'Sale' ? 'sale' : 'receive',
            'peopleable_id' => $rawInput['third_party']['peopleable_id'] ?? null,
            'peopleable_type' => $rawInput['third_party']['peopleable_type'] ?? null,
            'total_bill' => $rawInput['total_bill'] ?? 0,
            'paid_amount' => $rawInput['paid_amount'] ?? 0,
            'users_id' => auth()->id(),
        ]);
        foreach ($rawInput['items'] as $item) {
            SaleItem::create([
                'product_classification_id' => $item['product_classification_id'],
                'quantity' => $item['quantity'],
                'product_id' => $product->id,
            ]);
        }
        DB::commit();
        return response()->json(['message' => 'Products processed successfully'], 200);
    }

    /**
     * Display the specified resource.
     */

    private function calTotalBillForSale($items)
    {
        $total = 0;
        foreach ($items as $item) {
            $product = ProductValueVariation::where('product_classification_id', $item['product_classification_id'])->latest()->first();
            $price = $product->price ?? 0;
            $total += $item['quantity'] * $price;
        }

        return $total;

    }

    private function calTotalBillForReceive($items)
    {
        $total = 0;
        foreach ($items as $item) {
            $product = ProductValueVariation::where('product_classification_id', $item['product_classification_id'])->latest()->first();
            $cost = $product->cost ?? 0;
            $total += $item['quantity'] * $cost;
        }

        return $total;
    }


    public function transactions()
    {
        $transactions = Product::with([
            'productItems' => function ($q) {
                $q->with([
                    'productClassification' => function ($query) {
                        $query->with('brand', 'category', 'unit', 'latestProductValueVariation', 'image');
                    }
                ]);
            },
            'peopleable'
        ])->orderBy('created_at', 'desc');


        return Inertia::render('Transactions', [
            'transactions' => $transactions->paginate(10),
        ]);
    }
    public function transactionsSearch(array $filters = [])
    {
        $filters = request()->validate([
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
            'type' => ['nullable', Rule::in(['sale', 'receive'])],
            'name' => 'nullable|string',
            'brand' => 'nullable|string',
            'category' => 'nullable|string',
            'property' => 'nullable|string',
        ]);
        $transactions = Product::with([
            'productItems' => function ($q) {
                $q->with([
                    'productClassification' => function ($query) {
                        $query->with('brand', 'category', 'unit', 'latestProductValueVariation', 'image');
                    }
                ]);
            },
            'peopleable'
        ])->orderBy('created_at', 'desc');


        if (isset($filters['startDate'])) {
            $transactions = $transactions->where('created_at', '>=', $filters['startDate']);
        }
        if (isset($filters['endDate'])) {
            $transactions = $transactions->where('created_at', '<=', $filters['endDate']);
        }
        if (isset($filters['type'])) {
            $transactions = $transactions->where('deal_type', $filters['type']);
        }
        // dd($transactions->first()->items);
        if (isset($filters['name'])) {
            $transactions->whereHas('productItems', function ($query) use ($filters) {

                $query->whereHas('productClassification', function ($query) use ($filters) {
                    $query->where('name', 'like', '%' . $filters['name'] . '%');
                });
            });
        }
        if (isset($filters['brand'])) {
            $transactions->whereHas('productItems', function ($query) use ($filters) {

                $query->whereHas('productClassification', function ($query) use ($filters) {
                    $query->whereHas('brand', function ($query) use ($filters) {
                        $query->where('name', 'like', '%' . $filters['brand'] . '%');
                    });
                });
            });
        }
        if (isset($filters['category'])) {
            $transactions->whereHas('productItems', function ($query) use ($filters) {

                $query->whereHas('productClassification', function ($query) use ($filters) {
                    $query->whereHas('category', function ($query) use ($filters) {
                        $query->where('name', 'like', '%' . $filters['category'] . '%');
                    });
                });
            });
        }

        return response()->json($transactions->paginate(10));
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    public function sale()
    {
        return Inertia::render('SaleAndReceive', ['operation' => 'Sale']);
    }


    public function receive()
    {
        return Inertia::render('SaleAndReceive', ['operation' => 'Receive']);
    }

    public function currentStock()
    {
        $currentStock = CurrentStockResource::collection(ProductClassification::paginate(10));
        return Inertia::render('Stock', ['currentStock' => $currentStock]);
    }

    public function profitAndLost()
    {
        $rows = SaleItem::join('product_classifications', 'sale_items.product_classification_id', '=', 'product_classifications.id')
            ->join('brands', 'product_classifications.brand_id', '=', 'brands.id')
            ->join('categories', 'product_classifications.category_id', '=', 'categories.id')
            ->join('units', 'product_classifications.unit_id', '=', 'units.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('product_value_variations', function ($join) {
                $join->on('product_value_variations.product_classification_id', '=', 'product_classifications.id')
                    ->whereRaw('product_value_variations.created_at <= sale_items.created_at')->latest('product_value_variations.created_at')->limit(1);
            })
            ->select('sale_items.id as id','sale_items.quantity as quantity', 'product_value_variations.price as price', 'products.deal_type as deal_type', 'product_value_variations.cost as cost', 'product_classifications.name as name', 'brands.name as brand', 'categories.name as category', 'units.name as unit');
            foreach ($rows->get() as $row) {
            if ($row->deal_type != 'sale') {
                $sold[$row->name]['name'] = $row->name;
                $sold[$row->name]['brand'] = $row->brand;
                $sold[$row->name]['category'] = $row->category;
                $sold[$row->name]['unit'] = $row->unit;
                $sold[$row->name]['total_income'] = ($sold[$row->name]['total_income'] ?? 0) + ($row->quantity * $row->price);
                $sold[$row->name]['unit_cost'] = $row->cost;
                $sold[$row->name]['unit_price'] = $row->price;
                $sold[$row->name]['quantity'] = ($sold[$row->name]['quantity'] ?? 0) + $row->quantity;
            } else {
                $received[$row->name]['name'] = $row->name;
                $received[$row->name]['brand'] = $row->brand;
                $received[$row->name]['category'] = $row->category;
                $received[$row->name]['unit'] = $row->unit;
                $received[$row->name]['unit_cost'] = $row->cost;
                $received[$row->name]['unit_price'] = $row->price;
                $received[$row->name]['total_spent'] = ($received[$row->name]['total_spent'] ?? 0) + ($row->quantity * $row->cost);
                $received[$row->name]['quantity'] = ($received[$row->name]['quantity'] ?? 0) + $row->quantity;
            }
          
        }
        $totSold=array_chunk($sold,10,false);
        $totReceived=array_chunk($received,10,false);
        if (!session()->has('currentSoldPage')) {
        session(['currentSoldPage'=>0,'currentReceivedPage'=>0]);
}
        return Inertia::render('ProfitAndLost', ['sold' => $totSold[session('currentSoldPage')], 'received' => $totReceived[session('currentReceivedPage')]]);
    }
}
