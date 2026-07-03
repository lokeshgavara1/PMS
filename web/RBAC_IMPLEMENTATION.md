# Role-Based Access Control (RBAC) Implementation

## Overview
Complete RBAC system implemented for CUTM-PMS with 6 roles, granular permissions, and enforcement at component and page levels.

## Roles & Permissions

### 1. **Admin** (Full Access)
- ✓ Create, Edit, Delete users
- ✓ Access admin panel
- ✓ View all reports
- ✓ Create, Edit, Delete projects
- ✓ Create, Edit, Delete tasks
- ✓ Assign tasks to users
- ✓ Approve submissions
- ✓ View all users
- ✓ Export data

### 2. **HOD** (Department Manager)
- ✓ Create, Edit users (in department)
- ✓ Access admin panel
- ✓ View reports
- ✓ Create, Edit projects
- ✗ Cannot delete projects
- ✓ Create, Edit tasks
- ✗ Cannot delete tasks
- ✓ Assign tasks
- ✓ Approve submissions
- ✓ View all users in department
- ✗ Cannot export data

### 3. **Faculty**
- ✗ Cannot create/edit users
- ✗ Cannot access admin panel
- ✓ View reports
- ✓ Create, Edit projects
- ✗ Cannot delete projects
- ✓ Create, Edit tasks
- ✗ Cannot delete tasks
- ✓ Assign tasks
- ✓ Approve submissions (for students)
- ✗ Cannot view all users
- ✗ Cannot export data

### 4. **Project Manager (PM)**
- ✗ Cannot create/edit users
- ✗ Cannot access admin panel
- ✓ View reports
- ✓ Create, Edit projects
- ✗ Cannot delete projects
- ✓ Create, Edit tasks
- ✗ Cannot delete tasks
- ✓ Assign tasks
- ✗ Cannot approve submissions
- ✗ Cannot view all users
- ✓ Export data

### 5. **Student**
- ✗ No create permissions
- ✗ Cannot access admin panel
- ✗ Cannot view reports
- ✗ Cannot create projects/tasks
- ✗ Cannot assign tasks
- ✗ Cannot approve submissions
- ✗ Cannot view all users
- ✗ Cannot export data
- ✓ Can view assigned tasks
- ✓ Can update own profile

### 6. **Guest** (Read-Only)
- ✗ No create, edit, delete permissions
- ✓ Can view public content
- ✓ Can read-only access

---

## Implementation

### Hook: `useRole()` - `web/src/hooks/useRole.ts`

```typescript
import { useRole } from '../hooks';

export function MyComponent() {
  const { 
    role,              // Current user's role
    user,              // Current user object
    permissions,       // Role permissions object
    hasRole,          // Function to check if user has specific role(s)
    can               // Function to check specific permission
  } = useRole();

  // Check specific permission
  if (permissions.canCreateProject) {
    // Show create button
  }

  // Check if user has specific role
  if (hasRole(['admin', 'hod'])) {
    // Show admin menu
  }

  // Check single permission
  if (can('canDeleteUser')) {
    // Show delete button
  }
}
```

### Component: `RoleBasedRoute` - `web/src/components/RoleBasedRoute.tsx`

```typescript
import RoleBasedRoute from '../components/RoleBasedRoute';

// Wrap protected routes
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <RoleBasedRoute requiredRoles={['admin', 'hod']}>
        <AdminPanel />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>
```

---

## Protected Pages

| Page | Required Roles | What It Does |
|------|---|---|
| `/admin` | admin, hod | Admin panel with user management |
| `/projects` | All authenticated | Create, view, manage projects |
| `/dashboard` | All authenticated | View dashboard with role-specific content |
| `/reports` | faculty, pm, hod, admin | View analytics & reports |
| `/my-tasks` | All authenticated | View assigned tasks |
| `/profile` | All authenticated | View/edit own profile |

---

## Components with Role-Based Features

