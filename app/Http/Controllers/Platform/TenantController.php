<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\Tenancy\TenantProvisioningService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Platform/Tenants/Index', [
            'tenants' => Tenant::query()->withCount('users')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Platform/Tenants/Create');
    }

    public function store(Request $request, TenantProvisioningService $provisioning): RedirectResponse
    {
        $data = $request->validate([
            'tenant_name' => ['required', 'string', 'max:255'],
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'owner_password' => ['required', 'confirmed', Rules\Password::defaults()],
            'plan' => ['required', 'in:starter,professional,enterprise'],
            'paid_until' => ['nullable', 'date'],
        ]);

        [$tenant] = $provisioning->provision(
            [
                'name' => $data['tenant_name'],
                'plan' => $data['plan'],
                'paid_until' => $data['paid_until'] ?? null,
            ],
            [
                'name' => $data['owner_name'],
                'email' => $data['owner_email'],
                'password' => Hash::make($data['owner_password']),
            ]
        );

        return redirect()->route('platform.tenants.index')->with('success', "Workspace {$tenant->name} created.");
    }

    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $data = $request->validate([
            'is_active' => ['required', 'boolean'],
            'subscription_status' => ['required', 'in:trialing,active,past_due,canceled'],
            'paid_until' => ['nullable', 'date'],
        ]);

        $tenant->update($data);

        return back()->with('success', 'Workspace updated.');
    }
}
