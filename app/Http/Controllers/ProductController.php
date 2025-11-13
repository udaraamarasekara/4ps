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
use Illuminate\Session\Store;
use Inertia\Inertia;
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

        DB::beginTransaction();
        if ($rawInput['third_party']['table'] == 'People') {
            $rawInput['third_party']['peopleable_id'] = People::where('name', $rawInput['third_party']['user_name'])->first()->id;
            $rawInput['third_party']['peopleable_type'] = 'App\Models\People';
        } elseif ($rawInput['third_party']['table'] == 'Company') {
            $rawInput['third_party']['peopleable_id'] = User::where('name', $rawInput['third_party']['user_name'])->first()->id;
            $rawInput['third_party']['peopleable_type'] = 'App\Models\User';
        }
        if ($rawInput['operation'] === 'Sale') {

            $rawInput['total_bill'] = $this->calTotalBillForSale($rawInput['items']);
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
            $rawInput['total_bill'] = $this->calTotalBillForReceive($rawInput['items']);
            foreach ($rawInput['items'] as $item) {
                if (Stock::where('product_classification_id', $item['product_classification_id'])->exists()) {
                    StockService::increaseStock($item['product_classification_id'], $item['quantity']);

                } else {
                    StockService::initializeProductForStock($item['product_classification_id'], $item['quantity']);

                }
            }
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
            $product = ProductValueVariation::where('product_classifications_id', $item['product_classification_id'])->latest()->first();
            $price = $product->price ?? 0;
            $total += $item['quantity'] * $price;
        }

        return $total;

    }

    private function calTotalBillForReceive($items)
    {
        $total = 0;
        foreach ($items as $item) {
            $product = ProductValueVariation::where('product_classifications_id', $item['product_classification_id'])->latest()->first();
            $cost = $product->cost ?? 0;
            $total += $item['quantity'] * $cost;
        }

        return $total;
    }


    public function transactions(array $filters = [])
    {
        $transactions = Product::with('items')->orderBy('created_at', 'desc');

        if (isset($filters['startDate']) && isset($filters['endDate'])) {
            $transactions->whereBetween('created_at', [$filters['startDate'], $filters['endDate']]);
        }

        if (isset($filters['type']) && in_array($filters['type'], ['sale', 'receive'])) {
            $transactions->where('deal_type', $filters['type']);
        }
// dd($transactions->first()->items);
        // if (isset($filters['name'])) {
            // $transactions->whereHas('productClassifications', function ($query) use ($filters) {
            //     $query->where('name', 'like', '%' . 'tikiri mari'. '%');
            // });
        // }
        
        
        return Inertia::render('Transactions', [
            'transactions' => $transactions->paginate(10),
            'filters' => $filters,
        ]);
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
}
