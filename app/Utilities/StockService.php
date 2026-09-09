<?php

namespace App\Utilities;

use App\Models\Stock;
use App\Models\StockMovement;
use App\Support\Tenancy\BranchContext;
use RuntimeException;

class StockService
{
    public static function initializeProductForStock(int $productClassificationId, float $quantity): Stock
    {
        $stock = Stock::create([
            'product_classification_id' => $productClassificationId,
            'quantity' => $quantity,
        ]);

        self::recordMovement($stock, 'receive', $quantity);

        return $stock;
    }

    public static function checkProductAvailability(int $productClassificationId, float $quantity): bool
    {
        return (float) Stock::where('product_classification_id', $productClassificationId)->value('quantity') >= $quantity;
    }

    public static function increaseStock(int $productClassificationId, float $quantity, string $movementType = 'receive'): Stock
    {
        $stock = Stock::where('product_classification_id', $productClassificationId)
            ->lockForUpdate()
            ->firstOrFail();

        $stock->increment('quantity', $quantity);
        $stock->refresh();
        self::recordMovement($stock, $movementType, $quantity);

        return $stock;
    }

    public static function decreaseStock(int $productClassificationId, float $quantity, string $movementType = 'sale'): Stock
    {
        $stock = Stock::where('product_classification_id', $productClassificationId)
            ->lockForUpdate()
            ->first();

        if (! $stock || (float) $stock->quantity < $quantity) {
            throw new RuntimeException('Insufficient stock.');
        }

        $stock->decrement('quantity', $quantity);
        $stock->refresh();
        self::recordMovement($stock, $movementType, -$quantity);

        return $stock;
    }

    private static function recordMovement(Stock $stock, string $type, float $quantity): void
    {
        StockMovement::create([
            'tenant_id' => $stock->tenant_id,
            'branch_id' => app(BranchContext::class)->id(),
            'stock_id' => $stock->id,
            'product_classification_id' => $stock->product_classification_id,
            'user_id' => auth()->id(),
            'type' => $type,
            'quantity' => $quantity,
            'balance_after' => $stock->quantity,
            'created_at' => now(),
        ]);
    }
}