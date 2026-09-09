<?php

namespace App\Models\Concerns;

use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder): void {
            $context = app(TenantContext::class);

            if (! $context->tenantIsSet()) {
                throw new RuntimeException('Cannot query tenant-owned records without an active tenant.');
            }

            $builder->where(
                $builder->getModel()->qualifyColumn('tenant_id'),
                $context->id()
            );
        });

        static::creating(function (Model $model): void {
            $context = app(TenantContext::class);

            if ($model->tenant_id === null) {
                if (! $context->tenantIsSet()) {
                    throw new RuntimeException('Cannot create a tenant-owned record without an active tenant.');
                }

                $model->tenant_id = $context->id();
            }
        });
    }

    public function scopeForTenant(Builder $query, int $tenantId): Builder
    {
        return $query->withoutGlobalScope('tenant')->where($this->qualifyColumn('tenant_id'), $tenantId);
    }
}
