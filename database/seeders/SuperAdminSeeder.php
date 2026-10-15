<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use InvalidArgumentException;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL');
        $password = env('SUPER_ADMIN_PASSWORD');

        if (! $email || ! $password) {
            throw new InvalidArgumentException('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD before running SuperAdminSeeder.');
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('SUPER_ADMIN_NAME', 'Platform Administrator'),
                'password' => $password,
                'is_platform_admin' => true,
            ]
        );

        $user->forceFill([
            'is_approved' => true,
            'email_verified_at' => now(),
        ])->save();
    }
}