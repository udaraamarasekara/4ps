<?php

namespace App\Services\Tenancy;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantProvisioningService
{
    public function provision(array $tenantData, array $userData): array
    {
        return DB::transaction(function () use ($tenantData, $userData): array {
            $tenant = Tenant::create([
                'name' => $tenantData['name'],
                'slug' => $tenantData['slug'] ?? Str::slug($tenantData['name']).'-'.Str::lower(Str::random(5)),
                'plan' => $tenantData['plan'] ?? 'starter',
                'subscription_status' => $tenantData['subscription_status'] ?? 'trialing',
                'paid_until' => $tenantData['paid_until'] ?? now()->addDays(14),
                'is_active' => true,
            ]);

            $tenant->branches()->create([
                'name' => 'Main Branch',
                'code' => 'MAIN',
                'is_active' => true,
            ]);

            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
                'is_approved' => true,
            ]);

            $tenant->users()->attach($user, ['role' => 'owner']);

            return [$tenant, $user];
        });
    }
}
