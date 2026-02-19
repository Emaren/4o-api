# Deploy Notes (Stub)

Deployment flow target:
1. Build api artifacts
2. Sync to `/var/www/4o/4o-api`
3. `systemctl restart 4o-api.service`
4. `systemctl start 4o-worker.timer`
