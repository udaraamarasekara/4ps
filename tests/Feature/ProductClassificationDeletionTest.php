<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\ProductClassification;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ProductClassificationDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_classification_can_be_deleted_with_tenant_route_binding(): void
    {
        $tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant-'.Str::random(5),
            'plan' => 'starter',
            'subscription_status' => 'active',
            'is_active' => true,
        ]);
        $user = User::factory()->create();
        $tenant->users()->attach($user, ['role' => 'owner']);

        $branch = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'is_active' => true,
        ]);
        $branch->users()->attach($user);

        $productClassification = ProductClassification::create([
            'tenant_id' => $tenant->id,
            'name' => 'Test Product',
        ]);

        $this->actingAs($user)
            ->delete(route('productClassification.destroy', $productClassification))
            ->assertOk();

        $this->assertSoftDeleted('product_classifications', [
            'id' => $productClassification->id,
        ]);
    }
}
