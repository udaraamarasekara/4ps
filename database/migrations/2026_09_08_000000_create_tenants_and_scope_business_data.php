<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tenantTables = [
        'properties',
        'product_classifications',
        'dealers',
        'brands',
        'units',
        'categories',
        'product_value_variations',
        'stocks',
        'products',
        'product_classification_images',
        'sale_items',
    ];

    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('tenant_user', function (Blueprint $table): void {
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('staff');
            $table->timestamps();
            $table->primary(['tenant_id', 'user_id']);
        });

        foreach ($this->tenantTables as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->foreignId('tenant_id')->nullable()->constrained()->index();
            });
        }

        Schema::table('product_classification_property', function (Blueprint $table): void {
            $table->foreignId('tenant_id')->nullable()->constrained()->index();
        });

        $tenantId = DB::table('tenants')->insertGetId([
            'name' => 'Default Workspace',
            'slug' => 'default-workspace',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($this->tenantTables as $tableName) {
            DB::table($tableName)->whereNull('tenant_id')->update(['tenant_id' => $tenantId]);
        }

        DB::table('product_classification_property')
            ->whereNull('tenant_id')
            ->update(['tenant_id' => $tenantId]);

        $users = DB::table('users')->pluck('id');
        foreach ($users as $userId) {
            DB::table('tenant_user')->insert([
                'tenant_id' => $tenantId,
                'user_id' => $userId,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('product_classification_property', function (Blueprint $table): void {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn('tenant_id');
        });

        foreach (array_reverse($this->tenantTables) as $tableName) {
            Schema::table($tableName, function (Blueprint $table): void {
                $table->dropForeign(['tenant_id']);
                $table->dropColumn('tenant_id');
            });
        }

        Schema::dropIfExists('tenant_user');
        Schema::dropIfExists('tenants');
    }
};
