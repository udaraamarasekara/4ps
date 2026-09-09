<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\BranchContext;
use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentBranch
{
    public function __construct(
        private TenantContext $tenantContext,
        private BranchContext $branchContext,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $branch = $this->tenantContext->tenant()->branches()
            ->where('is_active', true)
            ->when($request->session()->get('branch_id'), fn ($query, $branchId) => $query->whereKey($branchId))
            ->first();

        if (! $branch) {
            $branch = $this->tenantContext->tenant()->branches()->where('is_active', true)->first();
            $request->session()->put('branch_id', $branch?->id);
        }

        abort_unless($branch, 403, 'Your workspace has no active branch.');

        $this->branchContext->set($branch);

        return $next($request);
    }
}