### AdminPanel (`AdminPanel.tsx`)
- ✓ Create User button - Hidden for non-admins
- ✓ Edit User button - Hidden if no edit permission
- ✓ Delete User button - Hidden if no delete permission

### ProjectsPage (`ProjectsPage.tsx`)
- ✓ "+ New Project" button - Hidden if can't create projects
- ✓ Shows permission message for students/guests

### Dashboard (`DashboardPage.tsx`)
- ✓ Shows role-specific stats
- ✓ Hides features user doesn't have access to

### Sidebar (`Sidebar.tsx`)
- ✓ Admin menu item - Only shown for admin/hod users
- ✓ Nav items vary by role

---

## Usage Examples

### 1. Show button only for admins
```typescript
import { useRole } from '../hooks';

export function UserManagement() {
  const { permissions } = useRole();

  return (
    <>
      {permissions.canCreateUser && (
        <button onClick={() => setShowForm(true)}>
          + Create User
        </button>
      )}
    </>
  );
}
```

### 2. Protect entire page
```typescript
import RoleBasedRoute from '../components/RoleBasedRoute';

export function App() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <RoleBasedRoute requiredRoles={['admin']}>
            <AdminPanel />
          </RoleBasedRoute>
        </ProtectedRoute>
      }
    />
  );
}
```

### 3. Check multiple roles
```typescript
const { hasRole } = useRole();

if (hasRole(['admin', 'hod', 'faculty'])) {
  // Show management features
}
```

### 4. Show conditional content
```typescript
const { permissions } = useRole();

return (
  <>
    {permissions.canEditProject ? (
      <button onClick={handleEdit}>Edit</button>
    ) : (
      <span className="text-gray-400">No edit permission</span>
    )}
  </>
);
```

---

## Testing RBAC

### Login as Different Roles
Use demo users from LoginPage:
- Admin: `admin@cutm.ac.in` / `password123` → Full access
- HOD: `hod.cse@cutm.ac.in` / `password123` → Admin + Department access
- Faculty: `faculty1@cutm.ac.in` / `password123` → Create/View projects
- PM: `pm@cutm.ac.in` / `password123` → Project management access
- Student: `student1@cutm.ac.in` / `password123` → Limited access

### What to Check
1. **Admin Menu** - Only appears for admin/hod roles
2. **Create Buttons** - Hidden for students/guests
3. **Admin Panel** - Redirects non-admins to dashboard
4. **Edit/Delete** - Buttons hidden based on permissions
5. **Permission Messages** - Shows when feature not available

---

## How to Add New Permissions

1. **Update `useRole.ts`**
   ```typescript
   interface RolePermissions {
     canNewFeature: boolean;
     // ...
   }

   const rolePermissions: Record<SystemRole, RolePermissions> = {
     admin: { canNewFeature: true },
     hod: { canNewFeature: true },
     faculty: { canNewFeature: false },
     // ...
   };
   ```

2. **Use in Component**
   ```typescript
   const { permissions } = useRole();
   
   if (permissions.canNewFeature) {
     // Show feature
   }
   ```

---

## Backend Integration (Future)

Currently RBAC is frontend-only with mock data. For production:

1. **API Authorization**
   - Backend validates role for each endpoint
   - Returns 403 Forbidden if user lacks permission

2. **Example: POST /users endpoint**
   ```typescript
   http.post(`${API_BASE}/users`, async (info) => {
     const user = getCurrentUser(info); // From auth token
     
     // Check permission
     if (user.system_role !== 'admin') {
       return sendError(403, 'FORBIDDEN', 'Only admins can create users');
     }
     
     // Create user...
   });
   ```

3. **Add role validation to all mutation endpoints**

---

## Current Status: ✅ COMPLETE

- [x] Role definitions and permissions matrix
- [x] useRole() hook for permission checking
- [x] RoleBasedRoute component for page protection
- [x] Sidebar role-based menu items
- [x] AdminPanel role-based button visibility
- [x] ProjectsPage role-based creation
- [x] Demo users for testing each role

All pages now properly restrict features and navigation based on user role!
