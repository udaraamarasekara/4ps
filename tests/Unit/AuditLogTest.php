<?php

namespace Tests\Unit;

use App\Models\AuditLog;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_can_be_created_without_updated_at_column(): void
    {
        $tenant = Tenant::create([
            'name' => 'Test Tenant',
            'slug' => 'test-tenant-'.Str::random(5),
            'plan' => 'starter',
            'subscription_status' => 'active',
            'is_active' => true,
        ]);

        $log = AuditLog::create([
            'tenant_id' => $tenant->id,
            'user_id' => null,
            'action' => 'sale.completed',
            'auditable_type' => 'App\Models\Product',
            'auditable_id' => 7,
            'metadata' => ['item_count' => 2, 'total_bill' => 2640],
            'ip_address' => '127.0.0.1',
        ]);

        $this->assertNotNull($log->id);
        $this->assertNotNull($log->created_at);
        $this->assertEquals('sale.completed', $log->action);
    }
}
