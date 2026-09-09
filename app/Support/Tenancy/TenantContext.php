<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;
use RuntimeException;

class TenantContext
{
    private ?Tenant $tenant = null;

    public function set(Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function tenant(): Tenant
    {
        if ($this->tenant === null) {
            throw new RuntimeException('No tenant has been selected for this request.');
        }

        return $this->tenant;
    }

    public function tenantIsSet(): bool
    {
        return $this->tenant !== null;
    }

    public function id(): int
    {
        return $this->tenant()->getKey();
    }

    public function clear(): void
    {
        $this->tenant = null;
    }
}
