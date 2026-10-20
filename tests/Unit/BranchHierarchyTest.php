<?php

namespace Tests\Unit;

use App\Models\Branch;
use App\Models\ProductClassification;
use App\Models\Stock;
use App\Models\Tenant;
use App\Models\User;
use App\Support\Tenancy\BranchAccess;
use App\Support\Tenancy\BranchContext;
use App\Support\Tenancy\TenantContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class BranchHierarchyTest extends TestCase
{
    use RefreshDatabase;

    private function createTenant(): Tenant
    {
        $tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant-'.Str::random(5),
            'plan' => 'starter',
            'subscription_status' => 'active',
            'is_active' => true,
        ]);

        app(TenantContext::class)->set($tenant);

        return $tenant;
    }

    public function test_highest_level_branch_has_parent_id_zero(): void
    {
        $tenant = $this->createTenant();

        $parentBranch = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Headquarters',
            'code' => 'HQ',
            'is_active' => true,
        ]);

        $this->assertEquals(0, $parentBranch->parent_id);
        $this->assertNull($parentBranch->parent);
    }

    public function test_child_branch_belongs_to_parent_branch(): void
    {
        $tenant = $this->createTenant();

        $parent = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Headquarters',
            'code' => 'HQ',
            'is_active' => true,
        ]);

        $child = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $parent->id,
            'name' => 'Regional Office',
            'code' => 'REG1',
            'is_active' => true,
        ]);

        $grandchild = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $child->id,
            'name' => 'Local Sub-Branch',
            'code' => 'SUB1',
            'is_active' => true,
        ]);

        $this->assertEquals($parent->id, $child->parent_id);
        $this->assertEquals($parent->id, $child->parent->id);

        $descendants = $parent->getAllDescendantIds();
        $this->assertEqualsCanonicalizing([$child->id, $grandchild->id], $descendants);

        $selfAndDescendants = $parent->getSelfAndDescendantIds();
        $this->assertEqualsCanonicalizing([$parent->id, $child->id, $grandchild->id], $selfAndDescendants);
    }

    public function test_higher_level_branch_can_access_child_branch_data(): void
    {
        $tenant = $this->createTenant();

        $parent = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'HQ',
            'code' => 'HQ',
            'is_active' => true,
        ]);

        $child = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $parent->id,
            'name' => 'Branch A',
            'code' => 'BRA',
            'is_active' => true,
        ]);

        $grandchild = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $child->id,
            'name' => 'Sub Branch A1',
            'code' => 'BRA1',
            'is_active' => true,
        ]);

        $pc1 = ProductClassification::create(['tenant_id' => $tenant->id, 'name' => 'Item 1']);
        $pc2 = ProductClassification::create(['tenant_id' => $tenant->id, 'name' => 'Item 2']);
        $pc3 = ProductClassification::create(['tenant_id' => $tenant->id, 'name' => 'Item 3']);

        // Create stock in parent branch
        app(BranchContext::class)->set($parent);
        $stockHQ = Stock::create([
            'tenant_id' => $tenant->id,
            'branch_id' => $parent->id,
            'product_classification_id' => $pc1->id,
            'quantity' => 10,
        ]);

        // Create stock in child branch
        app(BranchContext::class)->set($child);
        $stockChild = Stock::create([
            'tenant_id' => $tenant->id,
            'branch_id' => $child->id,
            'product_classification_id' => $pc2->id,
            'quantity' => 20,
        ]);

        // Create stock in grandchild branch
        app(BranchContext::class)->set($grandchild);
        $stockGrandchild = Stock::create([
            'tenant_id' => $tenant->id,
            'branch_id' => $grandchild->id,
            'product_classification_id' => $pc3->id,
            'quantity' => 30,
        ]);

        // When active context is HQ (higher level branch), we must be able to query data of HQ AND all children
        app(BranchContext::class)->set($parent);
        $stocksFromHQ = Stock::all();
        $this->assertCount(3, $stocksFromHQ);
        $this->assertEqualsCanonicalizing(
            [$stockHQ->id, $stockChild->id, $stockGrandchild->id],
            $stocksFromHQ->pluck('id')->all()
        );

        // When active context is child branch, we see child AND grandchild data, but NOT HQ data
        app(BranchContext::class)->set($child);
        $stocksFromChild = Stock::all();
        $this->assertCount(2, $stocksFromChild);
        $this->assertEqualsCanonicalizing(
            [$stockChild->id, $stockGrandchild->id],
            $stocksFromChild->pluck('id')->all()
        );

        // When active context is leaf branch, we see only leaf branch data
        app(BranchContext::class)->set($grandchild);
        $stocksFromGrandchild = Stock::all();
        $this->assertCount(1, $stocksFromGrandchild);
        $this->assertEquals([$stockGrandchild->id], $stocksFromGrandchild->pluck('id')->all());
    }

    public function test_user_assigned_to_parent_branch_can_select_active_descendants(): void
    {
        $tenant = $this->createTenant();
        $user = User::factory()->create();
        $root = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Headquarters',
            'code' => 'HQ',
            'is_active' => true,
        ]);
        $parent = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $root->id,
            'name' => 'Main Branch',
            'code' => 'MAIN',
            'is_active' => true,
        ]);
        $child = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $parent->id,
            'name' => 'Matara',
            'code' => 'MAT',
            'is_active' => true,
        ]);
        $sibling = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $root->id,
            'name' => 'Another Branch',
            'code' => 'OTHER',
            'is_active' => true,
        ]);
        $parent->users()->attach($user);

        $accessibleBranches = app(BranchAccess::class)->branchesFor($user, $tenant);

        $this->assertEqualsCanonicalizing(
            [$parent->id, $child->id],
            $accessibleBranches->pluck('id')->all()
        );
        $this->assertNotContains($root->id, $accessibleBranches->pluck('id')->all());
        $this->assertNotContains($sibling->id, $accessibleBranches->pluck('id')->all());
    }

    public function test_product_stock_is_tracked_separately_per_branch(): void
    {
        $tenant = $this->createTenant();
        $parent = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Headquarters',
            'code' => 'HQ',
            'is_active' => true,
        ]);
        $child = Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => $parent->id,
            'name' => 'Regional Office',
            'code' => 'REG',
            'is_active' => true,
        ]);
        $productClassification = ProductClassification::create([
            'tenant_id' => $tenant->id,
            'name' => 'Shared Product',
        ]);

        app(BranchContext::class)->set($parent);
        Stock::create([
            'tenant_id' => $tenant->id,
            'product_classification_id' => $productClassification->id,
            'quantity' => 10,
        ]);

        app(BranchContext::class)->set($child);
        Stock::create([
            'tenant_id' => $tenant->id,
            'product_classification_id' => $productClassification->id,
            'quantity' => 5,
        ]);

        $this->assertDatabaseCount('stocks', 2);

        app(BranchContext::class)->set($parent);
        $this->assertSame(15.0, (float) Stock::where('product_classification_id', $productClassification->id)->sum('quantity'));

        app(BranchContext::class)->set($child);
        $this->assertSame(5.0, (float) Stock::where('product_classification_id', $productClassification->id)->sum('quantity'));
    }

    public function test_tenant_cannot_have_more_than_one_top_level_branch(): void
    {
        $tenant = $this->createTenant();

        Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'First Root Branch',
            'code' => 'ROOT1',
            'is_active' => true,
        ]);

        $this->expectException(\InvalidArgumentException::class);

        Branch::create([
            'tenant_id' => $tenant->id,
            'parent_id' => 0,
            'name' => 'Second Root Branch',
            'code' => 'ROOT2',
            'is_active' => true,
        ]);
    }
}
