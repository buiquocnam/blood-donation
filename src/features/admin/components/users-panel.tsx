'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilter } from './search-filter';
import { UsersTable } from './users-table';
import { CreateUserForm } from './create-user-form';
import { useAdminUsers } from '../hooks';

/**
 * Panel quản lý người dùng
 */
export function UsersPanel() {
  const {
    users,
    roles,
    isLoadingUsers,
    filter,
    setFilter,
    updateStatus,
    updateRole,
    deleteUser,
    createUser,
    isCreatingUser
  } = useAdminUsers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Quản lý người dùng</CardTitle>
          <CardDescription>
            Quản lý tất cả tài khoản người dùng trong hệ thống
          </CardDescription>
        </div>
        <CreateUserForm 
          roles={roles} 
          onCreateUser={createUser} 
          isCreating={isCreatingUser}
        />
      </CardHeader>
      <CardContent>
        <SearchFilter
          roles={roles}
          onFilterChange={setFilter}
        />
        
        {isLoadingUsers ? (
          <div className="flex justify-center py-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <UsersTable
            users={users}
            roles={roles}
            onUpdateStatus={updateStatus}
            onUpdateRole={updateRole}
            onDeleteUser={deleteUser}
          />
        )}
      </CardContent>
    </Card>
  );
} 