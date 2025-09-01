# cwru.wtf Admin System

## Overview

The admin system provides secure access to manage member submissions and view analytics. It uses NextAuth.js for authentication with a custom credentials provider.

## Features

- 🔐 **Secure Authentication** - JWT-based sessions with bcrypt password hashing
- 👥 **Role-based Access** - Support for `admin` and `super_admin` roles
- 🛡️ **Route Protection** - Middleware automatically protects admin routes
- 📊 **Dashboard** - View submissions, statistics, and manage applications
- 🔄 **Real-time Updates** - Approve/reject submissions with immediate feedback

## Getting Started

### 1. Create Admin User

First, create an admin user using the provided script:

```bash
npm run create-admin
```

This will:
- Prompt for admin credentials
- Hash the password securely
- Store the user in the database
- Assign `super_admin` role

### 2. Access Admin Dashboard

1. Navigate to `/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin`

### 3. Manage Submissions

From the admin dashboard, you can:
- View all submissions with filtering
- See real-time statistics
- Approve or reject applications
- View submission details and interests

## Security Features

### Authentication
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Sessions**: Secure, stateless authentication
- **Session Management**: Automatic logout and session refresh

### Authorization
- **Route Protection**: Middleware blocks unauthorized access
- **API Protection**: All admin APIs require valid session
- **Role Checking**: Verify admin/super_admin roles

### Best Practices
- Environment variables for secrets
- HTTPS in production (set NEXTAUTH_URL accordingly)
- Regular password updates
- Limited admin accounts

## Database Schema

### Admin Users
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Submissions
```sql
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  interests TEXT NOT NULL,
  is_approved BOOLEAN, -- null = pending, true = approved, false = rejected
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Action Logs
```sql
CREATE TABLE action_logs (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES submissions(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Environment Variables

Required environment variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # Update for production
```

## API Endpoints

### Protected Admin Routes
- `GET /api/admin/submissions` - List all submissions
- `PATCH /api/admin/submissions` - Update submission status
- `GET /api/admin/stats` - Get submission statistics

### Authentication Routes
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

## Deployment Notes

### Production Checklist
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Use HTTPS
- [ ] Secure database credentials
- [ ] Limit admin accounts
- [ ] Regular backups
- [ ] Monitor access logs

### Security Considerations
- Change default admin password immediately
- Use strong passwords (12+ characters)
- Regular security audits
- Keep dependencies updated
- Monitor failed login attempts

## Troubleshooting

### Common Issues

**"Unauthorized" errors:**
- Check if user has admin/super_admin role
- Verify session is valid
- Ensure middleware is working

**Login failures:**
- Verify credentials are correct
- Check database connection
- Ensure admin user exists and is active

**Database errors:**
- Verify DATABASE_URL is correct
- Check if tables exist (run migrations)
- Ensure proper permissions

### Debug Mode

For development debugging, check:
- Network tab for API calls
- Browser console for errors
- Server logs for authentication issues

## Development

### Adding New Admin Features

1. Create protected API route in `/app/api/admin/`
2. Add authentication check using `auth()`
3. Implement frontend component
4. Update middleware if needed

### Custom Roles

To add new roles:
1. Update the database schema
2. Modify the JWT callback
3. Update middleware protection logic
4. Add role checks in components

---

For more information, see the [NextAuth.js documentation](https://authjs.dev/) and [Drizzle ORM docs](https://orm.drizzle.team/).
