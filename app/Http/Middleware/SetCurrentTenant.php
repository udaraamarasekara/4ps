<?php

namespace App\Http\Middleware;

use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentTenant
{
    public function __construct(private TenantContext $tenantContext)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $tenant = $request->user()?->tenants()->where('tenants.is_active', true)->first();

        abort_unless($tenant, 403, 'Your account is not assigned to an active workspace.');

        $this->tenantContext->set($tenant);

        return $next($request);
    }
}
