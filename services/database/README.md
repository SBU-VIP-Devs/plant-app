# Database Abstraction Layer Documentation

## Overview

The database abstraction layer provides a unified, database-agnostic interface for all data operations in the Plant App. This architecture allows you to switch between different database providers (Firebase, MongoDB, PostgreSQL, etc.) without changing any component code.

## Architecture

```
services/database/
├── types.ts                    # TypeScript interfaces for all data structures
├── interface.ts                # Abstract interface contracts
├── index.ts                    # Main entry point
├── firebase/                   # Firebase implementation
│   ├── gardenService.ts       # Garden CRUD operations
│   ├── taskService.ts         # Task CRUD operations
│   ├── userService.ts         # User operations
│   ├── storageService.ts      # File storage operations
│   ├── authService.ts         # Authentication
│   └── index.ts               # Firebase service bundle
└── README.md                   # This file
```

## Getting Started

### Import the Database Service

```typescript
// In any component or screen
import db from '../../services/database';

// Now you have access to all database operations
const gardens = await db.gardens.getAllGardens();
const tasks = await db.tasks.getTasksByGarden(gardenId);
```

### TypeScript Types

All data types are defined in `types.ts` and are available for import:

```typescript
import { GardenData, TaskData, UserProfile } from '../../services/database';
```

---

## API Reference

### 1. Garden Service (`db.gardens`)

Handles all garden-related operations.

#### `createGarden(gardenData: CreateGardenInput): Promise<string>`

Creates a new garden and returns the garden ID.

**Parameters:**
```typescript
{
  imageURL: string | null,          // URL to garden image or null
  createdAt: string,                // ISO 8601 timestamp
  gardenName: string,               // Name of the garden
  desc: string,                     // Garden description
  username: string,                 // Creator's username
  userId: string | null,            // Creator's user ID
  roles: { [userId: string]: string } | null  // User roles map
}
```

**Example:**
```typescript
const gardenId = await db.gardens.createGarden({
  imageURL: 'https://example.com/image.jpg',
  createdAt: new Date().toISOString(),
  gardenName: 'Community Garden',
  desc: 'A beautiful community garden for growing vegetables',
  username: 'john_doe',
  userId: 'user123',
  roles: { 'user123': 'admin' }
});

console.log('Garden created with ID:', gardenId);
```

#### `getAllGardens(): Promise<GardenData[]>`

Retrieves all gardens from the database.

**Returns:** Array of `GardenData` objects

**Example:**
```typescript
const gardens = await db.gardens.getAllGardens();

gardens.forEach(garden => {
  console.log(garden.gardenName, garden.desc);
});
```

#### `getGardenById(gardenId: string): Promise<GardenData | null>`

Retrieves a specific garden by ID.

**Returns:** `GardenData` object or `null` if not found

**Example:**
```typescript
const garden = await db.gardens.getGardenById('garden123');

if (garden) {
  console.log('Found garden:', garden.gardenName);
} else {
  console.log('Garden not found');
}
```

---

### 2. Task Service (`db.tasks`)

Handles all task-related operations including assignment and status management.

#### `createTask(gardenId: string, taskData: CreateTaskInput): Promise<string>`

Creates a new task within a garden and returns the task ID.

**Parameters:**
```typescript
gardenId: string  // ID of the garden

taskData: {
  taskName: string,
  taskTime: string,              // "ISO_DATE ISO_DATE" format (start end)
  desc: string,
  location: string,
  gardenId: string,
  username: string,              // Task creator
  uidAssigned: string[],
  uidRequests: string[],
  uidPendingApproval: string[],
  uidCompleted: string[],
  taskStatus: 'open' | 'assigned' | 'approval' | 'completed'
}
```

**Example:**
```typescript
const taskId = await db.tasks.createTask('garden123', {
  taskName: 'Water the plants',
  taskTime: `${startDate.toISOString()} ${endDate.toISOString()}`,
  desc: 'Water all the tomato plants in section A',
  location: 'Section A',
  gardenId: 'garden123',
  username: 'john_doe',
  uidAssigned: [],
  uidRequests: [],
  uidPendingApproval: [],
  uidCompleted: [],
  taskStatus: 'open'
});
```

#### `getTasksByGarden(gardenId: string): Promise<TaskData[]>`

Retrieves all tasks for a specific garden.

