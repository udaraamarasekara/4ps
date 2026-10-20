<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Support\Tenancy\BranchAccess;
use App\Support\Tenancy\TenantContext;
use App\Support\Tenancy\BranchContext;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'workspace' => fn () => app(TenantContext::class)->tenantIsSet() ? [
                'current' => app(TenantContext::class)->tenant(),
                'branches' => app(BranchAccess::class)->branchesFor(
                    $request->user(),
                    app(TenantContext::class)->tenant()
                )->map(fn ($branch) => $branch->only(['id', 'name', 'code'])),
                'activeBranch' => app(BranchContext::class)->branchIsSet() ? app(BranchContext::class)->branch() : null,
            ] : null,
            'tenantRole' => fn () => $request->user() && app(TenantContext::class)->tenantIsSet()
                ? $request->user()->tenants()->whereKey(app(TenantContext::class)->id())->first()?->pivot?->role
                : null,
        ];
    }
}
