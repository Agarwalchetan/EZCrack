# EZdraw - Application Routes & Navigation

## 🗺️ Complete Route Map

### Public Routes (No Authentication Required)

#### `/` - Landing Page
**Purpose**: Marketing and introduction page
**Features**:
- Feature showcase with 6 key features
- Pricing link
- Sign up / Sign in buttons
- Beautiful gradient design
- Responsive layout

#### `/login` - User Login
**Purpose**: User authentication
**Features**:
- Email + password login
- Google OAuth integration
- GitHub OAuth integration
- "Remember me" option
- Forgot password link (coming soon)
- Link to sign up page

#### `/signup` - User Registration
**Purpose**: New user registration
**Features**:
- Email + password registration
- Google OAuth registration
- GitHub OAuth registration
- Full name input
- Auto-login after signup
- Link to login page

#### `/pricing` - Subscription Plans
**Purpose**: Display subscription tiers
**Features**:
- 4 subscription plans (Free, Pro, Business, Enterprise)
- Detailed feature comparison
- Pricing in ₹ (Indian Rupees)
- FAQ section
- "Most Popular" badge on Pro plan
- Contact sales option for Enterprise

---

### Protected Routes (Authentication Required)

#### `/dashboard` - User Dashboard
**Purpose**: Main canvas management interface
**Features**:
- Grid view of all user canvases
- Create new canvas button
- Search and filter canvases
- Delete canvas option
- Canvas preview thumbnails
- Last modified timestamps
- Quick navigation to Projects and Pricing
- Profile access

**Actions**:
- Create new canvas
- Open existing canvas
- Delete canvas
- Navigate to projects
- Access profile settings
- Sign out

#### `/canvas/:id` - Advanced Canvas Editor
**Purpose**: Main drawing interface with advanced features
**Features**:
- **Tool Panel** (Left):
  - 13 drawing tools (Select, Pen, Brush, Eraser, Line, Rectangle, Circle, Arrow, Text, Sticky Note, Callout, Image, Measure)
  - Color picker
  - Stroke width slider (1-100px)
  - Opacity slider (0-100%)

- **Main Canvas**:
  - Zoomable canvas (10%-1000%)
  - Pan functionality
  - Grid/dots/lined backgrounds
  - Real-time collaboration cursors
  - Pressure-sensitive drawing
  - Touch and stylus support

- **Layers Panel** (Right):
  - Unlimited layers
  - Layer visibility toggle
  - Layer lock/unlock
  - Rename layers
  - Reorder via drag-and-drop
  - Delete layers
  - Layer element count

- **Top Toolbar**:
  - Canvas title (editable)
  - Zoom controls with percentage
  - Settings button
  - Layers toggle
  - Version history
  - Save button (auto-save every 30s)
  - Export dropdown (PNG, SVG, PDF)

- **Collaborators**:
  - Live presence list
  - Colored cursors
  - Online indicators

- **Version History** (Slide-out):
  - Timeline of all versions
  - Restore previous versions
  - Version timestamps

- **Settings Panel**:
  - Background type selection
  - Snap to grid toggle
  - Show ruler toggle

- **Status Bar** (Bottom):
  - Canvas dimensions
  - Current zoom level
  - Layer count
  - Keyboard shortcuts reference

