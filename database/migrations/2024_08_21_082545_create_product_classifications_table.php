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
            $table->unsignedInteger('category_id')->default(0)->nullable();
            $table->string('name')->unique();
            $table->longText('description');
            $table->unsignedInteger('brand_id')->nullable();
            $table->unsignedInteger('unit_id')->nullable();
          
            $table->softDeletes();  // Adds a `deleted_at` column
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
