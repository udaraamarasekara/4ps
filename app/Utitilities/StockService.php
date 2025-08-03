<?php
namespace App\Utilities;
use App\Models\Stock;
 Class StockService{

public static function InitializeProductForStock(int $productClassificationId, float $quantity){
   Stock::create(['product_classification_id'=>$productClassificationId,'quantity'=>$quantity]);
}

public static function checkProductAvailability(int $productClassificationId, float $quantity): bool {
    $stock = Stock::where('product_classification_id', $productClassificationId)->first();
    return $stock && $stock->quantity >= $quantity;         
}
public static function increaseStock(int $productClassificationId, float $quantity){
    $stock = Stock::where('product_classification_id', $productClassificationId)->first();
        $stock->increment('quantity', $quantity);
}

public static function decreaseStock(int $productClassificationId, float $quantity){
    $stock = Stock::where('product_classification_id', $productClassificationId)->first();
        $stock->decrement('quantity', $quantity);
}
}