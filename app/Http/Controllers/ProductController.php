<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\CurrentStockResource;
use App\Http\Resources\PendingsResource;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\ProductValueVariation;
use App\Models\Stock;
use App\Models\SaleItem;
use App\Utilities\StockService;
use DB;
use App\Models\Dealer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\ProductClassification;
use App\Services\Audit\AuditLogger;
use App\Models\Payment;
use App\Models\ReturnTransaction;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Dashboard');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request, AuditLogger $auditLogger)
    {
        $rawInput = $request->validated();
        $totalBill = 0;
        DB::beginTransaction();
        if ($rawInput['operation'] === 'Sale') {

            $totalBill = $this->calTotalBillForSale($rawInput['items']);
            foreach ($rawInput['items'] as $item) {
                if (StockService::checkProductAvailability($item['product_classification_id'], $item['quantity'])) {
                    try {
                        StockService::decreaseStock($item['product_classification_id'], $item['quantity']);
                    } catch (\RuntimeException $exception) {
                        DB::rollBack();
                        return response()->json(['message' => $exception->getMessage()], 409);
                    }
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
        if (($rawInput['paid_amount'] ?? 0) > $totalBill) {
            DB::rollBack();
            return response()->json(['message' => 'Paid amount cannot exceed the transaction total.'], 422);
        }
        $product = Product::create([
            'deal_type' => $rawInput['operation'] == 'Sale' ? 'sale' : 'receive',
            'total_bill' => $rawInput['total_bill'] ?? 0,
            'paid_amount' => $rawInput['paid_amount'] ?? 0,
            'users_id' => auth()->id(),
            'dealer_id' => $rawInput['dealer_id'] ?? null,
        ]);
        foreach ($rawInput['items'] as $item) {
            SaleItem::create([
                'product_classification_id' => $item['product_classification_id'],
                'quantity' => $item['quantity'],
                'product_id' => $product->id,
            ]);
        }
        if (($rawInput['paid_amount'] ?? 0) > 0) {
            Payment::create([
                'tenant_id' => $product->tenant_id,
                'branch_id' => $product->branch_id,
                'product_id' => $product->id,
                'dealer_id' => $product->dealer_id,
                'user_id' => auth()->id(),
                'direction' => $product->deal_type === 'sale' ? 'income' : 'expense',
                'amount' => $rawInput['paid_amount'],
                'method' => 'cash',
                'paid_at' => now(),
            ]);
        }
        $auditLogger->record($rawInput['operation'] === 'Sale' ? 'sale.completed' : 'stock.received', $product, [
            'item_count' => count($rawInput['items']),
            'total_bill' => $product->total_bill,
        ]);
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
            'dealer'
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
            'dealer'
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
        $sold = [];
        $received = [];
        $totalIncome = 0;
        $totalSpent = 0;
        $priceSub = DB::table('product_value_variations as pvv')
            ->select('pvv.id')
            ->whereColumn('pvv.product_classification_id', 'product_classifications.id')
            ->whereColumn('pvv.created_at', '<=', 'sale_items.created_at')
            ->orderBy('pvv.created_at', 'desc')
            ->limit(1);

        $rows = SaleItem::query()
            ->join('product_classifications', 'sale_items.product_classification_id', '=', 'product_classifications.id')
            ->join('brands', 'product_classifications.brand_id', '=', 'brands.id')
            ->join('categories', 'product_classifications.category_id', '=', 'categories.id')
            ->join('units', 'product_classifications.unit_id', '=', 'units.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('product_value_variations', 'product_value_variations.id', '=', DB::raw("({$priceSub->toSql()})"))
            ->mergeBindings($priceSub)
            ->select(
                'sale_items.quantity',
                'product_value_variations.price',
                'product_value_variations.cost',
                'products.deal_type',
                'product_classifications.name',
                'brands.name as brand',
                'categories.name as category',
                'units.name as unit'
            )
            ->get();

        foreach ($rows as $row) {
            if ($row->deal_type === 'sale') {
                $sold[$row->name]['name'] = $row->name;
                $sold[$row->name]['brand'] = $row->brand;
                $sold[$row->name]['category'] = $row->category;
                $sold[$row->name]['unit'] = $row->unit;
                $sold[$row->name]['unit_cost'] = $row->cost;
                $sold[$row->name]['unit_price'] = $row->price;
                $sold[$row->name]['quantity'] =
                    ($sold[$row->name]['quantity'] ?? 0) + $row->quantity;
                $sold[$row->name]['total_income'] =
                    ($sold[$row->name]['total_income'] ?? 0) + ($row->quantity * $row->price);
                              $totalIncome += $row->quantity * $row->price;    

                } else {
                $received[$row->name]['name'] = $row->name;
                $received[$row->name]['brand'] = $row->brand;
                $received[$row->name]['category'] = $row->category;
                $received[$row->name]['unit'] = $row->unit;
                $received[$row->name]['unit_cost'] = $row->cost;
                $received[$row->name]['unit_price'] = $row->price;
                $received[$row->name]['quantity'] =
                    ($received[$row->name]['quantity'] ?? 0) + $row->quantity;
                $received[$row->name]['total_spent'] =
                    ($received[$row->name]['total_spent'] ?? 0) + ($row->quantity * $row->cost);
                    $totalSpent += $row->quantity * $row->cost;
            }
        }

        $soldChunks = array_values(array_chunk($sold, 10));
        $receivedChunks = array_values(array_chunk($received, 10));


        return Inertia::render('ProfitAndLost', [
            'sold' => $soldChunks[0] ?? [],
            'received' => $receivedChunks[0] ?? [],
            'totalSoldPages' => count($soldChunks),
            'totalReceivedPages' => count($receivedChunks),
            'totalIncome' => $totalIncome,
            'totalSpent' => $totalSpent,
        ]);
    }

    public function profitAndLostGivenDate(Request $request)
    {
        $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date',
        ]);
        $totalIncome = 0;
        $totalSpent = 0;
        $startDate = $request->startDate;
        $endDate = $request->endDate;

        $sold = [];
        $received = [];

        // Subquery for latest price before sale date
        $priceSub = DB::table('product_value_variations as pvv')
            ->select('pvv.id')
            ->whereColumn('pvv.product_classification_id', 'product_classifications.id')
            ->whereColumn('pvv.created_at', '<=', 'sale_items.created_at')
            ->orderBy('pvv.created_at', 'desc')
            ->limit(1);

        $rows = SaleItem::query()
            ->join('product_classifications', 'sale_items.product_classification_id', '=', 'product_classifications.id')
            ->join('brands', 'product_classifications.brand_id', '=', 'brands.id')
            ->join('categories', 'product_classifications.category_id', '=', 'categories.id')
            ->join('units', 'product_classifications.unit_id', '=', 'units.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('product_value_variations', 'product_value_variations.id', '=', DB::raw("({$priceSub->toSql()})"))
            ->mergeBindings($priceSub)
            ->whereBetween('sale_items.created_at', [$startDate, $endDate])
            ->select(
                'sale_items.quantity',
                'product_value_variations.price',
                'product_value_variations.cost',
                'products.deal_type',
                'product_classifications.name',
                'brands.name as brand',
                'categories.name as category',
                'units.name as unit'
            )
            ->get();

        foreach ($rows as $row) {
            if ($row->deal_type === 'sale') {
                $sold[$row->name]['name'] = $row->name;
                $sold[$row->name]['brand'] = $row->brand;
                $sold[$row->name]['category'] = $row->category;
                $sold[$row->name]['unit'] = $row->unit;
                $sold[$row->name]['unit_cost'] = $row->cost;
                $sold[$row->name]['unit_price'] = $row->price;
                $sold[$row->name]['quantity'] =
                    ($sold[$row->name]['quantity'] ?? 0) + $row->quantity;
                $sold[$row->name]['total_income'] =
                    ($sold[$row->name]['total_income'] ?? 0) + ($row->quantity * $row->price);
                $totalIncome += $row->quantity * $row->price;    
            } else {
                $received[$row->name]['name'] = $row->name;
                $received[$row->name]['brand'] = $row->brand;
                $received[$row->name]['category'] = $row->category;
                $received[$row->name]['unit'] = $row->unit;
                $received[$row->name]['unit_cost'] = $row->cost;
                $received[$row->name]['unit_price'] = $row->price;
                $received[$row->name]['quantity'] =
                    ($received[$row->name]['quantity'] ?? 0) + $row->quantity;
                $received[$row->name]['total_spent'] =
                    ($received[$row->name]['total_spent'] ?? 0) + ($row->quantity * $row->cost);
               $totalSpent += $row->quantity * $row->cost;     
            }
        }

        $soldChunks = array_values(array_chunk($sold, 10));
        $receivedChunks = array_values(array_chunk($received, 10));

        return response()->json([
            'sold' => $soldChunks[0] ?? [],
            'received' => $receivedChunks[0] ?? [],
            'totalSoldPages' => count($soldChunks),
            'totalReceivedPages' => count($receivedChunks),
            'totalIncome' => $totalIncome,
            'totalSpent' => $totalSpent,
        ]);
    }

    public function receivedPaginate(Request $request)
    {
          $request->validate([
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
            'page' => 'required|integer|min:0',

        ]);

        $startDate = isset($request->startDate) ? $request->startDate : '1970-01-01';
        $endDate = isset($request->endDate) ? $request->endDate : now()->toDateString();
        $page = $request->integer('page') - 1;
        $received = [];

        $priceSub = DB::table('product_value_variations as pvv')
            ->select('pvv.id')
            ->whereColumn('pvv.product_classification_id', 'product_classifications.id')
            ->whereColumn('pvv.created_at', '<=', 'sale_items.created_at')
            ->orderBy('pvv.created_at', 'desc')
            ->limit(1);

        $rows = SaleItem::query()
            ->join('product_classifications', 'sale_items.product_classification_id', '=', 'product_classifications.id')
            ->join('brands', 'product_classifications.brand_id', '=', 'brands.id')
            ->join('categories', 'product_classifications.category_id', '=', 'categories.id')
            ->join('units', 'product_classifications.unit_id', '=', 'units.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('product_value_variations', 'product_value_variations.id', '=', DB::raw("({$priceSub->toSql()})"))
            ->mergeBindings($priceSub)
            ->select(
                'sale_items.quantity',
                'product_value_variations.price',
                'product_value_variations.cost',
                'product_classifications.name',
                'brands.name as brand',
                'categories.name as category',
                'units.name as unit'
            )->where('products.deal_type', 'sale')
            ->whereBetween('sale_items.created_at', [$startDate, $endDate])
            ->get();
        foreach ($rows as $row) {

            $received[$row->name]['name'] = $row->name;
            $received[$row->name]['brand'] = $row->brand;
            $received[$row->name]['category'] = $row->category;
            $received[$row->name]['unit'] = $row->unit;
            $received[$row->name]['unit_cost'] = $row->cost;
            $received[$row->name]['unit_price'] = $row->price;
            $received[$row->name]['quantity'] =
                ($received[$row->name]['quantity'] ?? 0) + $row->quantity;
            $received[$row->name]['total_spent'] =
                ($received[$row->name]['total_spent'] ?? 0) + ($row->quantity * $row->cost);
        }
        $receivedChunks = array_values(array_chunk($received, 10));
        return response()->json([
            'received' => $receivedChunks[$page] ?? [],
            'totalReceivedPages' => count($receivedChunks),
            'currentReceivedPage' => $page + 1,
        ]);
    }
     public function soldPaginate(Request $request)
    {
        $request->validate([
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
            'page' => 'required|integer|min:0',

        ]);

        $startDate = isset($request->startDate) ? $request->startDate : '1970-01-01';
        $endDate = isset($request->endDate) ? $request->endDate : now()->toDateString();
        $page = $request->integer('page') - 1;
        $sold = [];

        $priceSub = DB::table('product_value_variations as pvv')
            ->select('pvv.id')
            ->whereColumn('pvv.product_classification_id', 'product_classifications.id')
            ->whereColumn('pvv.created_at', '<=', 'sale_items.created_at')
            ->orderBy('pvv.created_at', 'desc')
            ->limit(1);

        $rows = SaleItem::query()
            ->join('product_classifications', 'sale_items.product_classification_id', '=', 'product_classifications.id')
            ->join('brands', 'product_classifications.brand_id', '=', 'brands.id')
            ->join('categories', 'product_classifications.category_id', '=', 'categories.id')
            ->join('units', 'product_classifications.unit_id', '=', 'units.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('product_value_variations', 'product_value_variations.id', '=', DB::raw("({$priceSub->toSql()})"))
            ->mergeBindings($priceSub)
            ->select(
                'sale_items.quantity',
                'product_value_variations.price',
                'product_value_variations.cost',
                'product_classifications.name',
                'brands.name as brand',
                'categories.name as category',
                'units.name as unit'
            )->where('products.deal_type', 'sale')
            ->whereBetween('sale_items.created_at', [$startDate, $endDate])
            ->get();
        foreach ($rows as $row) {

            $sold[$row->name]['name'] = $row->name;
            $sold[$row->name]['brand'] = $row->brand;
            $sold[$row->name]['category'] = $row->category;
            $sold[$row->name]['unit'] = $row->unit;
            $sold[$row->name]['unit_cost'] = $row->cost;
            $sold[$row->name]['unit_price'] = $row->price;
            $sold[$row->name]['quantity'] =
                ($sold[$row->name]['quantity'] ?? 0) + $row->quantity;
            $sold[$row->name]['total_income'] =
                ($sold[$row->name]['total_income'] ?? 0) + ($row->quantity * $row->price);
        }
        $soldChunks = array_values(array_chunk($sold, 10));
        return response()->json([
            'sold' => $soldChunks[$page] ?? [],
            'totalSoldPages' => count($soldChunks),
            'currentSoldPage' => $page + 1,
        ]);
    }

    public function pendings(string $type)
    {
        if($type !== 'income' && $type !== 'payment'){
            return redirect()->back()->with('error', 'Invalid pending type specified.');
        }
        $type = $type === 'income' ? 'sale' : 'receive';
        $pendings = PendingsResource::collection(Product::where('deal_type', '=', $type)->whereColumn('total_bill', '>', 'paid_amount')->with(['dealer'])->paginate());
      


        return Inertia::render('Pendings', [
            'pendings' => $pendings,
            'type' => $type
        ]);
    }
    
    public function showPending($id)
    {
         $transactions = Product::where('id', $id)->with([
            'productItems' => function ($q) {
                $q->with([
                    'productClassification' => function ($query) {
                        $query->with('brand', 'category', 'unit', 'latestProductValueVariation', 'image');
                    }
                ]);
            },
            'dealer'
        ])->orderBy('created_at', 'desc');


        return Inertia::render('PendingDeal', [
            'transactions' => $transactions->paginate(10),
        ]);
    }
    
    public function completePending(Request $request, AuditLogger $auditLogger)
    {
        $request->validate([
            'id' => 'required|integer|exists:products,id',
        ]);

        $product = Product::find($request->id);
        if (!$product) {
            return response()->json(['message' => 'Pending transaction not found'], 404);
        }

        $pendingAmount = $product->total_bill - $product->paid_amount;
        if ($pendingAmount <= 0) {
            return response()->json(['message' => 'No pending amount to complete'], 400);
        }

        $product->paid_amount = $product->total_bill;
        $product->save();

        Payment::create([
            'tenant_id' => $product->tenant_id,
            'branch_id' => $product->branch_id,
            'product_id' => $product->id,
            'dealer_id' => $product->dealer_id,
            'user_id' => auth()->id(),
            'direction' => $product->deal_type === 'sale' ? 'income' : 'expense',
            'amount' => $pendingAmount,
            'method' => 'cash',
            'paid_at' => now(),
        ]);
        $auditLogger->record('payment.completed', $product, ['amount' => $pendingAmount]);

        return response()->json(['message' => 'Pending transaction completed successfully'], 200);
    }

    public function returnTransaction(Request $request, AuditLogger $auditLogger)
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'reason' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_classification_id' => ['required', 'integer', 'exists:product_classifications,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
        ]);

        return DB::transaction(function () use ($data, $auditLogger) {
            $product = Product::with('productItems')->findOrFail($data['product_id']);
            $originalQuantities = $product->productItems->groupBy('product_classification_id')->map(fn ($items) => $items->sum('quantity'));
            $total = 0;

            $return = ReturnTransaction::create([
                'original_product_id' => $product->id,
                'dealer_id' => $product->dealer_id,
                'user_id' => auth()->id(),
                'type' => $product->deal_type,
                'total_amount' => 0,
                'reason' => $data['reason'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $quantity = (float) $item['quantity'];
                abort_unless($quantity <= (float) ($originalQuantities[$item['product_classification_id']] ?? 0), 422, 'Return quantity exceeds the original transaction.');
                $variation = ProductValueVariation::where('product_classification_id', $item['product_classification_id'])->latest()->first();
                $unitAmount = (float) ($product->deal_type === 'sale' ? ($variation?->price ?? 0) : ($variation?->cost ?? 0));
                $return->items()->create([
                    'product_classification_id' => $item['product_classification_id'],
                    'quantity' => $quantity,
                    'unit_amount' => $unitAmount,
                ]);
                $total += $quantity * $unitAmount;
                if ($product->deal_type === 'sale') {
                    StockService::increaseStock($item['product_classification_id'], $quantity, 'sale_return');
                } else {
                    StockService::decreaseStock($item['product_classification_id'], $quantity, 'receive_return');
                }
            }

            $return->update(['total_amount' => $total]);
            $auditLogger->record('return.completed', $return, ['original_product_id' => $product->id, 'total_amount' => $total]);

            return response()->json(['message' => 'Return processed successfully', 'return_id' => $return->id]);
        });
    }
    
}