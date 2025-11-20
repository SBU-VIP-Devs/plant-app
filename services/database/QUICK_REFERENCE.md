# Database API Quick Reference

## Import

```typescript
import db from '../../services/database';
```

## Gardens

| Function | Description |
|----------|-------------|
| `db.gardens.createGarden(data)` | Create new garden → returns ID |
| `db.gardens.getAllGardens()` | Get all gardens → returns array |
| `db.gardens.getGardenById(id)` | Get garden by ID → returns object or null |

## Tasks

| Function | Description |
|----------|-------------|
| `db.tasks.createTask(gardenId, data)` | Create new task → returns ID |
| `db.tasks.getTasksByGarden(gardenId)` | Get all tasks in garden |
| `db.tasks.getTasksByStatus(gardenId, ['open', 'assigned'])` | Get filtered tasks |
| `db.tasks.getTaskById(gardenId, taskId)` | Get specific task |
| `db.tasks.updateTaskStatus(gardenId, taskId, 'completed')` | Update task status |

### Task User Management

| Function | Description |
|----------|-------------|
| `db.tasks.addUserToRequests(gardenId, taskId, uid)` | User requests task |
| `db.tasks.removeUserFromRequests(gardenId, taskId, uid)` | Remove from requests |
| `db.tasks.addUserToAssigned(gardenId, taskId, uid)` | Assign user to task |
| `db.tasks.removeUserFromAssigned(gardenId, taskId, uid)` | Unassign user |
| `db.tasks.addUserToPending(gardenId, taskId, uid)` | Mark pending approval from admin |
| `db.tasks.removeUserFromPending(gardenId, taskId, uid)` | Rejected by admin |
| `db.tasks.addUserToCompleted(gardenId, taskId, uid)` | Mark as completed, add hours |
| `db.tasks.removeUserFromCompleted(gardenId, taskId, uid)` | Remove from completed, remove hours |

## Users

| Function | Description |
|----------|-------------|
| `db.users.getUsernameById(uid)` | Get username (cached) |
| `db.users.getUsernamesByIds([uid1, uid2, ...])` | Get multiple usernames (batch) |
| `db.users.getUserProfile(uid)` | Get full user profile |
| `db.users.getAllProfiles()` | Get all profiles |
| `db.users.updateUserProfile(uid, data)` | Update profile (partial) |
| `db.users.addTaskToUserList(uid, taskId, data)` | Add task to user's list |

## Storage

| Function | Description |
|----------|-------------|
| `db.storage.uploadImage(path, imageUri, onProgress)` | Upload image with progress → returns URL |
| `db.storage.getDownloadURL(path)` | Get download URL |

## Auth

| Function | Description |
|----------|-------------|
| `db.auth.signIn(email, password)` | Sign in user |
| `db.auth.signUp(email, password)` | Create account |
| `db.auth.signOut()` | Sign out |
| `db.auth.signInWithGoogleCredential(idToken)` | Google OAuth |
| `db.auth.getCurrentUser()` | Get current user |
| `db.auth.onAuthStateChanged(callback)` | Listen for auth changes |

## Common Patterns

### Create Garden
```typescript
const gardenId = await db.gardens.createGarden({
  imageURL: url,
  createdAt: new Date().toISOString(),
  gardenName: 'My Garden',
  desc: 'Description',
  username: 'john',
  userId: 'uid123',
  roles: { 'uid123': 'admin' }
});
```

### Request Task
```typescript
await db.tasks.addUserToRequests(gardenId, taskId, userId);
```

### Approve Request
```typescript
await db.tasks.removeUserFromRequests(gardenId, taskId, userId);
await db.tasks.addUserToAssigned(gardenId, taskId, userId);
await db.tasks.updateTaskStatus(gardenId, taskId, 'assigned');
```

### Upload Image
```typescript
const url = await db.storage.uploadImage(
  'GardenImages/IMG_' + Date.now(),
  imageUri,
  (progress) => setProgress(progress.percentage)
);
```

### Get Usernames
```typescript
const names = await db.users.getUsernamesByIds([uid1, uid2, uid3]);
```

## Status Values

- `'open'` - Task is available
- `'assigned'` - User(s) assigned to task
- `'approval'` - Waiting for admin approval
- `'completed'` - Task completed

## For Full Documentation

See `README.md` in this directory for complete API documentation and examples.
