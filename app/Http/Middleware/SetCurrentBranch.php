<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\BranchContext;
use App\Support\Tenancy\BranchAccess;
use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentBranch
{
    public function __construct(
        private TenantContext $tenantContext,
        private BranchContext $branchContext,
        private BranchAccess $branchAccess,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $branches = $this->branchAccess->branchesFor($request->user(), $this->tenantContext->tenant());
        $branch = $branches->firstWhere('id', $request->session()->get('branch_id'));

        if (! $branch) {
            $branch = $branches->first();
            $request->session()->put('branch_id', $branch?->id);
        }

        abort_unless($branch, 403, 'Your workspace has no active branch.');

        $this->branchContext->set($branch);

        return $next($request);
    }
}
