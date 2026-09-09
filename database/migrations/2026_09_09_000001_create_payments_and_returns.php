<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dealer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('direction', ['income', 'expense']);
            $table->decimal('amount', 12, 2);
            $table->string('method')->default('cash');
            $table->timestamp('paid_at');
            $table->timestamps();
            $table->index(['tenant_id', 'dealer_id', 'direction']);
        });

        Schema::create('return_transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('original_product_id')->constrained('products');
            $table->foreignId('dealer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['sale', 'receive']);
            $table->decimal('total_amount', 12, 2);
            $table->string('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('return_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('return_transaction_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_classification_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 12, 3);
            $table->decimal('unit_amount', 12, 2);
            $table->timestamps();
        });

        DB::table('products')->where('paid_amount', '>', 0)->orderBy('id')->eachById(function ($product): void {
            DB::table('payments')->insert([
                'tenant_id' => $product->tenant_id,
                'branch_id' => $product->branch_id,
                'product_id' => $product->id,
                'dealer_id' => $product->dealer_id,
                'user_id' => $product->users_id,
                'direction' => $product->deal_type === 'sale' ? 'income' : 'expense',
                'amount' => $product->paid_amount,
                'method' => 'legacy',
                'paid_at' => $product->created_at,
                'created_at' => $product->created_at,
                'updated_at' => $product->created_at,
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_items');
        Schema::dropIfExists('return_transactions');
        Schema::dropIfExists('payments');
    }
};
