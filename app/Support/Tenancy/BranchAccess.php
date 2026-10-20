<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Collection;

class BranchAccess
{
    public function branchesFor(User $user, Tenant $tenant): Collection
    {
        $branches = $tenant->branches()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $assignedBranchIds = $tenant->branches()
            ->where('is_active', true)
            ->whereHas('users', fn ($query) => $query->whereKey($user->id))
            ->pluck('id')
            ->all();

        $childrenByParent = $branches->groupBy('parent_id');
        $accessibleIds = [];
        $pendingIds = $assignedBranchIds;

        while ($pendingIds !== []) {
            $branchId = array_pop($pendingIds);
            if (in_array($branchId, $accessibleIds, true)) {
                continue;
            }

            $accessibleIds[] = $branchId;
            foreach ($childrenByParent->get($branchId, collect()) as $child) {
                $pendingIds[] = $child->id;
            }
        }

        return $branches->whereIn('id', $accessibleIds)->values();
    }
}
