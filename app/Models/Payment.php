<?php

namespace App\Models;

use App\Models\Concerns\BelongsToBranch;
use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use BelongsToTenant, BelongsToBranch;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'paid_at' => 'datetime'];
    }

    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
    public function dealer(): BelongsTo { return $this->belongsTo(Dealer::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
