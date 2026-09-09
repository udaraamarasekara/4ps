<?php

namespace App\Services\Audit;

use App\Models\AuditLog;
use App\Support\Tenancy\TenantContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuditLogger
{
    public function __construct(
        private TenantContext $tenantContext,
        private Request $request,
    ) {
    }

    public function record(string $action, Model $subject, array $metadata = []): void
    {
        AuditLog::create([
            'tenant_id' => $this->tenantContext->id(),
            'user_id' => $this->request->user()?->id,
            'action' => $action,
            'auditable_type' => $subject::class,
            'auditable_id' => $subject->getKey(),
            'metadata' => $metadata,
            'ip_address' => $this->request->ip(),
            'created_at' => now(),
        ]);
    }
}