**Example:**
```typescript
const tasks = await db.tasks.getTasksByGarden('garden123');
console.log(`Found ${tasks.length} tasks`);
```

#### `getTasksByStatus(gardenId: string, statuses: string[]): Promise<TaskData[]>`

Retrieves tasks filtered by status.

**Example:**
```typescript
// Get only open and assigned tasks
const activeTasks = await db.tasks.getTasksByStatus('garden123', ['open', 'assigned']);

// Get only completed tasks
const completedTasks = await db.tasks.getTasksByStatus('garden123', ['completed']);
```

#### `getTaskById(gardenId: string, taskId: string): Promise<TaskData | null>`

Retrieves a specific task by ID.

**Example:**
```typescript
const task = await db.tasks.getTaskById('garden123', 'task456');
if (task) {
  console.log('Task:', task.taskName);
}
```

#### `updateTaskStatus(gardenId: string, taskId: string, status: TaskStatus): Promise<void>`

Updates the status of a task.

**Status options:** `'open'` | `'assigned'` | `'approval'` | `'completed'`

**Example:**
```typescript
await db.tasks.updateTaskStatus('garden123', 'task456', 'completed');
```

#### User Assignment Functions

Manage which users are in various task states:

##### `addUserToRequests(gardenId: string, taskId: string, uid: string): Promise<void>`

Add a user to the task request list (user wants to sign up).

**Example:**
```typescript
await db.tasks.addUserToRequests('garden123', 'task456', 'user789');
```

##### `removeUserFromRequests(gardenId: string, taskId: string, uid: string): Promise<void>`

Remove a user from the task request list.

**Example:**
```typescript
await db.tasks.removeUserFromRequests('garden123', 'task456', 'user789');
```

##### `addUserToAssigned(gardenId: string, taskId: string, uid: string): Promise<void>`

Assign a user to the task (admin approved).

**Example:**
```typescript
// Admin approves the request
await db.tasks.removeUserFromRequests('garden123', 'task456', 'user789');
await db.tasks.addUserToAssigned('garden123', 'task456', 'user789');
await db.tasks.updateTaskStatus('garden123', 'task456', 'assigned');
```

##### `removeUserFromAssigned(gardenId: string, taskId: string, uid: string): Promise<void>`

Remove a user from assigned list.

##### `addUserToPending(gardenId: string, taskId: string, uid: string): Promise<void>`

Move user to pending approval (task completion submitted).

**Example:**
```typescript
// User marks task as complete
await db.tasks.addUserToPending('garden123', 'task456', 'user789');
await db.tasks.updateTaskStatus('garden123', 'task456', 'approval');
```

##### `removeUserFromPending(gardenId: string, taskId: string, uid: string): Promise<void>`

Remove user from pending approval.

##### `addUserToCompleted(gardenId: string, taskId: string, uid: string): Promise<void>`

Mark user as completed (admin approved completion).

**Example:**
```typescript
// Admin approves completion
await db.tasks.removeUserFromPending('garden123', 'task456', 'user789');
await db.tasks.addUserToCompleted('garden123', 'task456', 'user789');
await db.tasks.updateTaskStatus('garden123', 'task456', 'completed');
```

##### `removeUserFromCompleted(gardenId: string, taskId: string, uid: string): Promise<void>`

Remove user from completed list.

---

### 3. User Service (`db.users`)

Handles user profiles and username lookups.

#### `getUsernameById(uid: string): Promise<string>`

Get a username by user ID. Results are cached for performance.

**Returns:** Username string, or `"No Name"` if not found

**Example:**
```typescript
const username = await db.users.getUsernameById('user123');
console.log('Username:', username);
```

#### `getUsernamesByIds(uids: string[]): Promise<string[]>`

Get multiple usernames at once (batch operation).

**Example:**
```typescript
const uids = ['user123', 'user456', 'user789'];
const usernames = await db.users.getUsernamesByIds(uids);

// Returns: ['John Doe', 'Jane Smith', 'Bob Johnson']
usernames.forEach((name, index) => {
  console.log(`${uids[index]}: ${name}`);
});
```

#### `getUserProfile(uid: string): Promise<UserProfile | null>`

Get a user's full profile information.

**Returns:**
```typescript
{
  id: string,
  username?: string,
  bio?: string,
  role?: string[],
  vHours?: number,
  actvDate?: string,
  actvDet?: string,
  actvLoc?: string
}
```

