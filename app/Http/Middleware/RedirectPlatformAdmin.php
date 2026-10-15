<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectPlatformAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_platform_admin) {
            return redirect()->route('platform.tenants.index');
        }

        return $next($request);
    }
}
