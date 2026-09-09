<?php

namespace App\Models;

use App\Models\Concerns\BelongsToBranch;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnTransaction extends Model
{
    use BelongsToTenant, BelongsToBranch;

    protected $table = 'return_transactions';
    protected $guarded = [];

    protected function casts(): array
    {
        return ['total_amount' => 'decimal:2'];
    }

    public function originalProduct(): BelongsTo { return $this->belongsTo(Product::class, 'original_product_id'); }
    public function dealer(): BelongsTo { return $this->belongsTo(Dealer::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function items(): HasMany { return $this->hasMany(ReturnItem::class); }
}