**Example:**
```typescript
const profile = await db.users.getUserProfile('user123');

if (profile) {
  console.log('Bio:', profile.bio);
  console.log('Volunteer hours:', profile.vHours);
  console.log('Roles:', profile.role?.join(', '));
}
```

#### `getAllProfiles(): Promise<UserProfile[]>`

Get all user profiles.

**Example:**
```typescript
const profiles = await db.users.getAllProfiles();
console.log(`Total users: ${profiles.length}`);
```

#### `updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void>`

Update a user's profile. Only provided fields are updated.

**Example:**
```typescript
await db.users.updateUserProfile('user123', {
  bio: 'Passionate gardener and environmentalist',
  vHours: 25,
  role: ['Volunteer', 'Team Lead']
});
```

#### `addTaskToUserList(uid: string, taskId: string, taskData: UserTaskRecord): Promise<void>`

Add a task to a user's personal task list.

**Example:**
```typescript
await db.users.addTaskToUserList('user123', 'task456', {
  taskId: 'task456',
  gardenId: 'garden123',
  taskCreator: 'john_doe',
  taskDesc: 'Water the plants',
  taskEndTime: endDate.toISOString(),
  taskIsDone: false,
  taskLocation: 'Section A',
  taskName: 'Water the plants',
  taskStartTime: startDate.toISOString(),
  uidAssigned: ['user123']
});
```

---

### 4. Storage Service (`db.storage`)

Handles file uploads and downloads.

#### `uploadImage(path: string, imageUri: string, onProgress?: callback): Promise<string>`

Upload an image to storage with optional progress tracking.

**Parameters:**
- `path`: Storage path (e.g., `'GardenImages/IMG_1234567890'`)
- `imageUri`: Local file URI
- `onProgress`: Optional callback function for upload progress

**Returns:** Download URL string

**Example:**
```typescript
const storagePath = 'GardenImages/IMG_' + new Date().getTime();

const downloadURL = await db.storage.uploadImage(
  storagePath,
  imageUri,
  (progress) => {
    console.log(`Upload: ${progress.percentage}% complete`);
    console.log(`${progress.bytesTransferred} / ${progress.totalBytes} bytes`);

    // Update UI progress bar
    setUploadProgress(progress.percentage);
  }
);

console.log('Image available at:', downloadURL);
```

**Progress Callback:**
```typescript
type UploadProgressCallback = (progress: {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
}) => void;
```

#### `getDownloadURL(path: string): Promise<string>`

Get the download URL for a file.

**Example:**
```typescript
const url = await db.storage.getDownloadURL('GardenImages/IMG_1234567890');
```

---

### 5. Auth Service (`db.auth`)

Handles user authentication.

#### `signIn(email: string, password: string): Promise<User>`

Sign in with email and password.

**Example:**
```typescript
try {
  const user = await db.auth.signIn('user@example.com', 'password123');
  console.log('Signed in:', user.uid);
} catch (error) {
  console.error('Sign in failed:', error);
}
```

#### `signUp(email: string, password: string): Promise<User>`

Create a new user account.

**Example:**
```typescript
try {
  const user = await db.auth.signUp('newuser@example.com', 'password123');
  console.log('Account created:', user.uid);
} catch (error) {
  console.error('Sign up failed:', error);
}
```

#### `signOut(): Promise<void>`

Sign out the current user.

**Example:**
```typescript
await db.auth.signOut();
console.log('Signed out successfully');
```

#### `signInWithGoogleCredential(idToken: string): Promise<User>`

Sign in with Google OAuth.

**Example:**
```typescript
// After Google OAuth flow provides id_token
const user = await db.auth.signInWithGoogleCredential(idToken);
console.log('Google sign in successful:', user.email);
```

#### `getCurrentUser(): User | null`

Get the currently authenticated user.

**Example:**
```typescript
const user = db.auth.getCurrentUser();

if (user) {
  console.log('Current user:', user.email);
} else {
  console.log('No user signed in');
}
```

#### `onAuthStateChanged(callback: (user: User | null) => void): () => void`

Listen for authentication state changes.

**Returns:** Unsubscribe function

**Example:**
```typescript
// In a React component
useEffect(() => {
  const unsubscribe = db.auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User signed in:', user.email);
      setCurrentUser(user);
    } else {
      console.log('User signed out');
      setCurrentUser(null);
    }
  });

  // Cleanup on unmount
  return () => unsubscribe();
}, []);
```

