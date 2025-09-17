# 🚀 NestJS + MYSQL Project

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Framework-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> 🎯 A modern full-stack application built with NestJS framework, MYSQL database, and file upload capabilities.

---

## ⚡ Quick Start

### 🔄 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git

# Navigate to project directory
cd your-repo
```

### 📦 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Alternative: Using Yarn
yarn install
```

### 🔧 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit your environment variables
nano .env
```

**Example `.env` configuration:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
```

---

## 🚀 Running the Application

### 🔥 Development Mode

```bash
# Start development server with hot reload
npm run start:dev

# Alternative commands
npm run start      # Production mode
npm run start:prod # Production with optimizations
```


### ▶️ Running Migrations

Execute pending migrations to update your database schema:

```bash
# Run all pending migrations
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./data-source.ts migration:run

# Check migration status
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./data-source.ts migration:show
```

### ⏪ Reverting Migrations

> ⚠️ **Important:** TypeORM reverts one migration at a time. Repeat the command to undo multiple migrations.

```bash
# Revert the most recent migration
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./data-source.ts migration:revert

# To revert multiple migrations, run the command multiple times
# Each execution rolls back the most recent migration
```

### 🆕 Creating New Migrations

```bash
# Generate a new migration
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./data-source.ts migration:generate src/migrations/YourMigrationName

# Create an empty migration
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./data-source.ts migration:create src/migrations/YourMigrationName
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

---

### 🔍 Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run start:dev

# MongoDB debug
DEBUG=mongodb:* npm run start:dev
```

---

### ☁️ Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```