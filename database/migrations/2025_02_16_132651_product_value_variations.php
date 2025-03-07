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
        Schema::create('product_value_variations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('price', 8, 2); // 8 total digits, 2 decimal places
            $table->decimal('cost', 8, 2); // 8 total digits, 2 decimal places
            $table->foreignId('product_classifications_id')->constrained();
            $table->softDeletes();  // Adds a `deleted_at` column

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
