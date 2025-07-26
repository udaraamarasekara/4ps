<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\People;
use Illuminate\Support\Facades\DB;
class PeopleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $people =  [
            ['name' => 'Customer','email'=>'Customer@example.com','address'=>'Colombo 07','photo'=>'https://picsum.photos/200/300'],
            ['name' => 'Supplier','email'=>'Supplier@example.com','address'=>'Colombo 08','photo'=>'https://picsum.photos/200/300'],
            ['name' => 'Employee','email'=>'Employee@example.com','address'=>'Colombo 09','photo'=>'https://picsum.photos/200/300'],

        ];

        foreach($people as $ppl)
        {
        People::create($ppl);
        }

        DB::table('people_user_roles')->insert([
            ['rolable_type' => 'App\Models\People::class', 'rolable_id' => 1,'people_classification_id' => 1],
            ['rolable_type' => 'App\Models\People::class', 'rolable_id' => 2,'people_classification_id' => 2],
            ['rolable_type' => 'App\Models\People::class', 'rolable_id' => 3,'people_classification_id' => 3],

        ]);
    }
}
