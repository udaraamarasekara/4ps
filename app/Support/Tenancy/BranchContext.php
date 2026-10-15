<?php

namespace App\Support\Tenancy;

use App\Models\Branch;
use RuntimeException;

class BranchContext
{
    private ?Branch $branch = null;

    private ?array $accessibleBranchIds = null;

    public function set(Branch $branch): void
    {
        $this->branch = $branch;
        $this->accessibleBranchIds = null;
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

    public function getAccessibleBranchIds(): array
    {
        if (! $this->branch) {
            throw new RuntimeException('No branch has been selected for this request.');
        }

        if ($this->accessibleBranchIds === null) {
            $this->accessibleBranchIds = $this->branch->getSelfAndDescendantIds();
        }

        return $this->accessibleBranchIds;
    }

    public function branch(): Branch
    {
        if (! $this->branch) {
            throw new RuntimeException('No branch has been selected for this request.');
        }

        return $this->branch;
    }
}
