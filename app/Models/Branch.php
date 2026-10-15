<?php

namespace App\Models;

use App\Models\Concerns\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Branch extends Model
{
    use HasFactory, BelongsToTenant;

    protected static function booted(): void
    {
        static::creating(function (Branch $branch): void {
            if ((int) $branch->parent_id === 0 && $branch->tenant_id) {
                $exists = static::where('tenant_id', $branch->tenant_id)->where('parent_id', 0)->exists();
                if ($exists) {
                    throw new \InvalidArgumentException('Only one top-level branch (parent_id: 0) is allowed per customer/tenant.');
                }
            }
        });
    }

    protected $fillable = ['tenant_id', 'parent_id', 'name', 'code', 'address', 'is_active'];

    protected function casts(): array
    {
        return [
            'parent_id' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'parent_id')->where('id', '!=', 0);
    }

    public function children()
    {
        return $this->hasMany(Branch::class, 'parent_id');
    }

    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    /**
     * Get all child and sub-child branch IDs recursively.
     */
    public function getAllDescendantIds(): array
    {
        $ids = [];
        $children = $this->children()->get();
        foreach ($children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $child->getAllDescendantIds());
        }
        return array_values(array_unique($ids));
    }

    /**
     * Get self ID along with all recursive descendant branch IDs.
     */
    public function getSelfAndDescendantIds(): array
    {
        return array_merge([$this->id], $this->getAllDescendantIds());
    }
}