**Keyboard Shortcuts**:
- `Ctrl+S` - Save
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl++` - Zoom in
- `Ctrl+-` - Zoom out
- `B` - Brush tool
- `E` - Eraser
- `T` - Text
- `V` - Select
- `L` - Line
- `R` - Rectangle
- `O` - Circle

#### `/canvas-legacy/:id` - Legacy Canvas Editor
**Purpose**: Original simple canvas editor
**Features**:
- Basic drawing tools
- Real-time collaboration
- Version history
- Simpler interface
- Backward compatibility

#### `/projects` - Team Projects
**Purpose**: Organize canvases into team workspaces
**Features**:
- Grid view of all projects
- Create new project button
- Project cards with metadata
- Delete project option
- Canvas count per project
- Team member indicators
- Last updated timestamps

**Actions**:
- Create new project with name and description
- Open project to view canvases
- Delete project (with confirmation)
- Add team members (coming soon)
- Navigate to dashboard

#### `/profile` - User Profile & Settings
**Purpose**: Complete user account management
**Tabs**:

1. **Profile Tab**:
   - Avatar display with upload button
   - Full name editor
   - Email display (read-only)
   - Plan type badge
   - Save changes button

2. **Account Tab**:
   - Theme preference (Light/Dark/System)
   - Notification preferences:
     - Email notifications toggle
     - Collaboration updates toggle
     - Product updates toggle

3. **Privacy Tab**:
   - Export your data button (downloads JSON)
   - Delete account button (with confirmation)
   - Data usage information

4. **Integrations Tab**:
   - Google Drive (Connect button)
   - Dropbox (Connect button)
   - OneDrive (Connect button)
   - Slack (Connect button)
   - Notion (Connect button)

5. **Billing Tab**:
   - Current plan display
   - Plan features
   - Upgrade button
   - Billing history (coming soon)
   - Payment methods (coming soon)

6. **Activity Tab**:
   - Recent login history
   - Canvas creation/edit history
   - Profile updates
   - Security events

**Navigation**:
- Back to dashboard link
- Sidebar with 6 tabs
- Responsive layout

#### `/admin` - Admin Dashboard
**Purpose**: System administration and analytics
**Access**: Restricted to users with role = 'admin'

**Features**:
- **Statistics Cards**:
  - Total Users count
  - Total Canvases count
  - Total Projects count
  - Feedback Items count

- **Recent Users Panel**:
  - List of last 10 users
  - User email and name
  - Plan type badge
  - Admin badge (if applicable)

- **Recent Feedback Panel**:
  - Bug reports, feature requests, feedback
  - Status badges (new, in_progress, resolved)
  - Type badges (bug, feature, feedback)
  - Quick action buttons (Mark In Progress, Resolve)
  - Feedback title and description

**Actions**:
- View user statistics
- Monitor canvas creation
- Track feedback
- Update feedback status
- View user details

**Navigation**:
- Back to dashboard link
- Admin-only access

---

## 🔐 Route Protection

### Public Routes
- Accessible to everyone
- No authentication required
- Redirect logged-in users to dashboard (optional)

### Protected Routes
- Require authentication
- Redirect to `/login` if not authenticated
- Show loading spinner during auth check
- Preserve intended destination after login

### Admin Routes
- Require authentication
- Require `role = 'admin'` in user profile
- Redirect non-admin users to dashboard
- Additional security checks

---

## 🧭 Navigation Flow

### For New Users
1. Land on `/` (Landing)
2. Click "Get Started" → `/signup`
3. Create account
4. Auto-redirect to `/dashboard`
5. Click "New Canvas" → `/canvas/:id`
6. Start drawing

### For Returning Users
1. Visit any URL → redirected to `/login` if not authenticated
2. Login with credentials
3. Redirect to intended page or `/dashboard`
4. Access canvases, projects, profile

### For Admins
1. Login as admin user
2. Access `/admin` from profile or direct URL
3. View analytics and manage system
4. Return to dashboard via back button

---

## 📱 Responsive Behavior

### Mobile (375px - 767px)
- Simplified navigation
- Collapsible sidebars
- Touch-optimized controls
- Bottom sheet modals
- Hamburger menu

### Tablet (768px - 1023px)
- Two-column layouts
- Slide-out panels
- Touch and stylus support
- Adaptive toolbars

### Desktop (1024px+)
- Full three-column layouts
- Fixed sidebars
- Hover interactions
- Keyboard shortcuts
- Multi-panel views

---

## 🔗 Deep Linking

All routes support deep linking:
- `/canvas/abc123` - Direct link to specific canvas
- `/projects` - Direct link to projects page
- `/profile?tab=billing` - Direct link to specific profile tab (coming soon)
- `/admin` - Direct admin access

---

## 🚀 Navigation Performance

- **Code Splitting**: Each route loads its own chunk
- **Lazy Loading**: Routes loaded on demand
- **Prefetching**: Next likely routes prefetched
- **Caching**: Browser caching for static assets
- **Progressive Loading**: Skeleton screens while loading

---

## 📊 Route Analytics (Coming Soon)

- Page view tracking
- User flow analysis
- Conversion funnels
- Bounce rate monitoring
- Session duration
- Popular routes

---

## 🎯 Quick Access Links

From any protected route, users can access:
- **Dashboard** - Main canvas library
- **Projects** - Team workspaces
- **Pricing** - Upgrade options
- **Profile** - Account settings
- **Admin** - System management (admins only)
- **Sign Out** - Logout and return to landing

---

## 🔄 Redirect Rules

1. `/` → `/dashboard` (if authenticated)
2. `/login` → `/dashboard` (if already authenticated)
3. `/signup` → `/dashboard` (if already authenticated)
4. Protected routes → `/login` (if not authenticated)
5. `/admin` → `/dashboard` (if not admin)
6. `*` (404) → `/` (catch-all)

---

Built with React Router v6 | Client-side routing | Single Page Application