---

## Complete Usage Examples

### Example 1: Creating a Garden with Image Upload

```typescript
import db from '../../services/database';

async function createGardenWithImage(
  gardenName: string,
  description: string,
  imageUri: string
) {
  try {
    // 1. Upload image first
    const storagePath = 'GardenImages/IMG_' + new Date().getTime();
    const imageURL = await db.storage.uploadImage(
      storagePath,
      imageUri,
      (progress) => {
        console.log(`Upload: ${progress.percentage}%`);
      }
    );

    // 2. Create garden record
    const user = db.auth.getCurrentUser();
    const gardenId = await db.gardens.createGarden({
      imageURL,
      createdAt: new Date().toISOString(),
      gardenName,
      desc: description,
      username: user?.displayName || 'Unknown',
      userId: user?.uid || null,
      roles: user?.uid ? { [user.uid]: 'admin' } : null
    });

    console.log('Garden created successfully!');
    return gardenId;
  } catch (error) {
    console.error('Failed to create garden:', error);
    throw error;
  }
}
```

### Example 2: Task Request and Approval Flow

```typescript
import db from '../../services/database';

// User requests to join a task
async function requestTask(gardenId: string, taskId: string, userId: string) {
  try {
    await db.tasks.addUserToRequests(gardenId, taskId, userId);
    console.log('Task request submitted');
  } catch (error) {
    console.error('Failed to request task:', error);
  }
}

// Admin approves the request
async function approveTaskRequest(
  gardenId: string,
  taskId: string,
  userId: string
) {
  try {
    // Remove from requests
    await db.tasks.removeUserFromRequests(gardenId, taskId, userId);

    // Add to assigned
    await db.tasks.addUserToAssigned(gardenId, taskId, userId);

    // Update status
    await db.tasks.updateTaskStatus(gardenId, taskId, 'assigned');

    // Get task details for user's task list
    const task = await db.tasks.getTaskById(gardenId, taskId);
    if (task) {
      await db.users.addTaskToUserList(userId, taskId, {
        taskId,
        gardenId,
        taskCreator: task.username,
        taskDesc: task.desc,
        taskEndTime: task.taskTime.split(' ')[1],
        taskIsDone: false,
        taskLocation: task.location,
        taskName: task.taskName,
        taskStartTime: task.taskTime.split(' ')[0],
        uidAssigned: task.uidAssigned
      });
    }

    console.log('Task request approved!');
  } catch (error) {
    console.error('Failed to approve request:', error);
  }
}
```

### Example 3: Displaying User Information

```typescript
import db from '../../services/database';

async function displayTaskWithUsernames(gardenId: string, taskId: string) {
  try {
    const task = await db.tasks.getTaskById(gardenId, taskId);

    if (!task) {
      console.log('Task not found');
      return;
    }

    // Get all usernames at once (efficient batch operation)
    const allUids = [
      ...task.uidAssigned,
      ...task.uidRequests,
      ...task.uidPendingApproval,
      ...task.uidCompleted
    ];

    const usernames = await db.users.getUsernamesByIds(allUids);

    console.log('Task:', task.taskName);
    console.log('Assigned users:', usernames.slice(0, task.uidAssigned.length));
    console.log('Requested by:', usernames.slice(
      task.uidAssigned.length,
      task.uidAssigned.length + task.uidRequests.length
    ));
  } catch (error) {
    console.error('Failed to load task:', error);
  }
}
```

---

## Switching Database Providers

To switch from Firebase to another database provider (e.g., MongoDB):

### Step 1: Create Implementation

Create a new directory for your database provider:

```
services/database/mongodb/
├── gardenService.ts
├── taskService.ts
├── userService.ts
├── storageService.ts
├── authService.ts
└── index.ts
```

### Step 2: Implement Interfaces

Each service must implement the corresponding interface from `interface.ts`:

```typescript
// services/database/mongodb/gardenService.ts
import { IGardenService } from '../interface';
import { GardenData, CreateGardenInput } from '../types';

export class MongoGardenService implements IGardenService {
  async createGarden(gardenData: CreateGardenInput): Promise<string> {
    // MongoDB implementation
    const result = await mongoDb.collection('gardens').insertOne(gardenData);
    return result.insertedId.toString();
  }

  async getAllGardens(): Promise<GardenData[]> {
    // MongoDB implementation
    const gardens = await mongoDb.collection('gardens').find().toArray();
    return gardens.map(doc => ({
      id: doc._id.toString(),
      ...doc
    }));
  }

  async getGardenById(gardenId: string): Promise<GardenData | null> {
    // MongoDB implementation
    const garden = await mongoDb.collection('gardens').findOne({
      _id: new ObjectId(gardenId)
    });

    if (!garden) return null;

    return {
      id: garden._id.toString(),
      ...garden
    };
  }
}
```

