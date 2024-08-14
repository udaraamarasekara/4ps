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
        Schema::create('product_classifications', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedInteger('parent_id')->default(0)->nullable();
            $table->string('name')->unique();
            $table->longText('description');
            $table->foreignId('brand_id')->constrained()->nullable();
            $table->foreignId('unit_id')->constrained()->nullable();
            $table->decimal('cost',places:2);
            $table->decimal('price',places:2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_classifications');
    }
};
