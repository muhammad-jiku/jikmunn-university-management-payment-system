#!/bin/bash
# Apply pending migrations, then start
npx prisma migrate deploy
node dist/server.js