### Step 3: Create Service Bundle

```typescript
// services/database/mongodb/index.ts
import { IDatabaseService } from '../interface';
import { MongoGardenService } from './gardenService';
import { MongoTaskService } from './taskService';
import { MongoUserService } from './userService';
import { MongoStorageService } from './storageService';
import { MongoAuthService } from './authService';

class MongoDatabaseService implements IDatabaseService {
  gardens = new MongoGardenService();
  tasks = new MongoTaskService();
  users = new MongoUserService();
  storage = new MongoStorageService();
  auth = new MongoAuthService();
}

export const mongoDatabaseService = new MongoDatabaseService();
```

### Step 4: Update Entry Point

Change one line in `services/database/index.ts`:

```typescript
// Before
import { firebaseDatabaseService } from './firebase';
export const db = firebaseDatabaseService;

// After
import { mongoDatabaseService } from './mongodb';
export const db = mongoDatabaseService;
```

**That's it!** Your entire app now uses MongoDB without changing a single component.

---

## Performance Tips

### 1. Batch Operations

Instead of calling `getUsernameById()` multiple times:

```typescript
// ❌ Inefficient
const names = [];
for (const uid of userIds) {
  names.push(await db.users.getUsernameById(uid));
}

// ✅ Efficient
const names = await db.users.getUsernamesByIds(userIds);
```

### 2. Username Caching

The `UserService` automatically caches usernames to avoid repeated lookups. If you need to clear the cache (e.g., after a username change):

```typescript
// Access the service directly
import { firebaseDatabaseService } from '../services/database/firebase';
firebaseDatabaseService.users.clearCache();
```

### 3. Status Filtering

Use `getTasksByStatus()` instead of filtering manually:

```typescript
// ❌ Inefficient - fetches all tasks
const allTasks = await db.tasks.getTasksByGarden(gardenId);
const openTasks = allTasks.filter(t => t.taskStatus === 'open');

// ✅ Efficient - filtered query
const openTasks = await db.tasks.getTasksByStatus(gardenId, ['open']);
```

---

## Error Handling

All database operations can throw errors. Always use try-catch blocks:

```typescript
try {
  const gardens = await db.gardens.getAllGardens();
  console.log('Gardens:', gardens);
} catch (error) {
  console.error('Failed to load gardens:', error);
  // Show user-friendly error message
  Alert.alert('Error', 'Failed to load gardens. Please try again.');
}
```

---

## TypeScript Types

All types are exported from `services/database/types.ts`:

```typescript
import {
  GardenData,
  TaskData,
  UserProfile,
  UserTaskRecord,
  CreateGardenInput,
  CreateTaskInput,
  UploadProgress,
  UploadProgressCallback
} from '../../services/database';
```

### Key Interfaces

**GardenData**
```typescript
interface GardenData {
  id: string;
  imageURL: string | null;
  createdAt: string;
  gardenName: string;
  desc: string;
  username: string;
  userId: string | null;
  roles: { [userId: string]: string };
  userImage?: string;
}
```

**TaskData**
```typescript
interface TaskData {
  id: string;
  taskName: string;
  taskTime: string;
  desc: string;
  location: string;
  gardenId: string;
  username: string;
  uidAssigned: string[];
  uidRequests: string[];
  uidPendingApproval: string[];
  uidCompleted: string[];
  taskStatus?: 'open' | 'assigned' | 'approval' | 'completed';
}
```

**UserProfile**
```typescript
interface UserProfile {
  id: string;
  username?: string;
  bio?: string;
  role?: string[];
  vHours?: number;
  actvDate?: string;
  actvDet?: string;
  actvLoc?: string;
}
```

---

## Support

For questions or issues with the database abstraction layer, please refer to:

- Type definitions: `services/database/types.ts`
- Interface contracts: `services/database/interface.ts`
- Firebase implementation: `services/database/firebase/`
- This documentation: `services/database/README.md`
