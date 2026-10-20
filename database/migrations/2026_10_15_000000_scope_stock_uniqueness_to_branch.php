<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stocks', function (Blueprint $table): void {
            $table->dropUnique('stocks_product_classification_id_unique');
            $table->unique(
                ['branch_id', 'product_classification_id'],
                'stocks_branch_product_classification_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('stocks', function (Blueprint $table): void {
            $table->dropUnique('stocks_branch_product_classification_unique');
            $table->unique('product_classification_id');
        });
    }
};
