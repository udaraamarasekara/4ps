<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum('deal_type',['sale','receive']);
            $table->foreignId('people_id')->constrained();
            $table->decimal('total_bill', 10, 2);
            $table->json('items')->nullable();
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->foreignId('users_id')->constrained();
            $table->softDeletes();  // Adds a `deleted_at` column

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
