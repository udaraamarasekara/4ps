<?php

namespace App\Models\Concerns;

use App\Support\Tenancy\BranchContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

trait BelongsToBranch
{
    protected static function bootBelongsToBranch(): void
    {
        static::addGlobalScope('branch', function (Builder $builder): void {
            $context = app(BranchContext::class);

            if (! $context->branchIsSet()) {
                throw new RuntimeException('Cannot query branch-owned records without an active branch.');
            }

            $builder->where($builder->getModel()->qualifyColumn('branch_id'), $context->id());
        });

        static::creating(function (Model $model): void {
            $context = app(BranchContext::class);

            if ($model->branch_id === null) {
                if (! $context->branchIsSet()) {
                    throw new RuntimeException('Cannot create a branch-owned record without an active branch.');
                }

                $model->branch_id = $context->id();
            }
        });
    }
}
