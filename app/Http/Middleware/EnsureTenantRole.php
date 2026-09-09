<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantRole
{
    public function __construct(private TenantContext $tenantContext)
    {
    }

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $role = $request->user()?->tenants()
            ->whereKey($this->tenantContext->id())
            ->first()?->pivot?->role;

        abort_unless($role && in_array($role, $roles, true), 403);

        return $next($request);
    }
}
