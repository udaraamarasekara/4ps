<?php

namespace App\Support\Tenancy;

use App\Models\Branch;
use RuntimeException;

class BranchContext
{
    private ?Branch $branch = null;

    public function set(Branch $branch): void
    {
        $this->branch = $branch;
    }

    public function branchIsSet(): bool
    {
        return $this->branch !== null;
    }

    public function id(): int
    {
        if (! $this->branch) {
            throw new RuntimeException('No branch has been selected for this request.');
        }

        return $this->branch->getKey();
    }

    public function branch(): Branch
    {
        if (! $this->branch) {
            throw new RuntimeException('No branch has been selected for this request.');
        }

        return $this->branch;
    }
}
